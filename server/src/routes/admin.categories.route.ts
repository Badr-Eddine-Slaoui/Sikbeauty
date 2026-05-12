
import { Router }               from 'express';

import {
    newCategory, 
    updateCategoryById }        from '../controllers/admin.categories.controller';
import { tryCatch }             from '../middlewares/tryCatch.middleware';
import { validatorBody, 
    validatorParam }            from '../middlewares/validator.middleware';
import { verifyPermission }     from '../middlewares/verifyPermission.middleware';
import { verifyToken }          from '../middlewares/verifyToken.middleware';
import { newCategorySchemas, 
    updateCategorySchemas }     from '../schemas/categories.schema';
import { 
    requestById }               from '../utils/schemas.util';

const router = Router();

// Create new category
router.post( '/', 
    verifyToken, 
    verifyPermission( ['admin'] ),  
    validatorBody( newCategorySchemas ), 
    tryCatch( newCategory ),
);

// Update category by id
router.put( '/:id', 
    verifyToken, 
    verifyPermission( ['admin'] ), 
    validatorParam( requestById ),
    validatorBody( updateCategorySchemas ), 
    tryCatch( updateCategoryById ),
);

export default router;