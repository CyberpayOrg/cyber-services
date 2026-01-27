import * as Method from '../Method.js'
import * as Intents from './Intents.js'

export const tempo = Method.from({
  intents: {
    // TODO: add support for authorize
    // authorize: Intents.authorize,
    charge: Intents.charge,
  },
  name: 'tempo',
})
