import { Reject, Response, HandlerContext, HttpErrors } from '@loopback/rest'
import { Provider, BoundValue, inject } from '@loopback/context'
import { writeResultToResponse, RestBindings, Request } from '@loopback/rest'

export class CustomRejectProvider implements Provider<Reject> {
    // In this example, the injection key for formatter is simple
    constructor(@inject(RestBindings.Http.REQUEST) public request: Request) {}

    value() {
        // Use the lambda syntax to preserve the "this" scope for future calls!
        return ({ request, response }: HandlerContext, error: Error) => {
            this.action({ request, response }, error)
        }
    }

    /**
     * @param response - The response object used to reply to the  client.
     */
    action({ request, response }: HandlerContext, error: Error) {
        // handle the error and send back the error response
        // "response" is an Express Response object
        // toDo: map ENTITY_NOT_FOUND to 404
        response.setHeader('Content-Type', 'application/json')
        if (error instanceof HttpErrors) {
            const httpError = HttpErrors(error)
            const errCode = httpError.statusCode
            switch (errCode) {
                case 404: {
                    response.status(errCode).send(httpError.message)
                    // response.status(errCode).json(
                             //{
                            //     status: errCode,
                            //     Message: httpError.message
                             //}                        
                        //{testMessage: httpError.message}
                        
                        //)
                        // `
                    break
                }
                default: {
                    response.status(errCode).json(
                        {
                            status: errCode,
                            Message: httpError.message + "  das ist ser default case"
                        }
                    )
                       // {testMessage: httpError.message}            
                    break
                }
            }
        } else {
            response.end() // right here ?
        }

        // Goal:
        // {
        //     “status”: ${responseCode}
        //     “Message”: ${whyHasItHappened}
        // }
    }
}
