import { getService } from '@loopback/service-proxy'
import { inject, Provider } from '@loopback/core'
import { GithubDataSource } from '../datasources'

export interface UserGitHub {
    login: string
    name: string
    html_url: string
    location: string
    bio: string
    public_repos: number
    [x: string]: any
}

export interface RepoGitHub {
    name: string
    owner: { login: string }
    [x: string]: any
}

export interface BranchGitHub {
    name: string
    commit: { sha: string }
    [x: string]: any
}

export interface GitHubService {
    // map Node.js method to REST operation as stated in the GitHub datasource file
    getUser(username: string): Promise<UserGitHub>
    getRepositories(username: string): Promise<RepoGitHub[]>
    getBranches(username: string, repository: string): Promise<BranchGitHub[]>
}

export class GitHubServiceProvider implements Provider<GitHubService> {
    constructor(
        @inject('datasources.github')
        protected dataSource: GithubDataSource = new GithubDataSource(),
    ) {}

    value(): Promise<GitHubService> {
        return getService(this.dataSource)
    }
}
