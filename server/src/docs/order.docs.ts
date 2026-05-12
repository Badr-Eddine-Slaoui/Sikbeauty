import z                            from 'zod';
import { 
    messageInfo, 
}                                   from '../schemas/cart.cartItem.schema';
import { registry }                 from './setup';
import { userAddressSchema }        from '../schemas/user.address.schema';
import { allInformationResonseOrderById, 
    responseOrderSuccess, 
    searchOrderSchema }             from '../schemas/order.orderItem.schema';
import { requestById }              from '../utils/schemas.util';
import { responseConflictCart }     from '../schemas/checkout.schema';

// return res.status( StatusCodes.CONFLICT ).json({
//     status      :   'REQUIRES_CONFIRMATION',
//     message     :   'Some items in your cart have changed',
//     conflicts   :   message.messageConflict,
//     newCart     :   newCartClient
// });
// const conflict = z.array( z.object({

// }))
// Create new item
registry.registerPath({
    method: 'post',
    path: '/api/v1/cart/orders',
    description: 'Create new order',
    summary: 'New order',
    tags : ['Order && orderItems '],
    request : {
        body : {
            content : {
                'application/json' : {
                    schema : userAddressSchema,
                },
            },
        },
    },
    responses : {
        201 : {
            description : 'Item created successfuly',
            content : {
                'application/json' : {
                    schema : messageInfo,
                },
            },
        },
        401 : {
            description : 'Invalid token',
        },
        400 :   {
            description :   'Validator quantity',
        },
        403 : {
            description : 'Permission denied',
        },
        404 : {
            description : 'Product not found',
        },
        409 : {
            description : "Conflict in cart 'product status is false'", 
            content : {
                "application/json" : {
                    schema : responseConflictCart
                }
            }
        }
    },
});


registry.registerPath({
    method: 'get',
    path: '/api/v1/cart/orders',
    description: 'Retreive order information using filters and paginations api admin',
    summary: 'Retreive order (FILTER) ',
    tags : ['ADMIN'],
    request : {
        query : searchOrderSchema
    },
    responses : {
        201 : {
            description : 'Get information orders successfuly',
            content : {
                'application/json' : {
                    schema : responseOrderSuccess,
                },
            },
        },
        401 : {
            description : 'Invalid token',
        },
        400 :   {
            description :   'Validator error',
        },
        403 : {
            description : 'Permission denied',
        },
    },
});


registry.registerPath({
    method: 'get',
    path: '/api/v1/cart/orders/:id',
    description: 'Retreive order information by id api admin',
    summary: 'Retreive order informations',
    tags : ['ADMIN'],
    request : {
        // query : searchOrderSchema,
        params : requestById,
    },
    responses : {
        201 : {
            description : 'Get information order by id successfuly',
            content : {
                'application/json' : {
                    schema : allInformationResonseOrderById,
                },
            },
        },
        401 : {
            description : 'Invalid token',
        },
        400 :   {
            description :   'Validator error',
        },
        403 : {
            description : 'Permission denied',
        },
    },
});