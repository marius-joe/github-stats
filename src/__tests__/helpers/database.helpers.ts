import { Getter } from '@loopback/context'
import { User, Repo, Branch } from '../../models'
import { UserRepository, RepoRepository, BranchRepository } from '../../repositories'
import { testdb } from '../fixtures/datasources/testdb.datasource'

// database tests integration is under construction

export async function givenEmptyDatabase() {
    let userRepository: UserRepository
    let repoRepository: RepoRepository
    let branchRepository: BranchRepository

    userRepository = new UserRepository(testdb, async () => RepoRepository)

    repoRepository = new RepoRepository(testdb, async () => BranchRepository)

    branchRepository = new BranchRepository(testdb)

    await UserRepository.deleteAll()
    await RepoRepository.deleteAll()
    await BranchRepository.deleteAll()
}

export function givenRepoData(data?: Partial<Repo>) {
    return Object.assign(
        {
            name: 'test-repo-name',
            userName: 'test-user-name',
            branches: [
                {
                    name: 'test-branch-name',
                    lastCommit: { sha: 'test-commit-sha' },
                    repoName: 'test-repo-name',
                },
            ],
        },
        data,
    )
}

export async function givenRepo(data?: Partial<Repo>) {
    return new RepoRepository(testdb, async () => BranchRepository).create(givenRepoData(data))
}
