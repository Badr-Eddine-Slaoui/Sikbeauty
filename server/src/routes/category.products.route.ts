
import { Router  }              from 'express';

import { allCategories, 
    getProducts }               from '../controllers/category.products.controller';
// import { allProductUsingPagination } from '../controllers/products.controller';
import { tryCatch }             from '../middlewares/tryCatch.middleware';
import { validatorParam, 
    validatorQuery }            from '../middlewares/validator.middleware';
import { verifyPermission }     from '../middlewares/verifyPermission.middleware';
import { verifyToken }          from '../middlewares/verifyToken.middleware';
import { filterCategories }     from '../schemas/categories.schema';
import { paginationSchema }     from '../schemas/products.schema';
import { permissionRoles }      from '../utils';
import { requestById }          from '../utils/schemas.util';

const router = Router();

// get all categories using filter
router.get('/',
    // verifyToken, 
    // verifyPermission( permissionRoles ),
    validatorQuery( filterCategories ),
    tryCatch( allCategories ),
); 

// Get products using category id 
router.get('/:id/products',
    // verifyToken, 
    // verifyPermission( ['admin'] ),
    // verifyPermission( permissionRoles ),
    validatorParam( requestById ),
    validatorQuery( paginationSchema ),
    tryCatch( getProducts ),
);

// all product using pagination
// router.get('/:id', verifyToken,
//     verifyPermission( ['Professional', 'Individual', 'admin'] ),
//     validatorParam( requestById ),
//     validatorQuery( paginationSchema ),
//     tryCatch( allProductUsingPagination ),
// );

export default router;