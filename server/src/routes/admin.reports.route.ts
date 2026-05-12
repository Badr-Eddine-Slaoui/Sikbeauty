import { Router } from 'express';
import * as reportsController from '../controllers/admin.reports.controller';
import { verifyToken } from '../middlewares/verifyToken.middleware';
import { verifyPermission } from '../middlewares/verifyPermission.middleware';

const router = Router();

// GET /api/v1/admin/reports - Get comprehensive reports data
router.get(
    '/',
    verifyToken,
    verifyPermission(['admin']),
    reportsController.getReports
);

export default router;
