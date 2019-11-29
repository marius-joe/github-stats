import { Entity, model, property } from '@loopback/repository';
import { Branch } from '.'

@model()
export class Repository extends Entity {
    @property({
        type: 'string',
        id: true,
        generated: false,
        required: true,
    })
    name: string;

    @property({
        type: 'object',
        required: true,
    })
    owner: { login: string };

    @property({
        type: 'array',
        itemType: 'object',
    })
    branches?: Branch[];


    constructor(data?: Partial<Repository>) {
        super(data);
    }
}

export interface RepositoryRelations {
    // describe navigational properties here
}

export type RepositoryWithRelations = Repository & RepositoryRelations;
