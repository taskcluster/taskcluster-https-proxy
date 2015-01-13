suite("Proxy", function() {
  var Promise     = require('promise');
  var assert      = require('assert');
  var debug       = require('debug')('https-proxy:test:proxy_test');
  var helper      = require('./helper');
  var _           = require('lodash');
  var subject     = helper.setup({title: "proxy test"});
  var request     = require('superagent-promise');

  test("ping", function() {
    return subject.httpsProxy.ping();
  });

  test("proxy ping", function() {
    var pingUrl = subject.httpsProxy.buildUrl(
      subject.httpsProxy.ping
    );
    return subject.httpsProxy.fetchUrl(encodeURIComponent(pingUrl));
  });

  test("proxy ping (unauthorized)", function() {
    var pingUrl = subject.httpsProxy.buildUrl(
      subject.httpsProxy.ping
    );
    var httpsProxy = new subject.HttpsProxy();
    return httpsProxy.fetchUrl(encodeURIComponent(pingUrl)).then(function() {
      assert(false, "expected authentication error");
    }, function(err) {
      assert(err.statusCode === 401, "Expected authentication error");
    });
  });

  test("proxy ping (authentication by origin)", function() {
    var pingUrl = subject.httpsProxy.buildUrl(
      subject.httpsProxy.ping
    );
    var httpsProxy = new subject.HttpsProxy();
    var fetchUrl = httpsProxy.buildUrl(
      httpsProxy.fetchUrl,
      encodeURIComponent(pingUrl)
    );
    return request
    .get(fetchUrl)
    .set('origin', 'http://dummy-origin')
    .end().then(function(res) {
      assert(res.ok, "Request failed!");
    });
  });
});