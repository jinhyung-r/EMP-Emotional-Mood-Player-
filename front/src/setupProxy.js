const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api/spotify', // 클라이언트에서 이 경로로 요청하면
    createProxyMiddleware({
      target: 'https://api.spotify.com', // Spotify API로 요청을 보냄
      changeOrigin: true,
      pathRewrite: {
        '^/api/spotify': '', // '/api/spotify' 경로를 제거하여 실제 요청을 '/v1/me' 등으로 보냄
      },
    }),
  );
};
