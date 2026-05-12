
import z                    from 'zod';

import { newCategorySchemas, 
    updateCategorySchemas } from '../schemas/categories.schema';
import { requestById }      from '../utils/schemas.util';
import { registry }         from './setup';

// Ceate new category
registry.registerPath({
    method: 'post',
    path: '/api/v1/admin/categories',
    description: 'Create new category',
    summary: 'New category',
    tags : ['Categories'],
    request : {
        body : {
            content : {
                'application/json' : {
                    schema : newCategorySchemas,
                },
            },
        },
    },
    responses : {
        201 : {
            description : 'Category created successfuly',
            content : {
                'application/json' : {
                    schema : z.object({
                        status : z.string(),
                        message : z.string(),
                        data : z.object({
                            id          : z.number(),
                            name        : z.string(),
                            slug        : z.string(),
                            isActive    : z.boolean(),
                            createdAt   : z.date(),
                            updatedAt   : z.date(),
                        }),
                    }),
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

// Update category
registry.registerPath({
    method: 'put',
    path: '/api/v1/admin/categories/:id',
    description: 'Update  category',
    summary: 'Update category',
    tags : ['Categories'],
    request : {
        params : requestById,
        body : {
            content : {
                'application/json' : {
                    schema : updateCategorySchemas,
                },
            },
        },
    },
    responses : {
        200 : {
            description : 'Category updated successfuly',
            content : {
                'application/json' : {
                    schema : z.object({
                        status : z.string(),
                        message : z.string(),
                        data : z.object({
                            id          : z.number(),
                            name        : z.string(),
                            slug        : z.string(),
                            isActive    : z.boolean(),
                            createdAt   : z.date(),
                            updatedAt   : z.date(),
                        }),
                    }),
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


// registry.registerPath({
//     method: 'delete',
//     path: '/api/v1/admin/categories/:id',
//     description: 'Change status of category with products',
//     summary: 'Change status of category with products',
//     tags : ['Categories'],
//     request : {
//         params : requestById,
//     },
//     responses : {
//         200 : {
//             description : 'Category deleted successfuly',
//             content : {
//                 'application/json' : {
//                     schema : z.object({
//                         status : z.string(),
//                         message : z.string(),
//                     }),
//                 },
//             },
//         },
//         401 : {
//             description : 'Invalid token',
//         },
//         403 : {
//             description : 'Permission denied',
//         },
//         404 : {
//             description : 'Invalid data',
//         },
//     },
// });