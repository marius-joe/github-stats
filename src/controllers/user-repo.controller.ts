import { inject } from '@loopback/context'
import { Request, RestBindings, get, getModelSchemaRef, param, HttpErrors } from '@loopback/rest'
import { Repo, Branch } from '../models'
import { GitHubService, RepoGitHub, BranchGitHub } from '../services/github.service'

// for future own db access
// import { Count, CountSchema, Filter, repository, Where } from '@loopback/repository'
// import { UserRepository } from '../repositories'

export class UserRepoController {
    constructor(
        @inject('services.GitHubService') protected gitHubService: GitHubService,
        @inject(RestBindings.Http.REQUEST) public request: Request,
    ) {}
    // for future own db access
    // @repository(UserRepository)
    // protected userRepository: UserRepository

    // returns a list of statistics about the user's own repository (no forked repos)
    @get('/users/{username}/repositories', {
        responses: {
            '200': {
                description: 'Array of the users own repositories',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: getModelSchemaRef(Repo, {
                                includeRelations: true,
                            }),
                        },
                    },
                },
            },
        },
    })
    async getOwnRepositories(@param.path.string('username') username: string): Promise<Repo[]> {
        const reqAcceptType: string | undefined = this.request.headers.accept
        const reqPath: string = this.request.path
        let errMsg: string
        let reposGH: RepoGitHub[]

        try {
            // given header 'Accept: application/xml', the request will be rejected
            if (reqAcceptType && reqAcceptType.toLowerCase() === 'application/xml') {
                throw new HttpErrors.NotAcceptable(
                    `Unsupported response type '${reqAcceptType}' for path: '${reqPath}'`,
                )
            }
            // if GitHub can not be reached or the specified user was not found, handle the errors also below
            reposGH = await this.gitHubService.getRepositories(username)
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

        const reposFiltered: Repo[] = []
        for (const repoGH of reposGH) {
            // return only own repositories of the user excluding forks
            if (!repoGH.fork) {
                const repoFiltered: Repo = new Repo()

                repoFiltered.name = repoGH.name
                repoFiltered.userName = repoGH.owner.login
                repoFiltered.branches = []

                const branchesGH: BranchGitHub[] = await this.gitHubService.getBranches(username, repoGH.name)
                for (const branchGH of branchesGH) {
                    const branchFiltered: Branch = new Branch()

                    branchFiltered.name = branchGH.name
                    branchFiltered.lastCommit = { sha: branchGH.commit.sha }

                    repoFiltered.branches.push(branchFiltered)
                }
                reposFiltered.push(repoFiltered)
            }
        }
        return reposFiltered
    }

    // for future own db access
    // async find(
    //     @param.path.string('username') username: string,
    //     @param.query.object('filter') filter?: Filter<Repo>,
    // ): Promise<Repo[]> {
    //     return this.userRepository.repos(username).find(filter)
    // }
}
