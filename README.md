# Prime

Prime is a light-weight, minimalistic framework for creating REST APIs using
[Bun](https://bun.sh/). It is modeled lightly after the
[Express](https://expressjs.com/) framework for Node.

## Purpose

Prime is designed to let developers try out Bun quickly and easily using a more
familiar API. It is not currently intended for use in a production environment.

## Installation

You can install Prime with the Bun command: `bun add bun-prime`

## Quickstart

Import the `PrimeServer` class and instantiate it with the port as an argument.

```
import { PrimeServer } from './prime'
const server = new PrimeServer(3000)
```

Add routes on the new instantiation.

```
server.get('/', (req) => {
  return new Response('Hello, Prime!')
})
```

Serve.

```
server.serve({ logStart: true }) // Will output message on server start
```

## Features

Some fundamental features are currently present.

### JSDoc

Most of the current implementations have thorough JSDoc details to make easy use
of the API.

### Route Parameters

You can use slugs in the routes. When you want to use parameters, add them as an
object, and you can type them as well for easy access.

```
server.get('/blog/:id/content', (req, params: { id: number }) => {
  return new Response(`Blog ${params.id} content`)
})
```

**NOTE**: Wildcards (`*`) are not yet supported.

### Websocket

Web sockets are supported with a simple API. You only need to prepare the
handlers.

```
const messageHandler = (ws, message) => {
  console.log(message)
}

server.ws('ws://localhost:3000', {
  open: openHandler,
  message: messageHandler,
  close: closeHandler,
  drain: drainHandler
})
```

With this, once the server is served, all incoming web socket connections will
be handled appropriately.

## Usage Details

- Curently, a 404 will be returned by default when a route doesn't catch
- Currently, a 500 will be returned on any error
- Additional support for routes not found and error handling is not implemented

## Development

This is a personal project that will continue while I experiment with Bun and
with fundamentals of a reliable library for creating REST APIs. If any interest
develops, I will devote more time to it.
