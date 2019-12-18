import { inject } from '@loopback/context'
import { Request, RestBindings, get, param, getModelSchemaRef, HttpErrors } from '@loopback/rest'
import { User } from '../models'
import { GitHubService, UserGitHub } from '../services/github.service'
import { UserRepoController } from '../controllers'

export class UserController {
    constructor(
        @inject('services.GitHubService') protected gitHubService: GitHubService,
        @inject(RestBindings.Http.REQUEST) public request: Request,
    ) {}

    // returns information about the specified GitHub user
    @get('/users/{username}', {
        responses: {
            '200': {
                description: 'Information about this GitHub user',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            items: getModelSchemaRef(User, {
                                includeRelations: true,
                            }),
                        },
                    },
                },
            },
        },
    })
    async getUserInfo(@param.path.string('username') username: string): Promise<User> {
        const reqAcceptType: string | undefined = this.request.headers.accept
        const reqPath: string = this.request.path
        let errMsg: string
        let userGH: UserGitHub

        try {
            // given header 'Accept: application/xml', the request will be rejected
            if (reqAcceptType && reqAcceptType.toLowerCase() === 'application/xml') {
                throw new HttpErrors.NotAcceptable(
                    `Unsupported response type '${reqAcceptType}' for path: '${reqPath}'`,
                )
            }
            // if GitHub can not be reached or the specified user was not found, handle the errors also below
            userGH = await this.gitHubService.getUser(username)
        } catch (e) {
            // any unhandled and new thrown errors here will be handled in the custom 'reject' Sequence Action
            const errCode = e.statusCode
            if (errCode in HttpErrors) {
                switch (errCode) {
                    case 404: {
                        errMsg = `GitHub User '${username}' not found`
                        break
                    }
                    default: {
                        errMsg = e.message
                        break
                    }
                }
                throw new HttpErrors[errCode](errMsg)
            } else {
                throw e
            }
        }

        const userFiltered: User = new User()
        userFiltered.name = userGH.login
        userFiltered.nameAlias = userGH.name
        userFiltered.url = userGH.html_url
        userFiltered.location = userGH.location
        userFiltered.bio = userGH.bio
        userFiltered.numPublicRepos = userGH.public_repos

        const userRepoController = new UserRepoController(this.gitHubService, this.request)
        userFiltered.repos = await userRepoController.getOwnRepositories(userFiltered.name)

        return userFiltered
    }
}
