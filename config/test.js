module.exports = {
  proxy: {
    publishMetaData:              'false',
    statsComponent:               'test-https-proxy',
    allowedOrigins:               'dummy-origin'
  },

  taskcluster: {
    authBaseUrl:                  'http://localhost:60021/v1',
    credentials: {
      clientId:                   'test-client',
      accessToken:                'none'
    }
  },

  server: {
    publicUrl:                    'http://localhost:60020',
    port:                         60020
  }
};