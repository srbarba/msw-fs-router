# msw-fs-router

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/msw-fs-router?color=yellow)](https://npmjs.com/package/msw-fs-router)
[![npm downloads](https://img.shields.io/npm/dm/msw-fs-router?color=yellow)](https://npm.chart.dev/msw-fs-router)

<!-- /automd -->

> **⚠️ Warning: This package is experimental and currently only works with Node.js because it uses `globby`. I am in the process of converting this into a plugin with `unplugin` to make it usable both in Node.js and the browser.**

`msw-fs-router` is a package that provides a file system-based router for mocking server responses using [Mock Service Worker (MSW)](https://mswjs.io/).

It allows you to define your mock routes and responses in a file system structure, making it easier to manage and scale your mock API.

## Usage

Install package:

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install msw-fs-router

# npm
npm install msw-fs-router

# yarn
yarn add msw-fs-router

# pnpm
pnpm install msw-fs-router

# bun
bun install msw-fs-router

# deno
deno install msw-fs-router
```

<!-- /automd -->

Import:

<!-- automd:jsimport cjs cdn name="msw-fs-router" imports="defineMswHandler,getMswHandlers" -->

**ESM** (Node.js, Bun, Deno)

```js
import { defineMswHandler, getMswHandlers } from "msw-fs-router";
```

**CommonJS** (Legacy Node.js)

```js
const { defineMswHandler, getMswHandlers } = require("msw-fs-router");
```

**CDN** (Deno, Bun and Browsers)

```js
import { defineMswHandler, getMswHandlers } from "https://esm.sh/msw-fs-router";
```

<!-- /automd -->

## API

<!-- automd:jsdocs src="src/index" -->

### `defaults`

#### `scanPattern`

- **Type**: `string`
- **Default**: `"**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"`

#### `suffixRegex`

The regular expression used to match file suffixes.

### `defineMswHandler(resolver)`

Define an MSW (Mock Service Worker) handler in a simple and typed way with TypeScript.

**Example:**

```typescript
// src/handlers/user.ts
import { defineMswHandler } from "msw-fs-router";
import { HttpResponse } from "msw";

export default defineMswHandler(() => {
  return HttpResponse.json({
    id: "abc-123",
    firstName: "John",
    lastName: "Doe",
  });
});
```

### `getMswHandlers(options)`

Asynchronously retrieves the MSW (Mock Service Worker) handlers by scanning the specified routes in the filesystem.

**Example:**

```typescript
import { setupServer } from "msw/node";
import { getMswHandlers } from "msw-fs-router";

const options = {
  baseURL: "http://localhost:3000",
  scanDirs: ["./src/handlers"],
};

const handlers = await getMswHandlers(options);
const server = setupServer(...handlers);
server.listen();
```

<!-- /automd -->

## Development

<details>

<summary>local development</summary>

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

</details>

## Acknowledgements

Special thanks to the [unjs](https://github.com/unjs) community and the [Nitro](https://github.com/unjs/nitro) library, as the functionality of this package has been directly extracted from their code. Your contributions are greatly appreciated!

And thanls to the [MSW](https://mswjs.io/) team for their seamless API mocking library!

## License

<!-- automd:contributors license=MIT -->

Published under the [MIT](https://github.com/srbarba/msw-fs-router/blob/main/LICENSE) license.
Made by [community](https://github.com/srbarba/msw-fs-router/graphs/contributors) 💛
<br><br>
<a href="https://github.com/srbarba/msw-fs-router/graphs/contributors">
<img src="https://contrib.rocks/image?repo=srbarba/msw-fs-router" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
