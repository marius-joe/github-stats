import { Client, expect } from '@loopback/testlab'
import { GitHubStatsApplication } from '../..'
import { setupApplication } from './test-helper'
// import { GitHubService } from '../../services'  it could be checked if the GitHub API is online at all

describe('UserController', () => {
    let app: GitHubStatsApplication
    let client: Client

    before('setupApplication', async () => {
        ;({ app, client } = await setupApplication())
    })

    after(async () => {
        await app.stop()
    })

    it('invokes GET /users/{username}', async function() {
        // Set timeout to 30 seconds as a GitHub look up is triggered over the internet
        // and this takes more than the 2 seconds timeout of mocha
        // eslint-disable-next-line no-invalid-this
        this.timeout(30000)
        const res = await client.get('/users/marius-joe').expect(200)
        expect(res.body).to.containEql({ nameAlias: 'Marius Joe' })
    })
})
