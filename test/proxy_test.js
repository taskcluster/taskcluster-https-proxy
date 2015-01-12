suite("Proxy", function() {
  var Promise     = require('promise');
  var assert      = require('assert');
  var debug       = require('debug')('https-proxy:test:proxy_test');
  var helper      = require('./helper');
  var _           = require('lodash');
  var subject     = helper.setup({title: "proxy test"});

  test("ping", function() {
    return subject.httpsProxy.ping();
  });

  test("proxy ping", function() {
    var pingUrl = subject.httpsProxy.buildUrl(
      subject.httpsProxy.ping
    );
    return subject.httpsProxy.fetchUrl(encodeURIComponent(pingUrl));
  });
});