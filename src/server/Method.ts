import type { z } from 'zod/mini'
import type * as Challenge from '../Challenge.js'
import type * as Credential from '../Credential.js'
import type * as core_Method from '../Method.js'
import type * as MethodIntent from '../MethodIntent.js'
import type * as Receipt from '../Receipt.js'

export { tempo } from '../tempo/server/Method.js'

/**
 * A payment method definition for server-side payment handling.
 *
 * Methods encapsulate:
 * - Method name (e.g., "tempo", "stripe")
 * - Supported intents (e.g., charge, authorize)
 * - Optional per-request context schema
 * - Verification logic
 */
export type Method<
  name extends string = string,
  intents extends Record<string, MethodIntent.MethodIntent> = Record<
    string,
    MethodIntent.MethodIntent
  >,
  context extends z.ZodMiniType | undefined = z.ZodMiniType | undefined,
> = core_Method.Method<name, intents> & {
  /** Schema for per-request context passed to `verify`. */
  context?: context
  /** Verify a credential and return a receipt. */
  verify: VerifyFn<
    intents,
    context extends z.ZodMiniType ? z.output<context> : Record<never, never>
  >
}

type AnyMethod = Method<any, any, any>

/** Extract name from a Method */
export type NameOf<method extends AnyMethod> = core_Method.NameOf<method>

/** Extract intents from a Method */
export type IntentsOf<method extends AnyMethod> = core_Method.IntentsOf<method>

/** Extract context input type from a Method (for IntentFn options). */
export type ContextOf<method extends AnyMethod> =
  NonNullable<method['context']> extends never
    ? Record<never, never>
    : NonNullable<z.input<NonNullable<method['context']>>>

/** Verification function that validates a credential and returns a receipt. */
export type VerifyFn<
  intents extends Record<string, MethodIntent.MethodIntent>,
  context = unknown,
> = (parameters: VerifyFn.Parameters<intents, context>) => Promise<Receipt.Receipt>

export declare namespace VerifyFn {
  type Parameters<intents extends Record<string, MethodIntent.MethodIntent>, context = unknown> = {
    [key in keyof intents]: {
      context: context
      credential: Credential.Credential<
        z.output<intents[key]['schema']['credential']['payload']>,
        Challenge.Challenge<z.output<intents[key]['schema']['request']>, intents[key]['name']>
      >
      request: globalThis.Request
    }
  }[keyof intents]
}

/**
 * Extends a method with server-side verification logic.
 *
 * @example
 * ```ts
 * import { Method } from 'mpay/server'
 * import { tempo } from 'mpay/tempo'
 *
 * const method = Method.toServer(tempo, {
 *   async verify({ credential }) {
 *     // verification logic
 *     return { status: 'success', ... }
 *   },
 * })
 * ```
 */
export function toServer<
  const method extends core_Method.Method,
  const context extends z.ZodMiniType | undefined = undefined,
>(
  method: method,
  options: toServer.Options<method['intents'], context>,
): Method<method['name'], method['intents'], context> {
  const { context, verify } = options
  const { intents, name } = method
  return {
    context,
    intents,
    name,
    verify,
  } as Method<method['name'], method['intents'], context>
}

export declare namespace toServer {
  type Options<
    intents extends Record<string, MethodIntent.MethodIntent>,
    context extends z.ZodMiniType | undefined = undefined,
  > = {
    /** Schema for per-request context passed to `verify`. */
    context?: context
    /** Verify a credential and return a receipt. */
    verify: VerifyFn<
      intents,
      context extends z.ZodMiniType ? z.output<context> : Record<never, never>
    >
  }
}
