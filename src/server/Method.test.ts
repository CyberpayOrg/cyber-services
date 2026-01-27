import { describe, expect, test } from 'vitest'
import * as Intent from '../Intent.js'
import * as Method from '../Method.js'
import * as MethodIntent from '../MethodIntent.js'
import * as z from '../zod.js'
import * as ServerMethod from './Method.js'

const fooCharge = MethodIntent.fromIntent(Intent.charge, {
  method: 'test',
  schema: {
    credential: {
      payload: z.object({ signature: z.string() }),
    },
    request: {
      requires: ['recipient'],
    },
  },
})

const fooMethod = Method.from({
  name: 'test',
  intents: { charge: fooCharge },
})

describe('toServer', () => {
  test('default', () => {
    const method = ServerMethod.toServer(fooMethod, {
      async verify() {
        return {
          method: 'test',
          reference: 'ref-123',
          status: 'success' as const,
          timestamp: new Date().toISOString(),
        }
      },
    })

    expect(method.name).toBe('test')
    expect(method.intents).toHaveProperty('charge')
    expect(typeof method.verify).toBe('function')
  })

  test('behavior: with context schema', () => {
    const method = ServerMethod.toServer(fooMethod, {
      context: z.object({ apiKey: z.string() }),
      async verify() {
        return {
          method: 'test',
          reference: 'ref-123',
          status: 'success' as const,
          timestamp: new Date().toISOString(),
        }
      },
    })

    expect(method.name).toBe('test')
    expect(method.context).toBeDefined()
  })

  test('behavior: with multiple intents', () => {
    const fooAuthorize = MethodIntent.fromIntent(Intent.authorize, {
      method: 'test',
      schema: {
        credential: {
          payload: z.object({ token: z.string() }),
        },
      },
    })

    const baseMethod = Method.from({
      name: 'test',
      intents: {
        authorize: fooAuthorize,
        charge: fooCharge,
      },
    })

    const method = ServerMethod.toServer(baseMethod, {
      async verify() {
        return {
          method: 'test',
          reference: 'ref-123',
          status: 'success' as const,
          timestamp: new Date().toISOString(),
        }
      },
    })

    expect(method.intents).toHaveProperty('charge')
    expect(method.intents).toHaveProperty('authorize')
    expect(Object.keys(method.intents)).toHaveLength(2)
  })
})
