import {inject} from '@loopback/context'
import {get, param, getModelSchemaRef} from '@loopback/rest'
import {Repository} from '../models'
import {Branch} from '../models'
import {GitHubService, RepoGitHub, BranchGitHub} from '../services'

export class UserController {
    constructor(
        @inject('services.GitHubService')
        protected gitHubService: GitHubService,
    ) {}

    // returns a list of statistics about the user's own repository (no forked repos)
    @get('/users/{username}/repositories/own', {
        responses: {
            '200': {
                description: 'Array of the users own repositories',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: getModelSchemaRef(Repository, {
                                includeRelations: true,
                            }),
                        },
                    },
                },
            },
        },
    })
    async getUsersOwnRepositories(
        @param.path.string('username') username: string,
    ): Promise<Repository[]> {
        const reposGH: RepoGitHub[] = await this.gitHubService.getRepositories(
            username,
        )
        let reposFiltered: Repository[] = []

        for (const repoGH of reposGH) {
            if (!repoGH.fork) {
                let repoFiltered: Repository = new Repository()

                repoFiltered.name = repoGH.name
                repoFiltered.owner.login = repoGH.owner.login

                // hierfür noch function in Service einbauen
                let branchesGH: BranchGitHub[] = this.gitHubService.getBranches(
                    username,
                    repoGH.name,
                )

                for (const branchGH of branchesGH) {
                    let branchFiltered: Branch = new Branch()

                    branchFiltered.name = branchGH.name
                    branchFiltered.lastCommit = {sha: branchGH.commit.sha}

                    repoFiltered.branches.push(branchFiltered)
                }
                reposFiltered.push(repoFiltered)
            }
        }

        // let repoName = "1. repo"
        // let ownerLogin = "marius"
        // let branchName = "dev"
        // let lastCommitSHA = "1a2b3c4e"

        // let repoFiltered: Repository = new Repository()
        // repoFiltered.name = "1. repo"
        // repoFiltered.owner = { login: "marius" }

        // let branchFiltered: Branch = new Branch()
        // branchFiltered.name = "dev"
        // branchFiltered.lastCommit = { sha: "1a2b3c4e" }

        // repoFiltered.branches = []
        // repoFiltered.branches.push(branchFiltered)

        // reposFiltered.push(repoFiltered)
        return reposFiltered

        // // Reply with a greeting, the current time, the url, and request headers
        // return {
        //     greeting: 'Hello from LoopBack',
        //     date: new Date(),
        //     url: this.req.url,
        //     headers: Object.assign({}, this.req.headers),
        // }
    }
}
