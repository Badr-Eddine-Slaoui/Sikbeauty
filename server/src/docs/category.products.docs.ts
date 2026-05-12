import z                                    from 'zod';

import { filterCategories }                 from '../schemas/categories.schema';
import { paginationSchema, 
    responseRetrieveProductsCategory }      from '../schemas/products.schema';
import { requestById }                      from '../utils/schemas.util';
import { registry }                         from './setup';


registry.registerPath({
    method: 'get',
    path: '/api/v1/categories',
    description: 'get all categories using filter',
    summary: 'Get all categories',
    tags : ['Shared-products-categories'],
    request : {
        query : filterCategories,
    },
    responses : {
        200 : {
            description : 'get all categories successfuly',
            content : {
                'application/json' : {
                    schema : z.array(
                        z.object({
                            id          : z.number(),
                            name        : z.string(),
                            slug        : z.string(),
                            isActive    : z.boolean(),
                            createdAt   : z.date(),
                            updatedAt   : z.date(),
                        }),
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
        404 : {
            description : 'Invalid data',
        },
    },
});

registry.registerPath({
    method: 'get',
    path: '/api/v1/categories/:id/products',
    description: 'Retrieve all products for a specific category with pagination using page and limit query parameters',
    summary: 'Get paginated products by category ID',
    tags : ['Shared-products-categories'],
    request : {
        query   :   paginationSchema,
        params  :   requestById,
    },
    responses : {
        200 : {
            description : 'Retrieve all products for a specific category successfuly',
            content : {
                'application/json' : {
                    schema : responseRetrieveProductsCategory,
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
