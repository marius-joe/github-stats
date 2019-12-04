import { DefaultCrudRepository, repository, HasManyRepositoryFactory } from '@loopback/repository'
import { User, UserRelations, Repo } from '../models'
import { DbDataSource } from '../datasources'
import { inject, Getter } from '@loopback/core'
import { RepoRepository } from './repo.repository'

export class UserRepository extends DefaultCrudRepository<User, typeof User.prototype.name, UserRelations> {
    public readonly repos: HasManyRepositoryFactory<Repo, typeof User.prototype.name>

    constructor(
        @inject('datasources.db') dataSource: DbDataSource,
        @repository.getter('RepoRepository') protected repoRepositoryGetter: Getter<RepoRepository>,
    ) {
        super(User, dataSource)
        this.repos = this.createHasManyRepositoryFactoryFor('repos', repoRepositoryGetter)
        this.registerInclusionResolver('repos', this.repos.inclusionResolver)
    }
}
