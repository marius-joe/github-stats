import { inject } from '@loopback/context'
import { Repository } from '../models' // check model
import { get, param } from '@loopback/rest'

export class UserController {
    constructor(
        @inject('services.GitHubService')
        protected gitHubService: GitHubService,
    ) { }

    // returns a list of statistics about the user's own repository (no forked repos)
    @get('/users/{username}/repositories/own')
    async add(
        @param.path.string('username') username: string
    ): Promise<Repository[]> {

        let repos: Repository = this.gitHubService.getRepositories({ username })
        let reposFiltered: object[] = []

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

        reposFiltered = [{
            "name": repoName,
            "ownerLogin": ownerLogin,
            "branches": [{
                "name": branchName,
                "lastCommit": {
                    "sha": lastCommitSHA
                }
            }
            ]
        }
        ]
        return reposFiltered
    }

}
