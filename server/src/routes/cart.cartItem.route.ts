
import { Router }           from 'express';

import { deleteCartItem, 
    incrementDecrementQuantity, 
    newCartItem, 
    retrieveCart, 
    updateQuantity, 
}                           from '../controllers/cart.cartItem.controller';
import { tryCatch }         from '../middlewares/tryCatch.middleware';
import { validatorBody, 
    validatorParam }        from '../middlewares/validator.middleware';
import { verifyToken }      from '../middlewares/verifyToken.middleware';
import { bodyCatItem, 
    incrementDecrementSchema, 
    quantity,
}                           from '../schemas/cart.cartItem.schema';
import { requestById }      from '../utils/schemas.util';


const router = Router();

// Add item to cart
router.post('/', 
    verifyToken,
    validatorBody( bodyCatItem ),
    tryCatch( newCartItem ),
);

// Update item
router.patch('/:id', 
    verifyToken,
    validatorParam( requestById ),
    validatorBody( incrementDecrementSchema ),
    tryCatch( incrementDecrementQuantity ),
);

// Update quantity
router.put('/:id', 
    verifyToken,
    validatorParam( requestById ),
    validatorBody( quantity ),
    tryCatch( updateQuantity ),
);

// Retrieve all cart items
router.get('/', 
    verifyToken,
    tryCatch( retrieveCart ),
);

// Delete cart item
router.delete('/:id', 
    verifyToken,
    validatorParam( requestById ),
    tryCatch( deleteCartItem ),
);

export default router;