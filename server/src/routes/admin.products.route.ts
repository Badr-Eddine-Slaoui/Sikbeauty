
import { Router  }              from 'express';

import {
    addNewImageVideo,
    deleteImageProduct,
    deleteProductController,
    // getAllProducts,
    newProduct, 
    updateImagePoduct, 
    updateProductInfo,
    updateThumbnail }           from '../controllers/admin.products.controller';
import { tryCatch }             from '../middlewares/tryCatch.middleware';
import upload                   from '../middlewares/upload.middleware';
import {     validateBeforeUpload, 
    validateImage, 
    validatorBody, 
    validatorParam, 
    validatVideoImage, 
    // validatorQuery 
}                               from '../middlewares/validator.middleware';
import { verifyPermission }     from '../middlewares/verifyPermission.middleware';
import { verifyToken }          from '../middlewares/verifyToken.middleware';
import { paramsSchema, 
    updateProductSchemasInfo }  from '../schemas/products.schema';
// import { paginationSchema }     from '../schemas/products.schema';
import { requestById }          from '../utils/schemas.util';

const router = Router();

// // GET ALL PRODUCTS (Admin only)
// router.get( '/', 
//     verifyToken,
//     verifyPermission( ['admin'] ),
//     tryCatch( getAllProducts ),
// );

// you must add some checks in upload !!!!!!!!
// CREATE NEW PRODUCT
router.post( '/',  
    verifyToken, 
    verifyPermission( ['admin'] ),
    upload.fields([
        { name: 'images', maxCount: 5 },
        { name: 'video', maxCount: 1 },
    ]),
    validateBeforeUpload,
    tryCatch( newProduct ),
);

// Update product info
router.put('/:id', 
    verifyToken,
    verifyPermission( ['admin'] ),
    validatorParam( requestById ),
    validatorBody( updateProductSchemasInfo ),
    tryCatch( updateProductInfo ),
);

// Delete product
router.delete('/:id', 
    verifyToken,
    verifyPermission( ['admin'] ),
    validatorParam( requestById ),
    tryCatch( deleteProductController ),
);

// Update product thumbnail 
router.patch('/:id/thumbnail', 
    verifyToken,
    verifyPermission( ['admin'] ),
    validatorParam( requestById ),
    upload.single( 'image' ),
    validateImage,
    tryCatch( updateThumbnail ),
);

// Add new image or video
router.post('/:id/images', 
    verifyToken,
    verifyPermission( ['admin'] ),
    validatorParam( requestById ),
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 },
    ]),
    // upload.single('image'),
    validatVideoImage,
    // validateImage,
    tryCatch( addNewImageVideo ),
);

// Update product image 
router.patch('/:id/images/:imageId', 
    verifyToken,
    verifyPermission( ['admin'] ),
    validatorParam( paramsSchema ),
    upload.single('image'),
    validateImage,
    tryCatch( updateImagePoduct ),
);

// Delete image 
router.delete('/:id/images/:imageId', 
    verifyToken,
    verifyPermission( ['admin'] ),
    validatorParam( paramsSchema ),
    tryCatch( deleteImageProduct ),
);

// router.get( '/:id',  verifyToken,
//     verifyPermission( ['admin'] ),
//     validatorParam(requestById),
//     tryCatch( product ));

export default router;