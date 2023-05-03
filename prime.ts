import { handleRouting } from "./helpers"
import { PrimeRoute, PrimeServeOptions, WSHandlers } from "./types/prime"

/**
 * This is the main class for the Prime framework.
 * @class
 */
export class PrimeServer {
  port: number
  routes: PrimeRoute[] = []
  websocket: WebSocket
  wsHandlers: WSHandlers

  /**
   * PrimeServer constructor.
   * 
   * **Example**
   * ```ts
   * import { PrimeServer } from 'PrimeServer'
   * 
   * const server = new PrimeServer(3000)
   * ```
   * 
   * @constructor
   * @param {number} port 
   */
  constructor(port: number) {
    this.port = port
  }

  /**
   * This adds a new GET endpoint to the server.
   * 
   * **Example**
   * ```ts
   * server.get('/', (req) => {
   *   return new Response('OK', { status: 200 })
   * })
   * ```
   * **Example**
   * ```ts
   * server.get('/blog/:id', (req, params: { id: number }) => {
   *  return new Response(`Blog ${params.id}`)
   * })
   * ```
   * 
   * @param path - URL path
   * @param handler - Handler for the route
   */
  public get(path: string, handler: (req, params?) => Response) {
    this.routes.push({ path, method: 'GET', handler })
  }

  /**
   * This adds a new POST endpoint to the server.
   * 
   * **Example**
   * ```ts
   * server.post('/', async (req) => {
   *  const body = await req.json()
   *  if (isValid(body.username, body.password)) {
   *   return new Response('OK', { status: 201 })
   *  }
   *  return new Response('Unauthorized', { status: 401 })
   * })
   * ```
   * 
   * @param path - URL path
   * @param handler - Handler for the route
   */
  public post(path: string, handler: (req: Request) => Response | Promise<Response>) {
    this.routes.push({ path, method: 'POST', handler })
  }

  /**
   * This creates and initializes a websocket.
   * Requires handlers for all events (open, message, close, drain).
   * 
   * **Example**
   * ```ts
   * server.ws('ws://localhost:3000/ws', {
   *  open: (ws) => { console.log('Incoming Connection: ', ws) },
   *  // other events
  *  })
   * ```
   * **Example**
   * ```ts
   * server.ws('ws://localhost:3000/ws', {
   *  open: openHandler,
   *  message: messageHandler,
   *  // other events
   * })
   * ```
   * 
   * @param url - URL to host the websocket on
   * @param handlers - Event handlers for the websocket
   */
  public ws(url: string, handlers: WSHandlers) {
    this.websocket = new WebSocket(url)
    this.wsHandlers = handlers
  }

  /**
   * This applies middleware to be called for any route below.
   * Return a response to end the request.
   * Void functions will continue to the next middleware or route.
   * 
   * **Example**
   * ```ts
   * server.use((req) => {
   *   if (!isAuthorized(req)) {
   *     return new Response('Bad Auth', { status: 401 })
   *   }
   * })
   * ```
   */
  public use(middleware: (req) => Response | Promise<Response> | void) {
    this.routes.push({ path: '*', method: '*', middleware })
  }

  /**
   * This starts the server.
   * It will handle all requests and websocket events.
   * 
   * **Example**
   * ```ts
   * server.serve({
   *   logStart: true, // logs "Server started on port ${port}"
   *   dev: true // enabled Bun dev mode for debugging
   * })
   * ```
   */
  public serve(options?: PrimeServeOptions) {
    const primeRoutes = this.routes
    const ws = this.websocket
    const server = Bun.serve({
      port: this.port,
      fetch(req) {
        if (ws && server.upgrade(req)) {
          return
        }
        return handleRouting(req, primeRoutes)
      },
      error(error) {
        return new Response(`<pre>${error}\n${error.stack}</pre>`, { status: 500 })
      },
      websocket: this.websocket ? {
        open: (ws) => this.wsHandlers.open(ws),
        message: (ws, message) => this.wsHandlers.message(ws, message),
        close: (ws, code, message) => this.wsHandlers.close(ws, code, message),
        drain: (ws) => this.wsHandlers.drain(ws)
      } : undefined
    })
    if (options?.logStart) console.log(`Server started on port ${this.port}`)
  }
}

// exports.PrimeServer = PrimeServer