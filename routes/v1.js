var Promise     = require('promise');
var _           = require('lodash');
var debug       = require('debug')('routes:v1');
var assert      = require('assert');
var base        = require('taskcluster-base');
var request     = require('superagent');
var url         = require('url');

// Headers to forward with the request
var REQUEST_HEADERS_TO_PROXY = [
  'Accept',
  'Accept-Charset',
  'Accept-Encoding',
  'Accept-Language',
  'Accept-Datetime',
  'Cache-Control',
  'Cookie',
  'Content-Length',
  'Content-MD5',
  'Content-Type',
  'Date',
  'If-Match',
  'If-Modified-Since',
  'If-None-Match',
  'If-Range',
  'If-Unmodified-Since',
  'Range',
  'Referer',
  'User-Agent'
].map(function(s) {
  return s.toLowerCase();
});

// Headers to return the response
var RESPONSE_HEADERS_TO_PROXY = [
  'Accept-Ranges',
  'Age',
  'Allow',
  'Cache-Control',
  'Content-Encoding',
  'Content-Language',
  'Content-Length',
  'Content-Location',
  'Content-MD5',
  'Content-Disposition[23]',
  'Content-Range',
  'Content-Type',
  'Date',
  'ETag',
  'Expires',
  'Last-Modified'
].map(function(s) {
  return s.toLowerCase();
});


/**
 * API end-point for version v1/
 */
var api = new base.API({
  title:        "HTTPS Proxy API Documentation",
  description: [
    "HTTPS proxy for TaskCluster web-users that needs to fetch HTTP resources."
  ].join('\n')
});

// Export api
module.exports = api;

/** Get resource from somewhere else */
api.declare({
  method:         'get',
  route:          '/fetch/:target(*)',
  name:           'fetchUrl',
  scopes:         ['https-proxy:fetch-url:<target>'],
  deferAuth:      true,
  title:          "Fetch URL",
  description: [
    "Fetch URL stream it back. Note that URL must be encoded with ",
    "`encodeURIComponent()`"
  ].join('\n')
}, function(req, res) {
  var ctx       = this;
  var target    = decodeURIComponent(req.params.target);
  var origin    = url.parse(req.headers.origin || '');

  // Ensure that we're either authenticated, or requesting from an origin that
  // is allowed
  if (ctx.allowedOrigins.indexOf(origin.hostname) === -1 &&
      !req.satisfies({target: req.params.target})) {
    return;
  }

  // Construct request headers
  var headers = {};
  REQUEST_HEADERS_TO_PROXY.forEach(function(header) {
    if (req.headers[header]) {
      headers[header] = req.headers[header];
    }
  });

  // Execute request and pipe back
  request
  .get(target)
  .set(headers)
  .buffer(false)
  .end(function(resp) {
    RESPONSE_HEADERS_TO_PROXY.forEach(function(header) {
      if (resp.headers[header]) {
        res.set(header, resp.headers[header]);
      }
    });
    res.status(resp.status);
    resp.pipe(res);
  });
});

/** Check that the server is a alive */
api.declare({
  method:   'get',
  route:    '/ping',
  name:     'ping',
  title:    "Ping Server",
  description: [
    "Documented later...",
    "",
    "**Warning** this api end-point is **not stable**."
  ].join('\n')
}, function(req, res) {
  res.status(200).json({
    alive:    true,
    uptime:   process.uptime()
  });
});