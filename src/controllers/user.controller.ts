import { inject } from '@loopback/context'
import { Request, RestBindings, get, param, getModelSchemaRef, HttpErrors, RestHttpErrors } from '@loopback/rest'
import { User } from '../models'
import { GitHubService, ErrorGetGitHub, UserGitHub } from '../services/github.service'
import { UserRepoController } from '../controllers'

export class UserController {
    constructor(@inject('services.GitHubService') protected gitHubService: GitHubService) {}

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
        let userGH: UserGitHub
        try {
            userGH = await this.gitHubService.getUser(username)
        } catch (e) {
            if ('statusCode' in e && e.statusCode == 404) {
                throw new HttpErrors.NotFound(`GitHub User '${username}' not found`)
            } else {
                throw e
            }
        }

        let userFiltered: User = new User()
        userFiltered.name = userGH.login
        userFiltered.name_alias = userGH.name
        userFiltered.url = userGH.html_url
        userFiltered.location = userGH.location
        userFiltered.bio = userGH.bio
        userFiltered.num_public_repos = userGH.public_repos

        let userRepoController = new UserRepoController(this.gitHubService)
        userFiltered.repos = await userRepoController.getOwnRepositories(userFiltered.name)

        return userFiltered
    }
}
