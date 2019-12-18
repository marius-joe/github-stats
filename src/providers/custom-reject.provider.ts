import { Reject, Response, HandlerContext, HttpErrors } from '@loopback/rest'
import { Provider, BoundValue, inject } from '@loopback/context'
import { writeResultToResponse, RestBindings, Request } from '@loopback/rest'

/**
 * Provides a custom 'reject' Sequence Action which specifies a request's response in case of an error
 */
export class CustomRejectProvider implements Provider<Reject> {
    constructor(@inject(RestBindings.Http.REQUEST) public request: Request) {}

    value() {
        // Use the lambda syntax to preserve the "this" scope for future calls!
        return ({ request, response }: HandlerContext, error: Error) => {
            this.action({ request, response }, error)
        }
    }

    /**
     * Custom 'reject' Sequence Action: define own error response structure
     * @param response - The response object used to reply to the client.
     */
    action({ request, response }: HandlerContext, error: any) {
        response.setHeader('Content-Type', 'application/json')
        let sendResponse: boolean = false
        let httpError: any = undefined

        if (error instanceof HttpErrors.HttpError) {
            sendResponse = true
            httpError = error
        } else if (error.code == 'ENOTFOUND') {
            // in this case the GitHub API was not reachable
            sendResponse = true
            httpError = new HttpErrors.GatewayTimeout(`GitHub is not reachable, please try again later`)
        }

        if (sendResponse) {
            let errCode: number = httpError.statusCode
            let errMsg: string = httpError.message
            response.status(errCode).json(this.generateResponseObj(errCode, errMsg))
            response.end()
        }
    }

    generateResponseObj(errCode: number, errMsg: string): object {
        return {
            status: errCode,
            message: errMsg,
        }
    }
}
