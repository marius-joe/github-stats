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
    action({ request, response }: HandlerContext, error: Error) {
        response.setHeader('Content-Type', 'application/json')
        if (error instanceof HttpErrors.HttpError) {
            const httpError = HttpErrors(error)
            const errCode = httpError.statusCode
            response.status(errCode).json({
                status: errCode,
                message: httpError.message,
            })
            response.end()
        } else {
            response.end()
        }
    }
}
