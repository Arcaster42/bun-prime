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
    if (!route.path.includes(':') && !route.path.includes('*')) {
      if (route.path === url.pathname && route.method === req.method) {
        return route.handler(req)
      }
    } else {
      const pathArray = route.path.split('/')
      const urlArray = url.pathname.split('/')
      console.log(pathArray, urlArray)
      if (pathArray.length === urlArray.length && route.method === req.method && compareRoute(pathArray, urlArray)) {
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

const compareRoute = (pathArray: string[], urlArray: string[]) => {
  for (const [i, path] of Object.entries(pathArray)) {
    console.log('comp', path, urlArray[i])
    if (!pathArray[i].includes(':') && !pathArray[i].includes('*')) {
      if (pathArray[i] !== urlArray[i]) return false
    }
  }
  return true
}