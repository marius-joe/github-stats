import { inject } from '@loopback/context'
import { get, param, getModelSchemaRef } from '@loopback/rest'
import { Repository } from '../models'
import { Branch } from '../models'
import { GitHubService } from '../services'


export class UserController {
    constructor(
        @inject('services.GitHubService')
        protected gitHubService: GitHubService,
    ) { }

    // returns a list of statistics about the user's own repository (no forked repos)
    @get('/users/{username}/repositories/own', {
        responses: {
            '200': {
                description: 'Array of the users own repositories',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: getModelSchemaRef(Repository, { includeRelations: true }),
                        },
                    },
                },
            },
        },
    })
    async getUsersOwnRepositories(
        @param.path.string('username') username: string
    ): Promise<Repository[]> {

        //let repos: object[] = this.gitHubService.getRepositories(username)

        let reposFiltered: Repository[] = []

        // loop through all repositories and collect only those with:
        // repo.fork: false

        // info to collect
        // repo.name
        // repo.owner.login
        // list of branches with names and last commit shas

        let repoName = "1. repo"
        let ownerLogin = "marius"
        let branchName = "dev"
        let lastCommitSHA = "1a2b3c4e"

        let repoFiltered: Repository = new Repository()
        repoFiltered.name = "1. repo"
        repoFiltered.owner.login = "marius"

        let branchFiltered: Branch = new Branch()
        branchFiltered.name = "dev"
        branchFiltered.lastCommit = { sha: "1a2b3c4e" }

        repoFiltered.branches = []
        repoFiltered.branches.push(branchFiltered)

        reposFiltered.push(repoFiltered)
        return reposFiltered
    }

}
