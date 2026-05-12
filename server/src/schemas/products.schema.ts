import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z }                    from 'zod';

import { 
    validImageTypes,
    // validMimeTypes, 
    validVideoMimeTypes }       from '../utils';
import { requestById }          from '../utils/schemas.util';

extendZodWithOpenApi(z);

// export const imageSchemas = z
//     .instanceof(File)
//     .refine(
//         (file) =>
//             validMimeTypes.includes(file.type),
//         { message: 'Invalid image file type' },
//     )
//     .refine((file) => file.size <= max_limit, {
//         message: 'File size should not exceed 10MB',
//     });

export const productType = z.enum(['PRICE', 'PERCENT']).nullable();

export const imageSchema = z.object({
    originalname: z.string(),
    mimetype: z.string().refine((type) => validImageTypes.includes(type), {
        message: 'Invalid image type. Only jpeg, or png allowed.',
    }),
    size: z.number().refine((size) => size <= 2 * 1024 * 1024, {
        message: 'File size exceeds 2MB.',
    }),
});

const videoSchema = z.object({
    originalname: z.string(),
    mimetype: z.string().refine((type) => validVideoMimeTypes.includes(type), {
        message: 'Invalid video type (mp4 only).',
    }),
    size: z.number().refine((size) => size <= 10 * 1024 * 1024, {
        message: 'Video size exceeds 10MB.',
    }),
}).nullable();

export const newProductSchemas = z.object({
    title: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be at most 50 characters'),
    
    description: z.string()
        .max(255, 'Description too long')
        .optional(),
    
    price    :   z.number()
        .gte(0),
    //     priceIndividual    :   z.number()
    //     .gte(0),
    // priceProfessional    :   z.number()
    //     .gte(0),
    
    discountType   :   productType.nullable(),

    discount  :   z.number()
        .int( { message: "Discount must be an integer (no decimals)." })
        .min(0, { message: "Discount cannot be negative." }),

    // stock               :   z.number()
    //     .gte(0),
    
    categoryId          :   z.number()
        .gte(1),

    // minQuantity         :   z.number()
    //     .gte(1),

    images              : z.array(imageSchema).
        min(1, { message: 'At least one image is required' } ).
        max(5, { message: 'You can upload up to 5 images only' }),
    video : videoSchema.optional(),
}).strict()
    .superRefine( (val, ctx) => {
        if ( !val.discountType && val.discount ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Cannot set a discount without specifying a discount type (PRICE or PERCENT).',
                path: ['discount'],
            });
        }
        // console.error( val.discountType , val.discount < 0 && val.discount > 100 ? true : false )
        if ( val.discountType && val.discountType === 'PERCENT' 
                && ( val.discount <= 0 || val.discount > 100 ) ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Discount percentage must be between 0 and 100.',
                path: ['discount'],
            });
        }
    });

export const schemaImageVideo = z.object({
    image : imageSchema
        .optional()
        .nullable(),
    video : videoSchema
        .optional()
        .nullable(),
}).strict();

export const updateProductSchemasInfo = z.object({
    title: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be at most 50 characters')
        .optional(),
    
    description: z.string()
        .max(255, 'Description too long')
        .optional(),
    
    price    :   z.number()
        .gte(0)
        .optional(),
    // priceIndividual    :   z.number()
    //     .gte(0)
    //     .optional(),
    // priceProfessional    :   z.number()
    //     .gte(0)
    //     .optional(),
    
    discountType   :   z.enum(['PRICE', 'PERCENT']).optional(),

    discount  :   z.number()
        .min(0)
        .gte(0)
        .optional(),

    // discountPercentage  :   z.number()
    //     .min(0)
    //     .max(100)
    //     .gte(0)
    //     .optional(),


    // stock               :   z.number()
    //     .gte(0)
    //     .optional(),
    
    categoryId          :   z.number()
        .gte(1)
        .optional(),
    
    minQuantity         :   z.number()
        .gte(1)
        .optional(),

    // stock               :   z.number()
    //     .gte(0)
    //     .optional(),
    status              :   z.boolean()
        .optional(),
}).strict();


export const updateImage = z.object({
    image : imageSchema,
}).strict();

export const paramsSchema = requestById.extend({
    imageId: z.string()
        .regex(/^\d+$/, { message: 'Id must contain only numbers' })
        .openapi({
            param : {
                in : 'path',
                name : 'imageId', 
            },
            example : 'Start from 1 -> image in index 0',
        }),
});

export const searchSchema = z.object({
    search : z.string()
        .min(1, 'Name must be at least 1 characters')
        .max(50, 'Name must be at most 50 characters')
        .optional()
        .transform((val) => {
            if (!val) return undefined;
            const trimmed = val.trim();
            return trimmed === '' ? undefined : trimmed;
        }),
}).strict();

export const paginationSchema = z.object({
    limit : z.string()
        .regex(/^\d+$/, { message: 'Limit must contain only numbers' })
        .openapi({
            param : {
                in : 'query',
                name : 'limit', 
            },
        }),
    page  : z.string()
        .regex(/^[1-9]\d*$/, { message: 'Page must be a positive integer starting from 1' })
        
        .openapi({
            param : {
                in : 'query',
                name : 'page', 
            },
        }),
}).strict();

export const productPagination = paginationSchema.merge( searchSchema )
    .strict();

export const responseRetrieveProductsCategory = z.object({
    pageInfo : z.object({
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
    }),
    data : z.array(z.object({
        id                  : z.number(),
        title               : z.string(),
        description         : z.string(),
        // priceIndividual     : z.number()
        //     .openapi({
        //         example : 'This is exist if role of user is admin',
        //     }),
        price :             z.number().openapi({
            // example : 'This is exist if role of user is Professionnel or Individual',
        }),
        // minQuantity         : z.number(),
        // priceProfessional   : z.number()
        //     .openapi({
        //         example : 'This is exist if role of user is admin',
        //     }),
        // stock               : z.number(),
        discount            :   z.number(),
        discountType        :   z.string() || z.null(),
        finalPrice          :   z.number(),
        thumbnailUrl        :   z.string(),
        status              :   z.boolean(),
    })),
},
);
type DiscountType = 'PRICE' | 'PERCENT';
export type Product = {
    id                  :   number,
    title               :   string,
    description         :   string,
    // priceIndividual     :   number,
    // priceProfessional   :   number,
    price               :   number,
    discountType        :   DiscountType | null ,
    discount            :   number,
    // stock               :   number,
    categoryId          :   number,
    // minQuantity         :   number,
}

export type Pagination = z.infer<typeof productPagination>
export type UpdateProductInfo = z.infer<typeof updateProductSchemasInfo>