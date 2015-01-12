module.exports = {
  // Https proxy configuration
  proxy: {
    // Publish references and schemas
    publishMetaData:              'false',

    // Component name in statistics
    statsComponent:               'https-proxy'
  },

  // Server configuration
  server: {
    // Public URL from which the server can be accessed (used for persona)
    publicUrl:                      'https://https-proxy.taskcluster.net',

    // Port to listen for requests on
    port:                           80,

    // Environment 'development' or 'production'
    env:                            'production',

    // Force SSL, not useful when runnning locally
    forceSSL:                       true,

    // Trust a forwarding proxy
    trustProxy:                     true
  }
};
