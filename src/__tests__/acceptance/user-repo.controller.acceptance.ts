import { Client, expect } from '@loopback/testlab'
import { GitHubStatsApplication } from '../..'
import { setupApplication } from './test-helper'

describe('UserRepoController', () => {
    let app: GitHubStatsApplication
    let client: Client

    before('setupApplication', async () => {
        ;({ app, client } = await setupApplication())
    })

    after(async () => {
        await app.stop()
    })

    it('invokes GET /users/{username}/repositories', async function() {
        // Set timeout to 30 seconds as a GitHub look up is triggered over the internet
        // and this takes more than the 2 seconds timeout of mocha
        // eslint-disable-next-line no-invalid-this
        this.timeout(30000)
        const res = await client.get('/users/marius-joe/repositories').expect(200)
        expect(res.body).to.containDeep([
            {
                userName: 'marius-joe',
                branches: [
                    {
                        name: 'master',
                    },
                ],
            },
        ])
    })
})
