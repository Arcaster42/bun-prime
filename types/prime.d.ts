import { ServerWebSocket } from "bun"

export class PrimeServer {
  public port: number
  constructor(port: number)
  routes: PrimeRoute[]
  websocket: WebSocket
  wsHandlers: WSHandlers

  public get(path: string, handler: (req, params?) => Response): void
  public post(path: string, handler: (req, params?) => Response): void
  public put(path: string, handler: (req, params?) => Response): void
  public delete(path: string, handler: (req, params?) => Response): void
  public ws(path: string, handlers: WSHandlers): void
  public serve(options?: PrimeServeOptions): void
}

export interface PrimeRoute {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  handler: (req: Request, params?: Record<string, any>) => Response | Promise<Response>
  paramIndexes?: number[]
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface WSHandlers {
  open: (ws: ServerWebSocket<unknown>) => void
  message: (ws: ServerWebSocket<unknown>, message: string | Uint8Array) => void
  close: (ws: ServerWebSocket<unknown>, code, message: string | Uint8Array) => void
  drain: (ws: ServerWebSocket<unknown>) => void
}

export interface PrimeServeOptions {
  logStart?: boolean
}