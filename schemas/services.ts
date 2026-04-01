/**
 * NanoPay Service Registry
 *
 * Edit this file to add or modify services.
 * Generated artifacts (discovery.json, llms.txt, icons) are built
 * automatically during `pnpm dev` and `pnpm build`.
 */

// --- Shared constants ---
export const NANOPAY_REALM = "services.nanopay.org";

// --- Types ---
export const CATEGORIES = [
  "ai",
  "blockchain",
  "compute",
  "data",
  "media",
  "search",
  "social",
  "storage",
  "web",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const INTEGRATIONS = ["first-party", "third-party"] as const;
export type Integration = (typeof INTEGRATIONS)[number];

export const STATUSES = [
  "active",
  "beta",
  "deprecated",
  "maintenance",
] as const;
export type Status = (typeof STATUSES)[number];

export const INTENTS = ["charge", "session"] as const;
export type Intent = (typeof INTENTS)[number];

export const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
] as const;
export type HttpMethod = (typeof HTTP_METHODS)[number];

export interface PaymentDefaults {
  method: string;
  currency: string;
  decimals: number;
}

/** NanoPay USDT on TON */
export const NANOPAY_PAYMENT: PaymentDefaults = {
  method: "nanopay",
  currency: "USDT",
  decimals: 6,
};

export interface EndpointDef {
  route: string;
  desc: string;
  amount?: string;
  dynamic?: true;
  amountHint?: string;
  intent?: Intent;
  unitType?: string;
  docs?: string | false;
}

export interface ServiceDef {
  id: string;
  name: string;
  url: string;
  serviceUrl: string;
  description: string;
  icon?: string;
  categories: Category[];
  integration: Integration;
  tags: string[];
  status?: Status;
  docs?: { homepage?: string; llmsTxt?: string; apiReference?: string };
  provider?: { name: string; url: string };
  realm: string;
  intent: Intent;
  payment: PaymentDefaults;
  docsBase?: string;
  endpoints: EndpointDef[];
}

// prettier-ignore
export const services: ServiceDef[] = [
  // ── CyberEmail ─────────────────────────────────────────────────────────
  {
    id: "email",
    name: "CyberEmail",
    url: "https://email.cyberpay.org",
    serviceUrl: `https://email.${NANOPAY_REALM}`,
    description:
      "Disposable inboxes, verification code extraction, agent email, and custom domain sending for AI agents.",
    categories: ["social"],
    integration: "first-party",
    tags: [
      "email",
      "inbox",
      "verification",
      "disposable",
      "agent-email",
      "resend",
    ],
    status: "beta",
    docs: { homepage: "https://github.com/CyberpayOrg/cyber-email" },
    provider: { name: "CyberPay", url: "https://cyberpay.org" },
    realm: NANOPAY_REALM,
    intent: "charge",
    payment: NANOPAY_PAYMENT,
    endpoints: [
      // Mail.tm — disposable inboxes
      { route: "GET /api/email/domains", desc: "List available email domains" },
      {
        route: "POST /api/email/account",
        desc: "Create disposable email account",
        amount: "5000",
      },
      { route: "POST /api/email/login", desc: "Login to email account" },
      {
        route: "GET /api/email/messages",
        desc: "List inbox messages",
        amount: "1000",
      },
      {
        route: "GET /api/email/messages/:id",
        desc: "Read a specific message",
        amount: "1000",
      },
      {
        route: "GET /api/email/extract-code/:id",
        desc: "Extract verification code from email",
        amount: "2000",
      },
      // AgentMail — professional agent email
      {
        route: "POST /api/agentmail/inbox",
        desc: "Create agent inbox",
        amount: "10000",
      },
      {
        route: "POST /api/agentmail/send",
        desc: "Send email from agent inbox",
        amount: "5000",
      },
      {
        route: "GET /api/agentmail/messages",
        desc: "List agent inbox messages",
        amount: "1000",
      },
      // Resend — custom domain
      {
        route: "POST /api/resend/send",
        desc: "Send email from custom domain",
        amount: "5000",
      },
    ],
  },

  // ── CyberSMS ───────────────────────────────────────────────────────────
  {
    id: "sms",
    name: "CyberSMS",
    url: "https://sms.cyberpay.org",
    serviceUrl: `https://sms.${NANOPAY_REALM}`,
    description:
      "Virtual phone numbers, SMS verification codes, and two-way messaging for AI agents.",
    categories: ["social"],
    integration: "first-party",
    tags: [
      "sms",
      "phone",
      "verification",
      "virtual-number",
      "twilio",
      "messaging",
    ],
    status: "beta",
    docs: { homepage: "https://github.com/CyberpayOrg/cyber-sms" },
    provider: { name: "CyberPay", url: "https://cyberpay.org" },
    realm: NANOPAY_REALM,
    intent: "charge",
    payment: NANOPAY_PAYMENT,
    endpoints: [
      // One-time verification
      {
        route: "POST /api/sms/number",
        desc: "Get a virtual number for verification",
        amount: "20000",
      },
      {
        route: "GET /api/sms/status/:id",
        desc: "Check SMS status / get code",
        amount: "1000",
      },
      {
        route: "POST /api/sms/number-and-wait",
        desc: "Get number and wait for verification code",
        amount: "25000",
      },
      // Long-term rental
      {
        route: "POST /api/sms/rent",
        desc: "Rent a phone number (long-term)",
        amount: "100000",
      },
      {
        route: "GET /api/sms/rent/:id/messages",
        desc: "Get messages for rented number",
        amount: "1000",
      },
      // Twilio — two-way SMS
      {
        route: "POST /api/twilio/send",
        desc: "Send SMS via Twilio",
        amount: "10000",
      },
      {
        route: "GET /api/twilio/messages",
        desc: "List received messages",
        amount: "1000",
      },
      { route: "GET /api/sms/balance", desc: "Check SMS provider balance" },
    ],
  },

  // ── CyberHost ──────────────────────────────────────────────────────────
  {
    id: "host",
    name: "CyberHost",
    url: "https://host.cyberpay.org",
    serviceUrl: `https://host.${NANOPAY_REALM}`,
    description:
      "KYC-free decentralized compute for AI agents. Deploy containers on Akash, Fly, Railway, or Phala with USDT.",
    categories: ["compute"],
    integration: "first-party",
    tags: [
      "compute",
      "deploy",
      "container",
      "gpu",
      "akash",
      "serverless",
      "hosting",
    ],
    status: "beta",
    docs: { homepage: "https://github.com/CyberpayOrg/cyber-host" },
    provider: { name: "CyberPay", url: "https://cyberpay.org" },
    realm: NANOPAY_REALM,
    intent: "charge",
    payment: NANOPAY_PAYMENT,
    endpoints: [
      { route: "POST /auth/register", desc: "Register and get API token" },
      { route: "GET /auth/me", desc: "Current user info" },
      {
        route: "POST /deploy",
        desc: "Create a deployment",
        dynamic: true,
        amountHint: "$0.01–$1.00/hr",
      },
      { route: "GET /deployments", desc: "List deployments" },
      { route: "GET /deployments/:id", desc: "Deployment details" },
      {
        route: "GET /deployments/:id/logs",
        desc: "Stream deployment logs",
        amount: "1000",
      },
      { route: "DELETE /deployments/:id", desc: "Destroy deployment" },
      { route: "GET /balance", desc: "Check compute balance" },
      {
        route: "POST /balance/topup",
        desc: "Top up with NanoPay",
        dynamic: true,
      },
      {
        route: "GET /templates",
        desc: "List deployment templates (Desktop, Agent, GPU, Web)",
      },
    ],
  },

  // ── CyberRelayer ───────────────────────────────────────────────────────
  {
    id: "relayer",
    name: "CyberRelayer",
    url: "https://relayer.cyberpay.org",
    serviceUrl: `https://relayer.${NANOPAY_REALM}`,
    description:
      "Multi-chain transaction relayer. Submit, sign, and monitor transactions on Solana, EVM, and Stellar.",
    categories: ["blockchain"],
    integration: "first-party",
    tags: [
      "relayer",
      "transaction",
      "solana",
      "evm",
      "stellar",
      "gasless",
      "signing",
    ],
    status: "beta",
    docs: { homepage: "https://docs.openzeppelin.com/relayer/" },
    provider: { name: "CyberPay", url: "https://cyberpay.org" },
    realm: NANOPAY_REALM,
    intent: "charge",
    payment: NANOPAY_PAYMENT,
    endpoints: [
      {
        route: "POST /api/v1/relayers/:id/transactions",
        desc: "Submit a transaction",
        amount: "10000",
      },
      {
        route: "GET /api/v1/relayers/:id/transactions/:txId",
        desc: "Get transaction status",
        amount: "1000",
      },
      { route: "GET /api/v1/relayers", desc: "List relayers" },
      {
        route: "POST /api/v1/relayers/:id/sign",
        desc: "Sign a transaction",
        amount: "5000",
      },
      {
        route: "POST /api/v1/relayers/:id/estimate",
        desc: "Estimate transaction fee",
        amount: "1000",
      },
    ],
  },

  // ── NanoPay ────────────────────────────────────────────────────────────
  {
    id: "nanopay",
    name: "NanoPay",
    url: "https://nano.cyberpay.org",
    serviceUrl: "https://nano.cyberpay.org",
    description:
      "Gas-free nanopayment infrastructure on TON. Deposit, pay, and settle USDT micropayments via TEE.",
    categories: ["blockchain"],
    integration: "first-party",
    tags: ["payments", "micropayments", "ton", "usdt", "tee", "nanopay"],
    status: "beta",
    docs: { homepage: "https://github.com/CyberpayOrg/NanoPay" },
    provider: { name: "CyberPay", url: "https://cyberpay.org" },
    realm: "nano.cyberpay.org",
    intent: "charge",
    payment: NANOPAY_PAYMENT,
    endpoints: [
      { route: "POST /verify", desc: "Verify a NanoPay payment authorization" },
      { route: "GET /balance/:address", desc: "Check NanoPay balance" },
      {
        route: "GET /attestation",
        desc: "TEE remote attestation report (Intel TDX)",
      },
      {
        route: "GET /receipts/:address",
        desc: "Payment receipts for an address",
      },
      { route: "GET /receipt/:id", desc: "Single TEE-signed payment receipt" },
      { route: "GET /stats", desc: "Global protocol statistics" },
      { route: "POST /flush", desc: "Trigger batch settlement on-chain" },
    ],
  },

  // ── LM Studio Proxy ────────────────────────────────────────────────────
  {
    id: "lmstudio",
    name: "LM Studio",
    url: "https://lmstudio.ai",
    serviceUrl: `https://lm.${NANOPAY_REALM}`,
    description:
      "Local LLM inference (Gemma, Llama, Mistral, etc.) via OpenAI-compatible API. Pay per request.",
    categories: ["ai"],
    integration: "third-party",
    tags: ["llm", "local", "gemma", "llama", "inference", "openai-compatible"],
    status: "beta",
    docs: { homepage: "https://lmstudio.ai/docs" },
    provider: { name: "CyberPay", url: "https://cyberpay.org" },
    realm: NANOPAY_REALM,
    intent: "charge",
    payment: NANOPAY_PAYMENT,
    endpoints: [
      {
        route: "POST /v1/chat/completions",
        desc: "Chat completions with local model",
        amount: "1000",
      },
      { route: "GET /v1/models", desc: "List loaded models" },
    ],
  },
];
