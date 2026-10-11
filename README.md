# bogons (TypeScript / JavaScript)

[![npm version](https://img.shields.io/npm/v/bogons.svg)](https://www.npmjs.com/package/bogons)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

Lean, high-performance, zero-dependency TypeScript & JavaScript library for validating IP address, subnet prefix, and ASN [bogons](https://en.wikipedia.org/wiki/Bogon_filtering) with RFC descriptions.

Works seamlessly across Node.js, Cloudflare Workers, Deno, Bun, and web browsers.

## Features

- **Zero Dependencies**: Pure modern JavaScript and TypeScript; runs anywhere without heavy runtime dependencies.
- **Edge & Serverless Ready**: First-class support for Cloudflare Workers, Vercel, and AWS Lambda.
- **Dual ESM & CommonJS**: Full support for both `import` and `require()`, plus complete TypeScript type declarations (`.d.ts`).
- **IP Validation & Reasons**: Validates IPv4 and IPv6 addresses with RFC reason descriptions (`checkIp`, `isPublicIp`).
- **ASN Validation & Parsing**: Validates 32-bit AS numbers with static RFC descriptions; supports `asplain` ("15169"), `AS`-prefixed ("AS15169"), and `asdot` ("1.0") notation (`parseAsn`, `checkAsn`).
- **BGP Announcement Validation**: Enforces BGP routing limits (/8–/24 for IPv4, /16–/48 for IPv6) and rejects prefixes with host bits set (`validPublicPrefix`).

## Multi-Language Implementations

The `bogons` library is maintained with 100% feature parity, RFC attribution, and synchronized versioning across 6 languages:

| Language | Repository (GitHub) | Package Registry | Installation |
|---|---|---|---|
| **Go** | [mellowdrifter/bogons](https://github.com/mellowdrifter/bogons) | [pkg.go.dev](https://pkg.go.dev/github.com/mellowdrifter/bogons) | `go get github.com/mellowdrifter/bogons` |
| **Python** | [mellowdrifter/python-bogons](https://github.com/mellowdrifter/python-bogons) | [PyPI](https://pypi.org/project/bogons/) | `pip install bogons` |
| **Rust** | [mellowdrifter/rust-bogons](https://github.com/mellowdrifter/rust-bogons) | [crates.io](https://crates.io/crates/bogons) | `cargo add bogons` |
| **C** | [mellowdrifter/c-bogons](https://github.com/mellowdrifter/c-bogons) | [libbogons](https://github.com/mellowdrifter/c-bogons/releases) | Single-header / `make install` |
| **C++** | [mellowdrifter/cpp-bogons](https://github.com/mellowdrifter/cpp-bogons) | [CMake / Header-only](https://github.com/mellowdrifter/cpp-bogons/releases) | `#include <bogons/bogons.hpp>` |
| **TypeScript / JS** | [mellowdrifter/ts-bogons](https://github.com/mellowdrifter/ts-bogons) | [npm](https://www.npmjs.com/package/bogons) | `npm install bogons` |

## Installation

```bash
npm install bogons
```

Or with pnpm / yarn / bun:

```bash
pnpm add bogons
# or
bun add bogons
```

## Usage

### ES Modules (TypeScript / Modern JS)

```typescript
import { isPublicIp, checkIp, checkAsn, parseAsn, validPublicPrefix } from 'bogons';

// IP Validation with RFC Reason
const { isPublic, reason } = checkIp('10.0.0.1');
console.log(isPublic, reason); // false "RFC 1918 (Private-Use)"

// Boolean IP Check
console.log(isPublicIp('8.8.8.8')); // true
console.log(isPublicIp('192.168.1.1')); // false

// ASN Validation
const asnCheck = checkAsn(64512);
console.log(asnCheck.reason); // "RFC 1930 / RFC 6996 (Private-Use 16-bit)"

// ASN Parsing (supports decimal, AS prefix, asdot)
console.log(parseAsn('AS1.0')); // 65536

// BGP Announcement Prefix Validation
console.log(validPublicPrefix('8.8.8.0/24')); // true
console.log(validPublicPrefix('8.8.8.1/24')); // false (host bits set)
```

### CommonJS

```javascript
const { isPublicIp, checkIp } = require('bogons');

console.log(isPublicIp('1.1.1.1')); // true
```

## License

Licensed under the Apache License, Version 2.0.
