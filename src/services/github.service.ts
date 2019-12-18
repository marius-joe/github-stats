import { getService, juggler } from '@loopback/service-proxy'
import { inject, Provider } from '@loopback/core'
import { GithubDataSource } from '../datasources'

/**
 * A REST Service to define methods that map to the operations for the GitHub API
 */
export interface GitHubService {
    // map Node.js method to REST operation as stated in the GitHub datasource file
    getUser(username: string): Promise<UserGitHub>
    getRepositories(username: string): Promise<RepoGitHub[]>
    getBranches(username: string, repository: string): Promise<BranchGitHub[]>
}

/**
 * A GitHub User
 */
export interface UserGitHub {
    login: string
    name: string
    html_url: string
    location: string
    bio: string
    public_repos: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any
}

/**
 * A GitHub User's Repository
 */
export interface RepoGitHub {
    name: string
    owner: { login: string }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any
}

/**
 * A GitHub User's Repository Branch
 */
export interface BranchGitHub {
    name: string
    commit: { sha: string }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any
}

/**
 * A Provider for the GitHub service.
 * Allows both, controllers and integration tests, to access the same GitHub service proxy implementation
 */
export class GitHubServiceProvider implements Provider<GitHubService> {
    constructor(
        @inject('datasources.github')
        protected dataSource: juggler.DataSource = new GithubDataSource(),
    ) {}

    value(): Promise<GitHubService> {
        return getService(this.dataSource)
    }
}

// could be used for identifying GitHub specific errors,
// but just GitHubError.message is to general when documentation_url would be missing
// /**
//  * GitHub Error response
//  */
// export class GitHubError extends Error {
//     message: string
//     documentation_url?: string
// }

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function isGitHubError(e: any): boolean {
//     return e instanceof GitHubError
// }

/**
 * A generic service interface with any number of methods that return a promise.
 * Can be uses for more general purposes than my GitHub Proxy Service
 */
// export interface GenericService {
//     [methodName: string]: (...args: any[]) => Promise<any>
// }
