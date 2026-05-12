import { Router }               from 'express';

import {
    getBlogBySlugController,
    getLatestBlogsController,
    getPublishedBlogsController,
}                               from '../controllers/admin.blog.controller';
import { tryCatch }             from '../middlewares/tryCatch.middleware';
import { validatorQuery }       from '../middlewares/validator.middleware';
import { blogPaginationSchema } from '../schemas/blog.schema';

const router = Router();

// Get latest blogs for slider (Public)
router.get('/latest',
    tryCatch(getLatestBlogsController),
);

// Get all published blogs with pagination (Public)
router.get('/',
    validatorQuery(blogPaginationSchema),
    tryCatch(getPublishedBlogsController),
);

// Get blog by slug (Public)
router.get('/:slug',
    tryCatch(getBlogBySlugController),
);

export default router;
