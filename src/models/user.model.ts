import { Model, model, property } from '@loopback/repository';

@model({ settings: { strict: false } })
export class User extends Model {
    @property({
        type: 'string',
        id: true,
        generated: false,
        required: true,
    })
    name: string;

    @property({
        type: 'array',
        itemType: 'object',
    })
    repositories?: object[];

    // Define well-known properties here

    // Indexer property to allow additional data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string]: any;

    constructor(data?: Partial<User>) {
        super(data);
    }
}

export interface UserRelations {
    // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
