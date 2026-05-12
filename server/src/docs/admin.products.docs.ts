import z                        from 'zod';

import { newProductSchemas, 
    paramsSchema, 
    updateImage,    
    updateProductSchemasInfo,
}                               from '../schemas/products.schema';
import { requestById }          from '../utils/schemas.util';
import { registry }             from './setup';

// Retrive all products with pagination 

// Create new product 
registry.registerPath({
    method: 'post',
    path: '/api/v1/admin/products',
    description: 'Create new product',
    summary: 'New product',
    tags : ['Products'],
    request : {
        body : {
            content : {
                'application/json' : {
                    schema : newProductSchemas,
                },
            },
        },
    },
    responses : {
        200 : {
            description : 'Category created successfuly',
            content : {
                'application/json' : {
                    schema : z.object({
                        status : z.string(),
                        message : z.string(),
                        data : z.object({
                            id              :   z.number().gte(1),
                            thumbnailUrl    :   z.string(),
                            title           :   z.string(),
                            description     :   z.string(),
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

// Update product info
registry.registerPath({
    method: 'put',
    path: '/api/v1/admin/products/:id',
    description: 'Update product info',
    summary: 'Update product info',
    tags : ['Products'],
    request : {
        params : requestById,
        body : {
            content : {
                'application/json' : {
                    schema : updateProductSchemasInfo,
                },
            },
        },
    },
    responses : {
        201 : {
            description : 'Product info updated successfuly',
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

// Upadate other images
registry.registerPath({
    method: 'patch',
    path: '/api/v1/admin/products/:id/images/:imageId',
    description: 'Update product image',
    summary: 'Update product image',
    tags : ['Products'],
    request : {
        params : paramsSchema,
        body : {
            content : {
                'application/json' : {
                    schema : updateImage,
                },
            },
        },
    },
    responses : {
        201 : {
            description : 'Product image updated successfuly',
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

// Update thumbnail image
registry.registerPath({
    method: 'patch',
    path: '/api/v1/admin/products/:id/thumbnail',
    description: 'Update product thumbnail image',
    summary: 'Update product thumbnail',
    tags : ['Products'],
    request : {
        params : requestById,
        body : {
            content : {
                'application/json' : {
                    schema : updateImage,
                },
            },
        },
    },
    responses : {
        201 : {
            description : 'Product thumbnail image updated successfuly',
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

// Add new image or video
registry.registerPath({
    method: 'post',
    path: '/api/v1/admin/products/:id/images',
    description: 'Add new image or video( update if exist otherwise uploaded)',
    summary: 'Add new image or video',
    tags : ['Products'],
    request : {
        params : requestById,
        body : {
            content : {
                'application/json' : {
                    schema : updateImage,
                },
            },
        },
    },
    responses : {
        200 : {
            description : 'Pdoduct image added successfuly',
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

// Delete image
registry.registerPath({
    method: 'delete',
    path: '/api/v1/admin/products/:id/images/:imageId',
    description: 'Delete product image',
    summary: 'Update product image',
    tags : ['Products'],
    request : {
        params : paramsSchema,
    },
    responses : {
        200 : {
            description : 'Product image deleted successfuly',
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

