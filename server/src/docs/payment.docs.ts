import z                            from 'zod';
import { registry } from './setup';
import { checkoutSessionPaymnetSchema } from '../schemas/payment.schema';

// Retrive all products with pagination 
registry.registerPath({
    method: 'post',
    path: '/api/v1/payment',
    description: 'Create checkout session ',
    summary: 'Create checkout session',
    tags : ['Paymnet Chcekout'],
    request : {
        query : checkoutSessionPaymnetSchema
    },
    responses : {
        200 : {
            description : 'checkout session created successfully',
            content : {
                'application/json' : {
                    schema : z.object({
                        status :    z.string(),
                        url    :    z.string()
                    })
                },
            },
        },
        401 : {
            description : 'Invalid token',
        },
        403 : {
            description : 'Permission denied',
        },
        404 : {
            description : 'Invalid data',
        },
    },
});