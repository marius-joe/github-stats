import { BootMixin } from '@loopback/boot'
import { ApplicationConfig } from '@loopback/core'
import { RestExplorerBindings, RestExplorerComponent } from '@loopback/rest-explorer'
import { RepositoryMixin } from '@loopback/repository'
import { RestApplication, RestBindings } from '@loopback/rest'
import { ServiceMixin } from '@loopback/service-proxy'
import * as path from 'path'
import { MySequence } from './sequence'
import { CustomRejectProvider } from './providers/custom-reject.provider'
import { BindingScope } from '@loopback/context'

export class GitHubStatsApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
    constructor(options: ApplicationConfig = {}) {
        super(options)

        // Set up the custom sequence
        this.sequence(MySequence)

        // whenever the 'reject' action of MySequence is called, it will be
        // overridden by the custom 'reject' listed under the RestBindings.SequenceActions namespace
        this.bind(RestBindings.SequenceActions.REJECT).toProvider(CustomRejectProvider)

        // Set up default home page
        this.static('/', path.join(__dirname, '../public'))

        // Customize @loopback/rest-explorer configuration here
        this.bind(RestExplorerBindings.CONFIG).to({
            path: '/explorer',
        })
        this.component(RestExplorerComponent)

        this.projectRoot = __dirname
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        }
    }
}
