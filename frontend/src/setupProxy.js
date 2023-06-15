// eslint-disable-next-line no-undef
const { createProxyMiddleware } = require('http-proxy-middleware') //Create Prox Server

// eslint-disable-next-line no-undef
module.exports = function (app) { //Add Proxy Server
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:3001',
            changeOrigin: true,
        })
    )
}
