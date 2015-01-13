TaskCluster HTTPS Proxy
=======================

This is a simple component that will allow you to fetch a URL over HTTPS.
The idea that is web clients running on HTTPS can fetch HTTP resources using
this proxy, in order to avoid mixed content errors.

There are two possible to authenticate with the proxy:

  1. Specify a `origin` header that is allowed, say `tools.taskcluster.net`,
  2. Sign the request with TaskCluster credentials with the scope:
     `https-proxy:fetch-url:<target>`

A list of space-separated allowed origin is specified in the configuration.