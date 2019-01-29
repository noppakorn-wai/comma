import http from 'http'
import { parse } from 'url'
import httpProxy from 'http-proxy'

const proxy = httpProxy.createProxyServer()

const server = http.createServer((req, res) => {
  const parsedUrl = parse(req.url, true)
  const { pathname } = parsedUrl
  if (pathname.startsWith('/static/stores/')) {
    const storeId = pathname.split('/')[3]
    proxy.web(req, res, {
      target: `http://localhost:8000/${storeId}`,
    })
  } else {
    proxy.web(req, res, {
      target: 'http://localhost:8000/shared-bucket',
    })
  }
})

server.listen(9002)
