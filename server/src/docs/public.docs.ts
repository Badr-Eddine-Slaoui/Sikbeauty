
import z                    from 'zod';

import { registry }         from './setup';

registry.registerPath({
    method: 'get',
    path: '/api/v1/products/latest',
    description: 'Retrieve 5 products',
    summary: 'Get latest 5 products',
    tags : ['Public'],
    responses : {
        200 : {
            description : 'get all categories successfuly',
            content : {
                'application/json' : {
                    schema : z.array(
                        z.object({
                            id                  :   z.number(),
                            title               :   z.string(),
                            description         :   z.string(),
                            priceIndividual     :   z.number(),
                            thumbnailUrl        :   z.string(),
                            discountPercentage  :   z.number(),
                            discountThreshold   :   z.number(),
                        }),
                    ),
                },
            },
        },
    },
});