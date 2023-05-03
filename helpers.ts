import { PrimeRoute } from "./types/prime"

export const handleRouting = (req: Request, primeRoutes: PrimeRoute[]) => {
  const url = new URL(req.url)
  for (const route of primeRoutes) {
    // Apply Middleware
    if (route.path === '*' && (route.method === '*' || route.method === req.method)) {
      if (route.middleware) {
        const middlewareResult = route.middleware(req)
        if (middlewareResult instanceof Response) return middlewareResult
        else continue
      }
    }
    if (!route.path.includes(':')) {
      if (route.path === url.pathname && route.method === req.method) {
        return route.handler(req)
      }
    } else {
      const pathArray = route.path.split('/')
      const urlArray = url.pathname.split('/')
      if (pathArray.length === urlArray.length && route.method === req.method) {
        const params = {}
        for (let i = 0; i < pathArray.length; i++) {
          if (pathArray[i].includes(':')) {
            params[pathArray[i].replace(':', '')] = urlArray[i]
          }
        }
        return route.handler(req, params)
      }
    }
  }
  return new Response('Not found', { status: 404 })
}