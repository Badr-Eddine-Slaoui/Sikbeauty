import { bodyCatItem, 
    incrementDecrementSchema,
    itemcartSchema,
    messageInfo, 
    quantity, 
}                       from '../schemas/cart.cartItem.schema';
import { requestById }  from '../utils/schemas.util';
import { registry }     from './setup';

// Create new item
registry.registerPath({
    method: 'post',
    path: '/api/v1/cart/items',
    description: 'Create new item',
    summary: 'New item',
    tags : ['Cart && cartItem'],
    request : {
        body : {
            content : {
                'application/json' : {
                    schema : bodyCatItem,
                },
            },
        },
    },
    responses : {
        201 : {
            description : 'Item created successfuly',
            content : {
                'application/json' : {
                    schema : messageInfo.merge( itemcartSchema ),
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
    },
});

// Update quantity item
registry.registerPath({
    method: 'put',
    path: '/api/v1/cart/items/:id',
    description: 'Update quantity item',
    summary: 'Update item',
    tags : ['Cart && cartItem'],
    request : {
        params  :   requestById,
        body : {
            content : {
                'application/json' : {
                    schema : quantity,
                },
            },
        },
    },
    responses : {
        200 : {
            description : 'Item quantity updated successfuly',
            content : {
                'application/json' : {
                    schema : messageInfo.merge( itemcartSchema ),
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
            description : 'Item not found',
        },
    },
});


// Increment decrement item item
registry.registerPath({
    method: 'patch',
    path: '/api/v1/cart/items/:id',
    description: 'Update quantity item',
    summary: 'Update item (increment, decrement)',
    tags : ['Cart && cartItem'],
    request : {
        params  :   requestById,
        body : {
            content : {
                'application/json' : {
                    schema : incrementDecrementSchema,
                },
            },
        },
    },
    responses : {
        200 : {
            description : 'Item quantity updated successfuly',
            content : {
                'application/json' : {
                    schema : messageInfo.merge( itemcartSchema ),
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
            description : 'Item not found',
        },
    },
});

// Retrieve cart info 
registry.registerPath({
    method: 'get',
    path: '/api/v1/cart/items/',
    description: 'Retrieve cart info',
    summary: 'cart info',
    tags : ['Cart && cartItem'],
    responses : {
        200 : {
            description : 'cart info Retrieved successfuly',
            content : {
                'application/json' : {
                    schema : itemcartSchema,
                },
            },
        },
        401 : {
            description : 'Invalid token',
        },
        403 : {
            description : 'Permission denied',
        },
    },
});

// delete item 
registry.registerPath({
    method: 'delete',
    path: '/api/v1/cart/items/:id',
    description: 'delete item cart',
    summary: 'delete item',
    tags : ['Cart && cartItem'],
    request : {
        params  :   requestById,
    },
    responses : {
        200 : {
            description : 'Cart item deleted successfuly',
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
            description : 'Item not found',
        },
    },
});