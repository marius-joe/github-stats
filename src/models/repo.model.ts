import { Entity, model, property, hasMany } from '@loopback/repository'
import { Branch } from './branch.model'

@model()
export class Repo extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: false,
        required: true,
    })
    name: string

    @property({
        type: 'object',
        required: true,
    })
    owner: { login: string }

    @property({
        type: 'string',
    })
    userName?: string

    @hasMany(() => Branch, { keyTo: 'repoName' })
    branches: Branch[]

    constructor(data?: Partial<Repo>) {
        super(data)
    }
}

export interface RepoRelations {}

export type RepoWithRelations = Repo & RepoRelations
