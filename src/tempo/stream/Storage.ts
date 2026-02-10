import type { Address, Hex } from 'viem'
import type { SignedVoucher } from './Types.js'

/**
 * State for an on-chain payment channel, including per-session accounting.
 *
 * Tracks the channel's identity, on-chain balance, the highest voucher
 * the server has accepted, and the current session's spend counters.
 * A channel is created when a payer opens an escrow on-chain and persists
 * until the channel is finalized (closed/settled).
 *
 * One channel = one session. The client owns the key and can't race with
 * itself, so concurrent session support is unnecessary.
 *
 * Monotonicity invariants (enforced by update callbacks):
 * - `highestVoucherAmount` only increases
 * - `settledOnChain` only increases
 * - `deposit` reflects the latest on-chain value
 */
export interface ChannelState {
  channelId: Hex
  payer: Address
  payee: Address
  token: Address
  authorizedSigner: Address

  /** Current on-chain deposit in the escrow contract. */
  deposit: bigint
  /** Cumulative amount settled on-chain so far. */
  settledOnChain: bigint
  /** Highest cumulative voucher amount accepted by the server. */
  highestVoucherAmount: bigint
  /** The signed voucher corresponding to `highestVoucherAmount`. */
  highestVoucher: SignedVoucher | null

  /** Cumulative amount spent (charged) against this channel's current session. */
  spent: bigint
  /** Number of charge operations (API requests) fulfilled in the current session. */
  units: number

  /** Whether the channel has been finalized (closed) on-chain. */
  finalized: boolean
  createdAt: Date
}

/**
 * Generic key-value storage interface.
 *
 * Isomorphic across payment methods (stream, charge, etc.) and across
 * client and server. Implementations control the persistence backend;
 * callers control the domain logic on top.
 */
export interface Storage<value> {
  get(key: string): Promise<value | null>
  set(key: string, value: value): Promise<void>
  delete(key: string): Promise<void>
}

export type DeductResult =
  | { ok: true; channel: ChannelState }
  | { ok: false; channel: ChannelState }

/**
 * Atomically deduct `amount` from a channel's available balance.
 *
 * Returns `{ ok: true, channel }` if the deduction succeeded, or
 * `{ ok: false, channel }` with the unchanged state if balance is
 * insufficient. Throws if the channel does not exist.
 */
export async function deductFromChannel(
  storage: Storage<ChannelState>,
  channelId: Hex,
  amount: bigint,
): Promise<DeductResult> {
  const channel = await storage.get(channelId)
  if (!channel) throw new Error('channel not found')
  if (channel.finalized) throw new Error('channel is finalized')

  if (channel.highestVoucherAmount - channel.spent < amount) {
    return { ok: false, channel }
  }

  const updated = { ...channel, spent: channel.spent + amount, units: channel.units + 1 }
  await storage.set(channelId, updated)
  return { ok: true, channel: updated }
}

/** In-memory storage backed by a simple Map. Useful for development and testing. */
export function memoryStorage<value = ChannelState>(): Storage<value> {
  const store = new Map<string, value>()

  return {
    async get(key) {
      return store.get(key) ?? null
    },
    async set(key, value) {
      store.set(key, value)
    },
    async delete(key) {
      store.delete(key)
    },
  }
}
