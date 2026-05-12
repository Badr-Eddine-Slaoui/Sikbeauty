import { Router } from 'express';
import { getDashboardStats } from '../controllers/admin.dashboard.controller';
import { tryCatch } from '../middlewares/tryCatch.middleware';
import { verifyToken } from '../middlewares/verifyToken.middleware';
import { verifyPermission } from '../middlewares/verifyPermission.middleware';

const route = Router();

// Get dashboard statistics - admin only
route.get(
    '/',
    verifyToken,
    verifyPermission(['admin']),
    tryCatch(getDashboardStats)
);

export default route;
