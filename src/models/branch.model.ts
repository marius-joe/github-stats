import { Entity, model, property } from '@loopback/repository';

@model()
export class Branch extends Entity {
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
        default: {}
    })
    lastCommit: { sha: string };


    constructor(data?: Partial<Branch>) {
        super(data);
    }
}

export interface BranchRelations {
    // describe navigational properties here
}

export type BranchWithRelations = Branch & BranchRelations;
