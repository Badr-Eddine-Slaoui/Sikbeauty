import { Router }               from 'express';

import { filterOrder, 
    newOrder, 
    retrieveOrderInfo
}                               from '../controllers/order.orderItem.controller';
import { tryCatch }             from '../middlewares/tryCatch.middleware';
import { verifyPermission }     from '../middlewares/verifyPermission.middleware';
import { verifyToken }          from '../middlewares/verifyToken.middleware';
import { permissionRoles }      from '../utils';
import { validatorBody, 

    validatorParam, 

    validatorQuery,  }          from '../middlewares/validator.middleware';
import { userAddressSchema }    from '../schemas/user.address.schema';
import { searchOrderSchema }    from '../schemas/order.orderItem.schema';
import { requestById }          from '../utils/schemas.util';

const route = Router();

route.post('/', 
    verifyToken,
    verifyPermission( permissionRoles ),
    validatorBody( userAddressSchema ),
    tryCatch( newOrder ),
);

// get orders using pagination admin 
route.get('/', 
    verifyToken,
    verifyPermission( ['admin'] ),
    validatorQuery( searchOrderSchema ),
    // validatorBody( userAddressSchema ),
    tryCatch( filterOrder ),
);

//  Retrieve order using id
route.get('/:id', 
    verifyToken,
    verifyPermission( ['admin'] ),
    validatorParam(requestById ),
    // validatorQuery( searchOrderSchema ),
    // validatorBody( userAddressSchema ),
    tryCatch( retrieveOrderInfo ),
);
export default route;