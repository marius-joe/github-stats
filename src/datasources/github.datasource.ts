import { inject, lifeCycleObserver, LifeCycleObserver, ValueOrPromise } from '@loopback/core'
import { juggler } from '@loopback/repository'
import * as config from './github.datasource.config.json'

/**
 * A REST datasource that maps to the GitHub API
 */
@lifeCycleObserver('datasource')
export class GithubDataSource extends juggler.DataSource implements LifeCycleObserver {
    static dataSourceName = 'github'

    constructor(
        @inject('datasources.config.github', { optional: true })
        dsConfig: object = config,
    ) {
        super(dsConfig)
    }

    /**
     * Start the datasource when application is started
     */
    start(): ValueOrPromise<void> {
        // Addional logic can be inserted here
    }

    /**
     * Disconnect the datasource when application is stopped. This allows the
     * application to be shut down gracefully.
     */
    stop(): ValueOrPromise<void> {
        return super.disconnect()
    }
}
