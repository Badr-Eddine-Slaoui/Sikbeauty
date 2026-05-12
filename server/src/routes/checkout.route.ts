import { Router  }                  from 'express';

import { resolveCheckoutConflict, 
    validateCartBeforeCreateOrder } from '../controllers/checkout.controller';
import { tryCatch }                 from '../middlewares/tryCatch.middleware';
import { validatorBody }            from '../middlewares/validator.middleware';
import { verifyPermission }         from '../middlewares/verifyPermission.middleware';
import { verifyToken }              from '../middlewares/verifyToken.middleware';
import { checkoutItems }            from '../schemas/checkout.schema';
import { permissionRoles }          from '../utils';

const route = Router();

// validate cart
route.post('/',
verifyToken,
verifyPermission( permissionRoles ),
tryCatch( validateCartBeforeCreateOrder ),
);
// resolve checkout if conflict in cart

route.post('/accept',
    verifyToken,
    verifyPermission( permissionRoles ),
    validatorBody( checkoutItems ),
    tryCatch( resolveCheckoutConflict ),
);

export default route; 