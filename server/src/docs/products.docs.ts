import { registry }                     from './setup';
import { productPagination, 
    responseRetrieveProductsCategory }  from '../schemas/products.schema';
import { requestById }                  from '../utils/schemas.util';
import z                                from 'zod';

// Retrive all products with pagination 
registry.registerPath({
    method: 'get',
    path: '/api/v1/products',
    description: 'Retrieve all product using pagination and search',
    summary: 'Retrieve all product using pagination and search ',
    tags : ['Products'],
    request : {
        query : productPagination
    },
    responses : {
        200 : {
            description : 'Retrive all products successfuly',
            content : {
                'application/json' : {
                    schema : z.array( responseRetrieveProductsCategory )
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

// Retrive product using id 
registry.registerPath({
    method: 'get',
    path: '/api/v1/products/:id',
    description: 'Retrieve product using id',
    summary: 'Retrieve using id',
    tags : ['Products'],
    request : {
        params : requestById,
    },
    responses : {
        200 : {
            description : 'Retrive product information successfuly',
            content : {
                'application/json' : {
                    schema : responseRetrieveProductsCategory
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
