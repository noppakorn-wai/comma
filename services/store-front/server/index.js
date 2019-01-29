import { parse } from 'url'
import next from 'next'
import conf from './next.config'

const app = next({
  conf,
  dev: process.env.NODE_ENV !== 'production',
  dir: '.',
})
const handle = app.getRequestHandler()

const appPreparation = app.prepare()

export default async (req, res) => {
  await appPreparation
  const parsedUrl = parse(req.url, true)
  const { pathname, query } = parsedUrl
  if (pathname === '/') return app.render(req, res, '/home', query)
  return handle(req, res, parsedUrl)
}
