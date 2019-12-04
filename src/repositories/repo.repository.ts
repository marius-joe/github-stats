import { DefaultCrudRepository, repository, HasManyRepositoryFactory } from '@loopback/repository'
import { Repo, RepoRelations, Branch } from '../models'
import { DbDataSource } from '../datasources'
import { inject, Getter } from '@loopback/core'
import { BranchRepository } from './branch.repository'

export class RepoRepository extends DefaultCrudRepository<Repo, typeof Repo.prototype.name, RepoRelations> {
    public readonly branches: HasManyRepositoryFactory<Branch, typeof Repo.prototype.name>

    constructor(
        @inject('datasources.db') dataSource: DbDataSource,
        @repository.getter('BranchRepository') protected branchRepositoryGetter: Getter<BranchRepository>,
    ) {
        super(Repo, dataSource)
        this.branches = this.createHasManyRepositoryFactoryFor('branches', branchRepositoryGetter)
        this.registerInclusionResolver('branches', this.branches.inclusionResolver)
    }
}
