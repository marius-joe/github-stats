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
