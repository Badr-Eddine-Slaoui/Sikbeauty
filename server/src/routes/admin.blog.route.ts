import { Router }               from 'express';

import {
    createBlogController,
    deleteBlogController,
    getAllBlogsController,
    getBlogByIdController,
    updateBlogController,
    updateBlogThumbnailController,
}                               from '../controllers/admin.blog.controller';
import { tryCatch }             from '../middlewares/tryCatch.middleware';
import upload                   from '../middlewares/upload.middleware';
import { 
    validateImage,
    validatorBody, 
    validatorParam,
    validatorQuery,
}                               from '../middlewares/validator.middleware';
import { verifyPermission }     from '../middlewares/verifyPermission.middleware';
import { verifyToken }          from '../middlewares/verifyToken.middleware';
import { 
    blogPaginationSchema,
    createBlogSchema, 
    updateBlogSchema,
}                               from '../schemas/blog.schema';
import { requestById }          from '../utils/schemas.util';

const router = Router();

// Create new blog (Admin only)
router.post('/',
    verifyToken,
    verifyPermission(['admin']),
    upload.single('thumbnail'),
    validateImage,
    validatorBody(createBlogSchema),
    tryCatch(createBlogController),
);

// Get all blogs with pagination (Admin only)
router.get('/',
    verifyToken,
    verifyPermission(['admin']),
    validatorQuery(blogPaginationSchema),
    tryCatch(getAllBlogsController),
);

// Get blog by ID (Admin only)
router.get('/:id',
    verifyToken,
    verifyPermission(['admin']),
    validatorParam(requestById),
    tryCatch(getBlogByIdController),
);

// Update blog info (Admin only)
router.put('/:id',
    verifyToken,
    verifyPermission(['admin']),
    validatorParam(requestById),
    validatorBody(updateBlogSchema),
    tryCatch(updateBlogController),
);

// Update blog thumbnail (Admin only)
router.patch('/:id/thumbnail',
    verifyToken,
    verifyPermission(['admin']),
    validatorParam(requestById),
    upload.single('thumbnail'),
    validateImage,
    tryCatch(updateBlogThumbnailController),
);

// Delete blog (Admin only)
router.delete('/:id',
    verifyToken,
    verifyPermission(['admin']),
    validatorParam(requestById),
    tryCatch(deleteBlogController),
);

export default router;
