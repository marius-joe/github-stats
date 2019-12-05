import { inject } from '@loopback/context'
import { get, getModelSchemaRef, param } from '@loopback/rest'
import { Repo, Branch } from '../models'
import { GitHubService, RepoGitHub, BranchGitHub } from '../services/github.service'

// for future own db access
// import { Count, CountSchema, Filter, repository, Where } from '@loopback/repository'
// import { UserRepository } from '../repositories'

export class UserRepoController {
    constructor(
        @inject('services.GitHubService')
        protected gitHubService: GitHubService,
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
        const reposGH: RepoGitHub[] = await this.gitHubService.getRepositories(username)
        let reposFiltered: Repo[] = []

        for (const repoGH of reposGH) {
            if (!repoGH.fork) {
                let repoFiltered: Repo = new Repo()

                repoFiltered.name = repoGH.name
                repoFiltered.owner.login = repoGH.owner.login

                const branchesGH: BranchGitHub[] = await this.gitHubService.getBranches(username, repoGH.name)
                for (const branchGH of branchesGH) {
                    let branchFiltered: Branch = new Branch()

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
