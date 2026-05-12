import { Router } from 'express';
import * as profileController from '../controllers/user.profile.controller';
import { verifyToken } from '../middlewares/verifyToken.middleware';

const router = Router();

// All routes require authentication
router.use(verifyToken);

// GET /api/v1/user/profile - Get user profile
router.get('/profile', profileController.getProfile);

// GET /api/v1/user/liked-products - Get user's liked products
router.get('/liked-products', profileController.getLikedProducts);

// POST /api/v1/user/liked-products - Add product to liked items
router.post('/liked-products', profileController.addLikedProduct);

// DELETE /api/v1/user/liked-products/:productId - Remove product from liked items
router.delete('/liked-products/:productId', profileController.removeLikedProduct);

// GET /api/v1/user/liked-products/:productId/check - Check if product is liked
router.get('/liked-products/:productId/check', profileController.checkProductLiked);

// GET /api/v1/user/orders - Get user's orders
router.get('/orders', profileController.getOrders);

// GET /api/v1/user/orders/:orderId - Get specific order by ID
router.get('/orders/:orderId', profileController.getOrderById);

export default router;
