import { createStubInstance, expect, sinon, StubbedInstanceWithSinonAccessor } from '@loopback/testlab'
import { UserRepository } from '../../../repositories'
import { UserController } from '../../../controllers'

// unit tests with database integration are under construction

describe('UserController (unit)', () => {
    let repository: StubbedInstanceWithSinonAccessor<UserRepository>
    beforeEach(givenStubbedRepository)

    describe('getUserInfo()', () => {
        it('retrieves information of a user', async () => {
            const controller = new UserController(repository)
            repository.stubs.find.resolves([
                {
                    name: 'test-user',
                    name_alias: 'test-alias',
                    url: 'test-url',
                },
            ])

            const details = await controller.getUserInfo('test-user')

            expect(details).to.containEql({ name: 'test-user', name_alias: 'test-alias' })
            sinon.assert.calledWithMatch(repository.stubs.find, {
                where: { name: 'test-user' },
            })
        })
    })

    function givenStubbedRepository() {
        repository = createStubInstance(UserRepository)
    }
})
