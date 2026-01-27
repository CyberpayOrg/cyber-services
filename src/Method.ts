import type * as MethodIntent from './MethodIntent.js'

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

type AnyMethod = Method<any, any>

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
