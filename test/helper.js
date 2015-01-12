var assert      = require('assert');
var Promise     = require('promise');
var path        = require('path');
var _           = require('lodash');
var base        = require('taskcluster-base');
var v1          = require('../routes/v1');
var taskcluster = require('taskcluster-client');

// Some default clients for the mockAuthServer
var defaultClients = [
  {
    clientId:     'test-client',  // Hardcoded in config/test.js
    accessToken:  'none',
    scopes:       ['*'],
    expires:      new Date(3000, 0, 0, 0, 0, 0, 0)
  }
];

/** Return a promise that sleeps for `delay` ms before resolving */
exports.sleep = function(delay) {
  return new Promise(function(accept) {
    setTimeout(accept, delay);
  });
}

/** Poll a function that returns a promise, until it resolves */
exports.poll = function(doPoll, attempts, interval) {
  attempts = attempts || 90;
  interval = interval || 1000;
  var pollAgain = function() {
    return doPoll().catch(function(err) {
      if (attempts > 0) {
        attempts -= 1;
        return exports.sleep(interval).then(function() {
          return pollAgain();
        });
      }
      throw err;
    });
  };
  return pollAgain();
};

/** Setup testing */
exports.setup = function(options) {
  // Provide default configuration
  options = _.defaults(options || {}, {
    title:      'untitled test'
  });

  // Create subject to be tested by test
  var subject = {};

  // Configure server
  var server = new base.testing.LocalApp({
    command:      path.join(__dirname, '..', 'bin', 'server.js'),
    args:         ['test'],
    name:         'server.js',
    baseUrlPath:  '/v1'
  });

  // Hold reference to mockAuthServer
  var mockAuthServer = null;

  // Setup server
  setup(function() {
    // Create mock authentication server
    return base.testing.createMockAuthServer({
      port:         60021, // This is hardcoded into config/test.js
      clients:      defaultClients,
      credentials:  {
        clientId:     'test-client',
        accessToken:  'none'
      }
    }).then(function(mockAuthServer_) {
      mockAuthServer = mockAuthServer_;
    }).then(function() {
      // Launch server
      var serverLaunched = server.launch().then(function(baseUrl) {
        // Create client for working with API
        subject.baseUrl = baseUrl;
        var reference = v1.reference({baseUrl: baseUrl});
        subject.HttpsProxy = taskcluster.createClient(reference);
        subject.httpsProxy = new subject.HttpsProxy({
          baseUrl:          baseUrl,
          credentials: {
            clientId:       'test-client',
            accessToken:    'none'
          }
        });
      });

      return serverLaunched;
    });
  });

  // Shutdown server
  teardown(function() {
    // Kill server
    return server.terminate().then(function() {
      return mockAuthServer.terminate();
    });
  });

  return subject;
};
