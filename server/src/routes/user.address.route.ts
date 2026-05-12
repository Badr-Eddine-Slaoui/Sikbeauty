import { Router }           from 'express';

import { addressInformation, 
    allAddress, 
    craeteNewAddress, 
    deleteAddress, 
    updateAddress }          from '../controllers/user.address.controller';
import { tryCatch }         from '../middlewares/tryCatch.middleware';
import { validatorBody, 
    validatorParam }        from '../middlewares/validator.middleware';
import { verifyPermission } from '../middlewares/verifyPermission.middleware';
import { verifyToken }      from '../middlewares/verifyToken.middleware';
import { upadateUserAddressSchema, 
    userAddressSchema }     from '../schemas/user.address.schema';
import { requestById }      from '../utils/schemas.util';

const router = Router();

// Create new adress
router.post('/', 
    verifyToken,
    verifyPermission( ['Professional', 'Individual', 'admin'] ),
    validatorBody( userAddressSchema ),
    tryCatch( craeteNewAddress ),
);

// Update address 
router.put('/:id', 
    verifyToken,
    verifyPermission( ['Professional', 'Individual', 'admin'] ),
    validatorParam( requestById ),
    validatorBody( upadateUserAddressSchema ),
    tryCatch( updateAddress ),
);

// Delete address
router.delete('/:id', 
    verifyToken,
    verifyPermission( ['Professional', 'Individual', 'admin'] ),
    validatorParam( requestById ),
    tryCatch( deleteAddress ),
);

// Get all address of user
router.get('/', 
    verifyToken,
    verifyPermission( ['Professional', 'Individual', 'admin'] ),
    tryCatch( allAddress ),
);

// Retrieve the address information
router.get('/:id', 
    verifyToken,
    verifyPermission( ['Professional', 'Individual', 'admin'] ),
    validatorParam( requestById ),
    tryCatch( addressInformation ),
);
export default router;