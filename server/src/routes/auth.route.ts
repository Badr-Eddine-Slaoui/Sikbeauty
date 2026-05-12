import { Router }           from 'express';

import { login, 
    logout,
    refreshAccessToken,
    register,
    updatePassword }        from '../controllers/auth.controller';
import { tryCatch }         from '../middlewares/tryCatch.middleware';
import { validatorBody }    from '../middlewares/validator.middleware';
import { verifyToken } from '../middlewares/verifyToken.middleware';
import { loginSchema, 
    registerSchemas,
    updatePasswordSchema }  from '../schemas/auth.schema';

const router = Router();

// Public routes
router.post('/register', validatorBody( registerSchemas ), tryCatch( register ) );
router.post('/login', validatorBody( loginSchema ), tryCatch( login ) );
router.post('/refresh', tryCatch( refreshAccessToken ) ); // Refresh access token using refresh token cookie
router.post('/logout', tryCatch( logout ) );

// Protected routes (require access token)
router.post('/update-password', verifyToken, validatorBody( updatePasswordSchema ), tryCatch( updatePassword ) );

export default router;