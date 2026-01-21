# mpay

TypeScript implementation of the "Payment" HTTP Authentication Scheme (402 Protocol).

## Vision

mpay provides abstractions for the complete HTTP 402 payment flow — both client and server. The architecture has three layers:

### Core Abstractions

1. **`Mpay`** — Top-level abstraction over the HTTP payment spec. Handles challenge/credential parsing, header serialization, and the 402/401 response flow. This is the protocol skeleton that works with any payment network.

2. **`PaymentMethod`** — Extensible adapters for specific payment networks (Tempo, Stripe, x402, Lightning, etc.). Each method defines its own request/payload schemas and verification logic. Consumers can build custom methods to plug into `Mpay`.

3. **`Intent`** — Actions that hang off a `PaymentMethod`. Standard intents include `charge`, `authorize`, and `subscription`. Each intent defines what the server requests and what the client must prove.

### Hierarchy

```
Mpay
  └── PaymentMethod (tempo, stripe, x402, ...)
        └── Intent (charge, authorize, subscription, ...)
```

## Commands

```bash
pnpm build          # Build with zile
pnpm check          # Lint and format with biome
pnpm check:types    # TypeScript type checking
pnpm test           # Run tests with vitest
```

## Skills Reference

Load these skills for specialized guidance:

### `payment-auth-scheme-author`

**Use when**: Implementing payment intents, understanding the 402 protocol flow, working with Tempo/Stripe payment method schemas, or referencing the IETF spec.

### `typescript-library-best-practices`

**Use when**: Building new modules, structuring exports, or following library patterns.

### `typescript-style-guide`

**Use when**: Writing or reviewing TypeScript code for style and conventions.

### `tempo-developer`

**Use when**: Referencing Tempo protocol specifics, understanding TIP-20 tokens, Tempo transactions (0x76), or protocol-level details.
