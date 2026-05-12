import { Request, Response } from 'express';
import * as profileService from '../services/user.profile.service';
import { User } from '../types';

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const profile = await profileService.getUserProfile(userId);

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error: any) {
        console.error('Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch profile'
        });
    }
};

// Get user's liked products
export const getLikedProducts = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const likedProducts = await profileService.getUserLikedProducts(userId);

        res.status(200).json({
            success: true,
            data: likedProducts
        });
    } catch (error: any) {
        console.error('Error fetching liked products:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch liked products'
        });
    }
};

// Add product to liked items
export const addLikedProduct = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const likedProduct = await profileService.addLikedProduct(userId, parseInt(productId));

        res.status(201).json({
            success: true,
            message: 'Product added to liked items',
            data: likedProduct
        });
    } catch (error: any) {
        console.error('Error adding liked product:', error);
        
        if (error.message === 'Product not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        if (error.message === 'Product already liked') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to add product to liked items'
        });
    }
};

// Remove product from liked items
export const removeLikedProduct = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const result = await profileService.removeLikedProduct(userId, parseInt(productId));

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error: any) {
        console.error('Error removing liked product:', error);
        
        if (error.message === 'Liked product not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to remove product from liked items'
        });
    }
};

// Check if product is liked
export const checkProductLiked = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const isLiked = await profileService.isProductLiked(userId, parseInt(productId));

        res.status(200).json({
            success: true,
            data: { isLiked }
        });
    } catch (error: any) {
        console.error('Error checking liked product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check liked product'
        });
    }
};

// Get user's orders
export const getOrders = async (req: Request, res: Response) => {
    try {
        const user = req.user as User;

        if (!user?.id) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const orders = await profileService.getUserOrders(user.id);

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch orders'
        });
    }
};

// Get user's order by ID
export const getOrderById = async (req: Request, res: Response) => {
    try {
        const user = req.user as User;
        const { orderId } = req.params;

        if (!user?.id) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const order = await profileService.getUserOrderById(user.id, parseInt(orderId));

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error: any) {
        console.error('Error fetching order:', error);
        
        if (error.message === 'Order not found') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch order'
        });
    }
};
