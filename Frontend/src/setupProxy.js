const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const API_BASE_URL = "http://localhost:3000";
  console.log(
    `[setupProxy] Configuring proxy for auth and other endpoints to ${API_BASE_URL}`
  );

  // Proxy for auth and other endpoints (but not vacancies)
  app.use(
    "/api",
    createProxyMiddleware({
      target: API_BASE_URL,
      changeOrigin: true,
      secure: false,
      logLevel: "debug",
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[Proxy] Proxying ${req.method} ${req.url} to ${proxyReq.path}`
        );
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`[Proxy] Response: ${proxyRes.statusCode} for ${req.url}`);
      },
      onError: (err, req, res) => {
        console.error("Proxy error:", err.message);
        if (!res.headersSent) {
          res.writeHead(500, {
            "Content-Type": "text/plain",
          });
          res.end("Proxy error: " + err.message);
        }
      },
    })
  );
};
