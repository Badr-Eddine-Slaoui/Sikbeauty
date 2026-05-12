import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z }                    from 'zod';

extendZodWithOpenApi(z);

// Create blog schema
export const createBlogSchema = z.object({
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title must be at most 200 characters')
        .trim(),
    content: z.string()
        .min(10, 'Content must be at least 10 characters'),
    excerpt: z.string()
        .max(500, 'Excerpt must be at most 500 characters')
        .optional(),
    isPublished: z.preprocess(
        (val) => val === 'true' || val === true,
        z.boolean().optional().default(false)
    ),
}).strict();

// Update blog schema
export const updateBlogSchema = z.object({
    title: z.string()
        .min(3, 'Title must be at least 3 characters')
        .max(200, 'Title must be at most 200 characters')
        .trim()
        .optional(),
    content: z.string()
        .min(10, 'Content must be at least 10 characters')
        .optional(),
    excerpt: z.string()
        .max(500, 'Excerpt must be at most 500 characters')
        .optional(),
    isPublished: z.preprocess(
        (val) => val === 'true' || val === true,
        z.boolean().optional()
    ),
}).strict();

// Pagination schema for blogs
export const blogPaginationSchema = z.object({
    page: z.string()
        .regex(/^[1-9]\d*$/, { message: 'Page must be a positive integer starting from 1' })
        .optional()
        .default('1')
        .openapi({
            param: {
                in: 'query',
                name: 'page',
            },
        }),
    limit: z.string()
        .regex(/^\d+$/, { message: 'Limit must contain only numbers' })
        .optional()
        .default('10')
        .openapi({
            param: {
                in: 'query',
                name: 'limit',
            },
        }),
    published: z.enum(['true', 'false', 'all'])
        .optional()
        .default('all')
        .openapi({
            param: {
                in: 'query',
                name: 'published',
            },
        }),
}).strict();

// Response schemas for OpenAPI docs
export const blogResponseSchema = z.object({
    id: z.number(),
    title: z.string(),
    slug: z.string(),
    content: z.string(),
    excerpt: z.string().nullable(),
    thumbnailUrl: z.string(),
    isPublished: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const blogListResponseSchema = z.object({
    pageInfo: z.object({
        currentPage: z.number(),
        pageSize: z.number(),
        totalItems: z.number(),
        totalPages: z.number(),
        hasNextPage: z.boolean(),
        hasPreviousPage: z.boolean(),
        nextPage: z.number().nullable(),
        previousPage: z.number().nullable(),
    }),
    data: z.array(blogResponseSchema),
});

export type CreateBlog = z.infer<typeof createBlogSchema>;
export type UpdateBlog = z.infer<typeof updateBlogSchema>;
export type BlogPagination = z.infer<typeof blogPaginationSchema>;
