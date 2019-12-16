import { inject } from '@loopback/context'
import { get, param, getModelSchemaRef, HttpErrors } from '@loopback/rest'
import { User } from '../models'
import { GitHubService, UserGitHub } from '../services/github.service'
import { UserRepoController } from '../controllers'

export class UserController {
    constructor(
        @inject('services.GitHubService')
        protected gitHubService: GitHubService,
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
    async getUserInfo(
        @param.path.string('username') username: string,
        //@param.header.string('content-type') content-type != 'accept: application/xml'
    ): Promise<User> {
        let userGH
        let response: any
        // doDo
        // request.header checken   Accept: application/xml  -> 406
        let reqHeader = request.header
        try {
            if (reqHeader.toLowerCase() === 'accept: application/xml') {
                throw new HttpErrors.NotAcceptable(`Content-Type  '${reqHeader}'  not supported`)
            }

            userGH = await this.gitHubService.getUser(username)
        } catch (e) {
            if (e instanceof HttpErrors) {
                const httpError = HttpErrors(e)
                const errCode = httpError.statusCode
                switch (errCode) {
                    case 404: {
                        throw new HttpErrors.NotFound(`GitHub User  '${username}'  not found`)
                        break
                    }
                    default: {
                        break
                    }
                }
            } else {
                throw e
            }
        }
        if (userGH) {
            let userFiltered: User = new User()
            userFiltered.name = userGH.login
            userFiltered.name_alias = userGH.name
            userFiltered.url = userGH.html_url
            userFiltered.location = userGH.location
            userFiltered.bio = userGH.bio
            userFiltered.num_public_repos = userGH.public_repos

            let userRepoController = new UserRepoController(this.gitHubService)
            userFiltered.repos = await userRepoController.getOwnRepositories(userFiltered.name)
            response = userFiltered
        }

        return response
    }
}
