
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z }                    from 'zod';

import { search }               from '../utils/schemas.util';

extendZodWithOpenApi(z);

// Create new category
export const newCategorySchemas = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be at most 50 characters'),

    slug        :   z.string().regex(/^[a-z0-9-]+$/, {
        message: 'Slug must only contain lowercase letters, numbers, and hyphens', 
    }).optional(),

}).strict();


// Update category schema
export const updateCategorySchemas = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be at most 50 characters')
        .optional(),
    slug : z.string().regex(/^[a-z0-9-]+$/, {
        message: 'Slug must only contain lowercase letters, numbers, and hyphens',
    }).optional(),
}).strict();


export const filterCategories = z.object({
    search : search.openapi({
        description : 'This filter is optionel and used in admin for filtring categories ( true -->`active`| false `inactive`)',
    }).optional(),
}).strict()
    .superRefine(( val, ctx ) => {
        if ( val.search &&  val.search !== 'true' && val.search != 'false') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'You must use `true | false',
                path: ['search'],
            });
        }
    });

export type FilterCategories = z.infer<typeof filterCategories>
export type NewCaterory = z.infer<typeof newCategorySchemas>
export type UpadeCategory = z.infer<typeof updateCategorySchemas>