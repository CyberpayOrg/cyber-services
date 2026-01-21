import { beforeEach } from 'vitest'
import { accounts, asset, fundAccount } from './tempo/viem.js'

beforeEach(async () => {
  await fundAccount({ address: accounts[1].address, token: asset })
})
