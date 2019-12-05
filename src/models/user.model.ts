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
    name_alias: string

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
    num_public_repos?: number

    @hasMany(() => Repo, { keyTo: 'userName' })
    repos: Repo[]

    constructor(data?: Partial<User>) {
        super(data)
    }
}

export interface UserRelations {
    // describe navigational properties here
}

export type UserWithRelations = User & UserRelations
