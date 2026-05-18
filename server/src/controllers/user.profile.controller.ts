import { Request, Response } from 'express';
import * as profileService from '../services/user.profile.service';
import { User } from '../types';
import { AppError } from '../utils/AppErros';

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
    const user = req.user as User;
    if (!user?.id) throw new AppError('Non autorisé', 401);

    const profile = await profileService.getUserProfile(user.id);

    res.status(200).json({
        status: 'success',
        data: profile
    });
};

// Get user's liked products
export const getLikedProducts = async (req: Request, res: Response) => {
    const user = req.user as User;
    if (!user?.id) throw new AppError('Non autorisé', 401);

    const likedProducts = await profileService.getUserLikedProducts(user.id);

    res.status(200).json({
        status: 'success',
        data: likedProducts
    });
};

// Add product to liked items
export const addLikedProduct = async (req: Request, res: Response) => {
    const user = req.user as User;
    if (!user?.id) throw new AppError('Non autorisé', 401);

    const { productId } = req.body;
    if (!productId) throw new AppError('L\'identifiant du produit est requis', 400);

    try {
        const likedProduct = await profileService.addLikedProduct(user.id, parseInt(productId));

        res.status(201).json({
            status: 'success',
            message: 'Produit ajouté aux favoris',
            data: likedProduct
        });
    } catch (error: any) {
        if (error.message === 'Product not found') {
            throw new AppError('Produit introuvable', 404);
        }
        if (error.message === 'Product already liked') {
            throw new AppError('Ce produit est déjà dans vos favoris', 400);
        }
        throw error;
    }
};

// Remove product from liked items
export const removeLikedProduct = async (req: Request, res: Response) => {
    const user = req.user as User;
    if (!user?.id) throw new AppError('Non autorisé', 401);

    const { productId } = req.params;

    try {
        const result = await profileService.removeLikedProduct(user.id, parseInt(productId));

        res.status(200).json({
            status: 'success',
            message: result.message || 'Produit retiré des favoris'
        });
    } catch (error: any) {
        if (error.message === 'Liked product not found') {
            throw new AppError('Favori introuvable', 404);
        }
        throw error;
    }
};

// Check if product is liked
export const checkProductLiked = async (req: Request, res: Response) => {
    const user = req.user as User;
    if (!user?.id) throw new AppError('Non autorisé', 401);

    const { productId } = req.params;
    const isLiked = await profileService.isProductLiked(user.id, parseInt(productId));

    res.status(200).json({
        status: 'success',
        data: { isLiked }
    });
};

// Get user's orders
export const getOrders = async (req: Request, res: Response) => {
    const user = req.user as User;
    if (!user?.id) throw new AppError('Non autorisé', 401);

    const orders = await profileService.getUserOrders(user.id);

    res.status(200).json({
        status: 'success',
        data: orders
    });
};

// Get user's order by ID
export const getOrderById = async (req: Request, res: Response) => {
    const user = req.user as User;
    if (!user?.id) throw new AppError('Non autorisé', 401);

    const { orderId } = req.params;

    try {
        const order = await profileService.getUserOrderById(user.id, parseInt(orderId));

        res.status(200).json({
            status: 'success',
            data: order
        });
    } catch (error: any) {
        if (error.message === 'Order not found') {
            throw new AppError('Commande introuvable', 404);
        }
        throw error;
    }
};
