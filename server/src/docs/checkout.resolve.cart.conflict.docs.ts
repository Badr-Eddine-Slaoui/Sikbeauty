import z                        from 'zod';


import { registry }             from './setup';
import { checkoutItems, 
    responseConflictCart }      from '../schemas/checkout.schema';
import { messageInfo }          from '../schemas/cart.cartItem.schema';

// Resolve conflict cart 
registry.registerPath({
    method: 'post',
    path: 'api/v1/checkout/accept',
    description: 'Resolve conflict cart',
    summary: 'Resolve conflict cart',
    tags : ['Resolve and Validate Conflict Cart'],
    request : {
        body : {
            content : {
                'application/json' : {
                    schema : checkoutItems,
                },
            },
        },
    },
    responses : {
        200 : {
            description : 'Category created successfuly',
            content : {
                'application/json' : {
                    schema : messageInfo,
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

// Check validate cart
registry.registerPath({
    method: 'post',
    path: 'api/v1/checkout',
    description: 'Check cart is valid',
    summary: 'Validate cart',
    tags : ['Resolve and Validate Conflict Cart'],
    responses : {
        200 : {
            description : 'Cart validate successfully',
            content : {
                'application/json' : {
                    schema : messageInfo,
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
        409 : {
            description : "Conflict in cart 'product status is false'", 
            content : {
                'application/json' : {
                    schema : responseConflictCart,
                },
            },
        },
    },
});