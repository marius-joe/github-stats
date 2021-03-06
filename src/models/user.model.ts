import { Entity, model, property, hasMany } from '@loopback/repository'
import { Repo } from './repo.model'

@model()
export class User extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: false,
        required: true,
    })
    name: string

    @property({
        type: 'string',
        required: true,
    })
    nameAlias: string

    @property({
        type: 'string',
        required: true,
    })
    url: string

    @property({
        type: 'string',
    })
    location?: string

    @property({
        type: 'string',
    })
    bio?: string

    @property({
        type: 'string',
    })
    numPublicRepos?: number

    @hasMany(() => Repo, { keyTo: 'userName' })
    repos: Repo[]

    constructor(data?: Partial<User>) {
        super(data)
    }
}

export interface UserRelations {}

export type UserWithRelations = User & UserRelations
