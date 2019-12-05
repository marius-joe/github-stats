import { createStubInstance, expect, sinon, StubbedInstanceWithSinonAccessor } from '@loopback/testlab'
import { RepoRepository } from '../../../repositories'
import { UserRepoController } from '../../../controllers'

// unit tests with database integration are under construction

describe('UserRepoController (unit)', () => {
    let repository: StubbedInstanceWithSinonAccessor<RepoRepository>
    beforeEach(givenStubbedRepository)

    describe('getOwnRepositories()', () => {
        it('retrieves information of a user', async () => {
            const controller = new UserRepoController(repository)
            repository.stubs.find.resolves([
                {
                    name: 'test-repo',
                    userName: 'test-user',
                    branches: [
                        {
                            name: 'test-branch-name',
                            lastCommit: { sha: 'test-commit-sha' },
                            repoName: 'test-repo',
                        },
                    ],
                },
            ])

            const details = await controller.getOwnRepositories('test-user')

            expect(details).to.containEql({ name: 'test-repo', userName: 'test-user' })
            sinon.assert.calledWithMatch(repository.stubs.find, {
                where: { name: 'test-repo' },
            })
        })
    })

    function givenStubbedRepository() {
        repository = createStubInstance(RepoRepository)
    }
})
