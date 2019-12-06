import { DefaultCrudRepository } from '@loopback/repository'
import { Branch, BranchRelations } from '../models'
import { DbDataSource } from '../datasources'
import { inject } from '@loopback/core'

export class BranchRepository extends DefaultCrudRepository<Branch, typeof Branch.prototype.name, BranchRelations> {
    constructor(@inject('datasources.db') dataSource: DbDataSource) {
        super(Branch, dataSource)
    }
}
