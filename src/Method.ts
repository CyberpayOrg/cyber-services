import type { z } from 'zod/mini'
import type * as Challenge from './Challenge.js'
import type * as Credential from './Credential.js'
import type * as MethodIntent from './MethodIntent.js'
import type * as Receipt from './Receipt.js'

/**
 * A payment method definition.
 *
 * Methods encapsulate:
 * - Method name (e.g., "tempo", "stripe")
 * - Supported intents (e.g., charge, authorize)
 */
export type Method<
  name extends string = string,
  intents extends Record<string, MethodIntent.MethodIntent> = Record<
    string,
    MethodIntent.MethodIntent
  >,
> = {
  /** Map of intent names to method intents. */
  intents: intents
  /** Payment method name (e.g., "tempo", "stripe"). */
  name: name
}

/**
 * A server-side payment method with verification logic.
 *
 * Extends the base Method with:
 * - Optional per-request context schema
 * - Verification logic
 */
export type Server<
  name extends string = string,
  intents extends Record<string, MethodIntent.MethodIntent> = Record<
    string,
    MethodIntent.MethodIntent
  >,
  context extends z.ZodMiniType | undefined = z.ZodMiniType | undefined,
> = Method<name, intents> & {
  /** Schema for per-request context passed to `verify`. */
  context?: context
  /** Verify a credential and return a receipt. */
  verify: VerifyFn<
    intents,
    context extends z.ZodMiniType ? z.output<context> : Record<never, never>
  >
}

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

/** Extract context input type from a Server Method (for IntentFn options). */
export type ContextOf<method extends AnyServer> =
  NonNullable<method['context']> extends never
    ? Record<never, never>
    : NonNullable<z.input<NonNullable<method['context']>>>

/** Extract name from a Method */
export type NameOf<method extends AnyMethod> = method['name']

/** Extract intents from a Method */
export type IntentsOf<method extends AnyMethod> = method['intents']

/**
 * Creates a payment method from parameters.
 *
 * @example
 * ```ts
 * import { Method } from 'mpay'
 *
 * const method = Method.from({
 *   name: 'custom',
 *   intents: { charge: Intents.charge },
 * })
 * ```
 */
export function from<
  const name extends string,
  const intents extends Record<string, MethodIntent.MethodIntent>,
>(parameters: from.Parameters<name, intents>): Method<name, intents> {
  return {
    intents: parameters.intents,
    name: parameters.name,
  }
}

export declare namespace from {
  type Parameters<
    name extends string,
    intents extends Record<string, MethodIntent.MethodIntent>,
  > = {
    /** Map of intent names to method intents. */
    intents: intents
    /** Payment method name (e.g., "tempo", "stripe"). */
    name: name
  }
}

/**
 * Extends a method with server-side verification logic.
 *
 * @example
 * ```ts
 * import { Method } from 'mpay'
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
  const method extends Method,
  const context extends z.ZodMiniType | undefined = undefined,
>(
  method: method,
  options: toServer.Options<method['intents'], context>,
): Server<method['name'], method['intents'], context> {
  const { context, verify } = options
  const { intents, name } = method
  return {
    context,
    intents,
    name,
    verify,
  } as Server<method['name'], method['intents'], context>
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

type AnyMethod = Method<any, any>
type AnyServer = Server<any, any, any>
