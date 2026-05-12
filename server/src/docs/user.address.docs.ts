
import z                from 'zod';

import { messageInfo }  from '../schemas/cart.cartItem.schema';
import { responseUserAddress, 
    upadateUserAddressSchema, 
    userAddressSchema } from '../schemas/user.address.schema';
import { requestById } from '../utils/schemas.util';
import { registry }     from './setup';


// Create new address
registry.registerPath({
    method: 'post',
    path: '/api/v1/user/address',
    description: 'Create a new address for the specified user',
    summary: 'New address',
    tags : ['User Address'],
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
            description : 'User address created successfuly',
            content : {
                'application/json' : {
                    schema : messageInfo.merge( z.object({ address: responseUserAddress })),
                },
            },
        },
        401 : {
            description : 'Invalid token',
        },
        400 :   {
            description :   'Invalid schemas',
        },
        403 : {
            description : 'Permission denied',
        },
        // 404 : {
        //     description : 'Product not found',
        // },
    },
});

// Update quantity item
registry.registerPath({
    method: 'put',
    path: '/api/v1/user/address',
    description: 'Updates the address information for a specific user',
    summary: 'Update the user address',
    tags : ['User Address'],
    request : {
        params  :   requestById,
        body : {
            content : {
                'application/json' : {
                    schema : upadateUserAddressSchema,
                },
            },
        },
    },
    responses : {
        200 : {
            description : 'Address updated successfuly',
            content : {
                'application/json' : {
                    schema : messageInfo.merge( z.object({ address: responseUserAddress })),
                },
            },
        },
        401 : {
            description : 'Invalid token',
        },
        400 :   {
            description :   'Invalid schemas',
        },
        403 : {
            description : 'Permission denied',
        },
        404 : {
            description : 'Address not found',
        },
    },
});


// Delete user address
registry.registerPath({
    method: 'delete',
    path: '/api/v1/user/address/:id',
    description: 'Delete the user address information for a specific user',
    summary: 'Delete the user address information',
    tags : ['User Address'],
    request : {
        params  :   requestById,
    },
    responses : {
        200 : {
            description : 'Address deleted successfuly',
            content : {
                'application/json' : {
                    schema : messageInfo,
                },
            },
        },
        401 : {
            description : 'Invalid token',
        },
        // 400 :   {
        //     description :   'Invalida quantity'
        // },
        403 : {
            description : 'Permission denied',
        },
        404 : {
            description : 'Address not found',
        },
    },
});

// Retrieve all address information for a specific user 
registry.registerPath({
    method: 'get',
    path: '/api/v1/user/address/:id',
    description: 'Fetche the address information for a specific user',
    summary: 'Retrieve the address information',
    tags : ['User Address'],
    request : {
        params  :   requestById,
    },
    responses : {
        200 : {
            description : 'The address information Retrieved successfuly',
            content : {
                'application/json' : {
                    schema : responseUserAddress,
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
            description : 'Address not found',
        },
    },
});


// Retrieve the address information for a specific user
registry.registerPath({
    method: 'get',
    path: '/api/v1/user/address',
    description: 'Fetches all address records associated with a specific user',
    summary: 'Retrieve all address',
    tags : ['User Address'],
    responses : {
        200 : {
            description : 'The address information Retrieved successfuly',
            content : {
                'application/json' : {
                    schema : z.array(
                        responseUserAddress,
                    ),
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