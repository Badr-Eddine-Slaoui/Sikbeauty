
import { Router }                   from 'express';

import { retrieveProduct }          from '../controllers/products.controller';
import { tryCatch }                 from '../middlewares/tryCatch.middleware';
import { validatorParam, 
    validatorQuery }                from '../middlewares/validator.middleware';
import { verifyPermission }         from '../middlewares/verifyPermission.middleware';
import { verifyToken }              from '../middlewares/verifyToken.middleware';
import { productPagination }        from '../schemas/products.schema';
import { requestById }              from '../utils/schemas.util';

import { allProductUsingPagination } from '../controllers/products.controller';

const router = Router();

// get all product using pagination + search title

router.get('/', // verifyToken,
    // verifyPermission( [/*'Professional',*/ 'Individual', 'admin'] ),
    validatorQuery( productPagination ),
    tryCatch( allProductUsingPagination ),
); 

// Retrieve product By ID 
router.get('/:id', 
    // verifyToken,
    // verifyPermission( [/*'Professional',*/ 'Individual', 'admin'] ),
    validatorParam( requestById ),
    tryCatch( retrieveProduct ),
);
export default router;