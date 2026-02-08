---
"mpay": minor
---

**Breaking:** Renamed `client` parameter to `getClient`.

```diff
- tempo.charge({ client: (chainId) => createClient({ ... }) })
+ tempo.charge({ getClient: (chainId) => createClient({ ... }) })
```
