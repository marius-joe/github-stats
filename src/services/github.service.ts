import { getService } from '@loopback/service-proxy'
import { inject, Provider } from '@loopback/core'
import { GithubDataSource } from '../datasources'

export interface Repository {
}

export interface GitHubService {
    // map Node.js method to REST operation as stated in the GitHub datasource file
    getRepositories(username: string): Promise<Repository[]>
}

export class GitHubServiceProvider implements Provider<GitHubService> {
    constructor(
        @inject('datasources.github')
        protected dataSource: GithubDataSource = new GithubDataSource(),
    ) { }

    value(): Promise<GitHubService> {
        return getService(this.dataSource)
    }
}
