import { expect, sinon } from '@loopback/testlab'
import { GitHubService } from '../../../services'
import { UserRepoController } from '../../../controllers'

// unit tests are under construction

describe('UserRepoController (unit)', () => {
    let gitHubService: GitHubService
    let getUser: sinon.SinonStub
    let getRepositories: sinon.SinonStub
    let getBranches: sinon.SinonStub

    beforeEach(givenMockGitHubService)

    describe('getOwnRepositories()', () => {
        it('retrieves own repositories of a user', async () => {
            const controller = new UserRepoController(gitHubService)
            getBranches.resolves([
                {
                    name: 'test-branch-name',
                    lastCommit: { sha: 'test-commit-sha' },
                    repoName: 'test-repo',
                }
            ])

            getRepositories.resolves([
                {
                    name: 'test-repo',
                    userName: 'test-user-name',
                    branches: getBranches
                },
            ])

            const ownRepositories = await controller.getOwnRepositories('test-user-name')

            expect(ownRepositories).to.containEql({
                name: 'test-repo',
                userName: 'test-user-name',
                branches: [{name: 'test-branch-name'}]
            })
        })
    })

    function givenMockGitHubService() {
        // this creates a stub with GitHubService API
        // in a way that allows the compiler to verify type correctness
        gitHubService = {
            getUser: sinon.stub(),
            getRepositories: sinon.stub(),
            getBranches: sinon.stub(),
        }

        // this creates references to the stubbed gitHubService methods
        // because e.g. "gitHubService.getUser" has type from GitHubService
        // and does not provide Sinon APIs
        getUser = gitHubService.getUser as sinon.SinonStub
        getRepositories = gitHubService.getRepositories as sinon.SinonStub
        getBranches = gitHubService.getBranches as sinon.SinonStub
    }
})










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
