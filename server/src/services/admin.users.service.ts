import prisma from '../db/setup';

// Get total count of users (excluding admins) with optional search
export const getTotalUsers = async (search?: string) => {
    return await prisma.user.count({
        where: {
            role: {
                not: 'admin'
            },
            ...(search ? {
                OR: [
                    { fullName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { country: { contains: search, mode: 'insensitive' } }
                ]
            } : {})
        }
    });
};

// Get all users (excluding admins) with their order counts - with pagination and search
export const getAllUsersWithOrders = async (page: number = 1, limit: number = 5, search?: string) => {
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
        skip,
        take: limit,
        where: {
            role: {
                not: 'admin'
            },
            ...(search ? {
                OR: [
                    { fullName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { country: { contains: search, mode: 'insensitive' } }
                ]
            } : {})
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            phoneCountryCode: true,
            country: true,
            role: true,
            createdAt: true,
            _count: {
                select: {
                    orders: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return users.map(user => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        phoneCountryCode: user.phoneCountryCode,
        country: user.country,
        role: user.role,
        orderCount: user._count.orders,
        createdAt: user.createdAt
    }));
};

// Get user details with all their orders
export const getUserWithOrders = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            phoneCountryCode: true,
            country: true,
            role: true,
            createdAt: true,
            orders: {
                select: {
                    id: true,
                    status: true,
                    totalPrice: true,
                    createdAt: true,
                    orderAddress: {
                        select: {
                            fullName: true,
                            street: true,
                            city: true,
                            state: true,
                            country: true,
                            postalCode: true
                        }
                    },
                    order_items: {
                        select: {
                            id: true,
                            quantity: true,
                            price: true,
                            unitPrice: true,
                            discount: true,
                            discountType: true,
                            product: {
                                select: {
                                    id: true,
                                    title: true,
                                    thumbnailUrl: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    return user;
};
