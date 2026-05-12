import { z }                    from 'zod';

export const pageInfo = z.object({
    currentPage     :   z.number(),
    pageSize        :   z.number(),
    totalItems      :   z.number(),
    totalPages      :   z.number(),
    hasNextPage     :   z.boolean(),
    hasPreviousPage :   z.boolean(),
    nextPage        :   z.number().openapi({
        example : 'Return the page number if it exists; otherwise, return null',
    }),
    previousPage    :    z.number().openapi({
        example : 'Return the page number if it exists; otherwise, return null',
    }),
});

export const responseRetrieveProductsCategory = z.object({
    pageInfo : pageInfo,
    data : z.array(z.object({
        id                  : z.number(),
        title               : z.string(),
        description         : z.string(),
        priceIndividual     : z.number(),
        minQuantity         : z.number(),
        priceProfessional   : z.number(),
        // stock               : z.number(),
        discountThreshold   : z.number(),
        discountPercentage  : z.number(),
        thumbnailUrl        : z.string(),
    })),
},
);

