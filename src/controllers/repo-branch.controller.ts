import { Count, CountSchema, Filter, repository, Where } from '@loopback/repository'
import { del, get, getModelSchemaRef, getWhereSchemaFor, param, patch, post, requestBody } from '@loopback/rest'
import { Repo, Branch } from '../models'
import { RepoRepository } from '../repositories'

export class RepoBranchController {
    constructor(@repository(RepoRepository) protected repoRepository: RepoRepository) {}

    @get('/repos/{id}/branches', {
        responses: {
            '200': {
                description: "Array of Branch's belonging to Repo",
                content: {
                    'application/json': {
                        schema: { type: 'array', items: getModelSchemaRef(Branch) },
                    },
                },
            },
        },
    })
    async find(
        @param.path.string('id') id: string,
        @param.query.object('filter') filter?: Filter<Branch>,
    ): Promise<Branch[]> {
        return this.repoRepository.branches(id).find(filter)
    }

    @post('/repos/{id}/branches', {
        responses: {
            '200': {
                description: 'Repo model instance',
                content: { 'application/json': { schema: getModelSchemaRef(Branch) } },
            },
        },
    })
    async create(
        @param.path.string('id') id: typeof Repo.prototype.name,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Branch, {
                        title: 'NewBranchInRepo',
                        exclude: ['name'],
                        optional: ['repoName'],
                    }),
                },
            },
        })
        branch: Omit<Branch, 'name'>,
    ): Promise<Branch> {
        return this.repoRepository.branches(id).create(branch)
    }

    @patch('/repos/{id}/branches', {
        responses: {
            '200': {
                description: 'Repo.Branch PATCH success count',
                content: { 'application/json': { schema: CountSchema } },
            },
        },
    })
    async patch(
        @param.path.string('id') id: string,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(Branch, { partial: true }),
                },
            },
        })
        branch: Partial<Branch>,
        @param.query.object('where', getWhereSchemaFor(Branch)) where?: Where<Branch>,
    ): Promise<Count> {
        return this.repoRepository.branches(id).patch(branch, where)
    }

    @del('/repos/{id}/branches', {
        responses: {
            '200': {
                description: 'Repo.Branch DELETE success count',
                content: { 'application/json': { schema: CountSchema } },
            },
        },
    })
    async delete(
        @param.path.string('id') id: string,
        @param.query.object('where', getWhereSchemaFor(Branch)) where?: Where<Branch>,
    ): Promise<Count> {
        return this.repoRepository.branches(id).delete(where)
    }
}
