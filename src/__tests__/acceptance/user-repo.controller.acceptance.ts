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

    it('invokes GET /users/{username}/repositories', async () => {
        const res = await client.get('/users/marius-joe/repositories').expect(200)
        expect(res.body).to.containEql([
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
