import { expect, sinon } from '@loopback/testlab'
import { GitHubService } from '../../../services'
import { UserController } from '../../../controllers'

// unit tests are under construction

describe('UserController (unit)', () => {
    let gitHubService: GitHubService
    let getUser: sinon.SinonStub
    let getRepositories: sinon.SinonStub
    let getBranches: sinon.SinonStub

    beforeEach(givenMockGitHubService)

    describe('getUserInfo()', () => {
        it('retrieves information of a user', async () => {
            const controller = new UserController(gitHubService)
            getUser.resolves([
                {
                    login: 'test-login-name',
                    name: 'Test Alias Name',
                    html_url: 'test-url',
                },
            ])

            const userInfo = await controller.getUserInfo('test-login-name')

            expect(userInfo).to.containEql({
                name: 'test-login-name',
                name_alias: 'Test Alias Name',
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
