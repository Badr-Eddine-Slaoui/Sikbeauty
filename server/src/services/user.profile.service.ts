import prisma from '../db/setup';
import { Prisma } from '@prisma/client';

// Get user profile information
export const getUserProfile = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            phoneCountryCode: true,
            country: true,
            role: true,
            isEmailVerified: true,
            createdAt: true
        }
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

// Get user's orders
export const getUserOrders = async (userId: number) => {
    const orders = await prisma.order.findMany({
        where: { userId },
        include: {
            order_items: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return orders;
};

// Get user's order by ID
export const getUserOrderById = async (userId: number, orderId: number) => {
    const order = await prisma.order.findFirst({
        where: { 
            id: orderId,
            userId: userId // Ensure user can only access their own orders
        },
        include: {
            order_items: {
                include: {
                    product: {
                        include: {
                            category: true
                        }
                    }
                }
            },
            user: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phoneNumber: true,
                    phoneCountryCode: true
                }
            }
        }
    });

    if (!order) {
        throw new Error('Order not found');
    }

    return order;
};

// Get user's liked products
export const getUserLikedProducts = async (userId: number) => {
    const likedProducts = await prisma.likedProduct.findMany({
        where: { userId },
        include: {
            product: {
                include: {
                    category: {
                        select: {
                            name: true,
                            slug: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return likedProducts.map((lp: any) => ({
        id: lp.id,
        likedAt: lp.createdAt,
        product: {
            id: lp.product.id,
            title: lp.product.title,
            description: lp.product.description,
            price: lp.product.price / 100, // Convert from cents to euros
            discountType: lp.product.discountType,
            discount: lp.product.discount,
            thumbnailUrl: lp.product.thumbnailUrl,
            images: lp.product.images,
            status: lp.product.status,
            category: lp.product.category
        }
    }));
};

// Add product to liked items
export const addLikedProduct = async (userId: number, productId: number) => {
    // Check if product exists
    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!product) {
        throw new Error('Product not found');
    }

    // Check if already liked
    const existingLike = await prisma.likedProduct.findUnique({
        where: {
            userId_productId: {
                userId,
                productId
            }
        }
    });

    if (existingLike) {
        throw new Error('Product already liked');
    }

    // Add to liked products
    const likedProduct = await prisma.likedProduct.create({
        data: {
            userId,
            productId
        },
        include: {
            product: {
                include: {
                    category: true
                }
            }
        }
    });

    return {
        id: likedProduct.id,
        likedAt: likedProduct.createdAt,
        product: {
            id: likedProduct.product.id,
            title: likedProduct.product.title,
            price: likedProduct.product.price / 100,
            thumbnailUrl: likedProduct.product.thumbnailUrl
        }
    };
};

// Remove product from liked items
export const removeLikedProduct = async (userId: number, productId: number) => {
    const likedProduct = await prisma.likedProduct.findUnique({
        where: {
            userId_productId: {
                userId,
                productId
            }
        }
    });

    if (!likedProduct) {
        throw new Error('Liked product not found');
    }

    await prisma.likedProduct.delete({
        where: {
            id: likedProduct.id
        }
    });

    return { message: 'Product removed from liked items' };
};

// Check if product is liked by user
export const isProductLiked = async (userId: number, productId: number) => {
    const likedProduct = await prisma.likedProduct.findUnique({
        where: {
            userId_productId: {
                userId,
                productId
            }
        }
    });

    return !!likedProduct;
};
