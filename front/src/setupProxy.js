const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/spotify',
    createProxyMiddleware({
      target: 'https://api.spotify.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/spotify': '',
      },
    }),
  );
};
