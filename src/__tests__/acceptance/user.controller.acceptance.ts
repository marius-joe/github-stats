import { Client, expect } from '@loopback/testlab'
import { GitHubStatsApplication } from '../..'
import { setupApplication } from './test-helper'

describe('UserController', () => {
    let app: GitHubStatsApplication
    let client: Client

    before('setupApplication', async () => {
        ;({ app, client } = await setupApplication())
    })

    after(async () => {
        await app.stop()
    })

    it('invokes GET /users/{username}', async () => {
        const res = await client.get('/users/marius-joe').expect(200)
        expect(res.body).to.containEql({ name_alias: 'Marius Joe' })
    })
})
