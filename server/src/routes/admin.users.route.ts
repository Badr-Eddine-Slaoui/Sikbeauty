import { Router } from 'express';
import { getUsers, getUserOrders } from '../controllers/admin.users.controller';
import { tryCatch } from '../middlewares/tryCatch.middleware';
import { verifyToken } from '../middlewares/verifyToken.middleware';
import { verifyPermission } from '../middlewares/verifyPermission.middleware';

const route = Router();

// Get all users (excluding admins) - admin only
route.get(
    '/',
    verifyToken,
    verifyPermission(['admin']),
    tryCatch(getUsers)
);

// Get user with all their orders - admin only
route.get(
    '/:userId/orders',
    verifyToken,
    verifyPermission(['admin']),
    tryCatch(getUserOrders)
);

export default route;
