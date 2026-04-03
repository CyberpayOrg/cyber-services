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

  // ── Cyber API — LLM Gateway ────────────────────────────────────────────
  {
    id: "lumioapi",
    name: "Lumio API",
    url: "https://ai.lumio.run",
    serviceUrl: "https://ai.lumio.run",
    description:
      "Unified LLM API gateway. Access 30+ models (Claude, GPT, Gemini, DeepSeek, Grok, Llama, Qwen, Mistral) through a single OpenAI-compatible endpoint.",
    categories: ["ai"],
    integration: "first-party",
    tags: [
      "llm",
      "claude",
      "gpt",
      "gemini",
      "deepseek",
      "grok",
      "llama",
      "qwen",
      "mistral",
      "openai-compatible",
      "api-gateway",
    ],
    status: "active",
    docs: { homepage: "https://ai.lumio.run" },
    provider: { name: "CyberPay", url: "https://cyberpay.org" },
    realm: "ai.lumio.run",
    intent: "charge",
    payment: NANOPAY_PAYMENT,
    endpoints: [
      // ── Anthropic Claude ──
      {
        route: "POST /v1/chat/completions (anthropic/claude-sonnet-4.6)",
        desc: "Claude Sonnet 4.6 — fast, intelligent",
        amount: "3000000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (anthropic/claude-opus-4.6)",
        desc: "Claude Opus 4.6 — most capable",
        amount: "15000000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (anthropic/claude-opus-4.5)",
        desc: "Claude Opus 4.5",
        amount: "15000000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (anthropic/claude-haiku-4.5)",
        desc: "Claude Haiku 4.5 — fastest, cheapest",
        amount: "1000000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (anthropic/claude-sonnet-4.5)",
        desc: "Claude Sonnet 4.5",
        amount: "3000000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (anthropic/claude-3.7-sonnet)",
        desc: "Claude 3.7 Sonnet",
        amount: "3000000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (anthropic/claude-3.5-haiku)",
        desc: "Claude 3.5 Haiku",
        amount: "1000000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (anthropic/claude-3.5-sonnet)",
        desc: "Claude 3.5 Sonnet",
        amount: "3000000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (anthropic/claude-3-opus)",
        desc: "Claude 3 Opus",
        amount: "15000000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (anthropic/claude-3-haiku)",
        desc: "Claude 3 Haiku",
        amount: "250000",
        unitType: "1M tokens",
      },
      // ── OpenAI GPT ──
      {
        route: "POST /v1/chat/completions (openai/gpt-4o)",
        desc: "GPT-4o — multimodal flagship",
        amount: "2500000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (openai/gpt-4o-mini)",
        desc: "GPT-4o Mini — fast & cheap",
        amount: "150000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (openai/gpt-5)",
        desc: "GPT-5 — latest generation",
        amount: "2000000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (openai/o1)",
        desc: "o1 — reasoning model",
        amount: "15000000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (openai/o3-mini)",
        desc: "o3 Mini — fast reasoning",
        amount: "1100000",
        unitType: "1M tokens",
      },
      // ── Google Gemini ──
      {
        route: "POST /v1/chat/completions (google/gemini-2.5-pro-preview)",
        desc: "Gemini 2.5 Pro — Google's best",
        amount: "1250000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (google/gemini-2.5-flash-preview)",
        desc: "Gemini 2.5 Flash — fast & cheap",
        amount: "150000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (google/gemini-2.0-flash-001)",
        desc: "Gemini 2.0 Flash",
        amount: "100000",
        unitType: "1M tokens",
      },
      // ── DeepSeek ──
      {
        route: "POST /v1/chat/completions (deepseek/deepseek-v3.2)",
        desc: "DeepSeek V3.2 — best value",
        amount: "270000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (deepseek/deepseek-chat-v3-0324)",
        desc: "DeepSeek Chat V3",
        amount: "270000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (deepseek/deepseek-r1)",
        desc: "DeepSeek R1 — reasoning",
        amount: "550000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (deepseek/deepseek-r1-0528)",
        desc: "DeepSeek R1 (0528)",
        amount: "550000",
        unitType: "1M tokens",
      },
      // ── xAI Grok ──
      {
        route: "POST /v1/chat/completions (x-ai/grok-3)",
        desc: "Grok 3 — xAI flagship",
        amount: "3000000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (x-ai/grok-3-mini)",
        desc: "Grok 3 Mini — fast",
        amount: "300000",
        unitType: "1M tokens",
      },
      // ── Meta Llama ──
      {
        route: "POST /v1/chat/completions (meta-llama/llama-4-maverick)",
        desc: "Llama 4 Maverick",
        amount: "270000",
        unitType: "1M tokens",
      },
      {
        route: "POST /v1/chat/completions (meta-llama/llama-4-scout)",
        desc: "Llama 4 Scout",
        amount: "180000",
        unitType: "1M tokens",
      },
      // ── Qwen ──
      {
        route: "POST /v1/chat/completions (qwen/qwen-2.5-72b-instruct)",
        desc: "Qwen 2.5 72B",
        amount: "360000",
        unitType: "1M tokens",
      },
      // ── Mistral ──
      {
        route: "POST /v1/chat/completions (mistralai/mistral-large)",
        desc: "Mistral Large",
        amount: "2000000",
        unitType: "1M tokens",
      },
      // ── Common endpoints ──
      { route: "GET /v1/models", desc: "List all available models" },
    ],
  },
];
