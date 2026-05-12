import prisma from '../db/setup';

// Get total users count by role
export const getUsersStatistics = async () => {
    const totalUsers = await prisma.user.count();
    const individualUsers = await prisma.user.count({
        where: { role: 'Individual' }
    });
    const adminUsers = await prisma.user.count({
        where: { role: 'admin' }
    });

    return {
        totalUsers,
        individualUsers,
        adminUsers,
    };
};

// Get products statistics
export const getProductsStatistics = async () => {
    const totalProducts = await prisma.product.count();
    const activeProducts = await prisma.product.count({
        where: { status: true }
    });
    const inactiveProducts = await prisma.product.count({
        where: { status: false }
    });

    // Get products by category
    const productsByCategory = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    products: true
                }
            }
        },
        where: {
            isActive: true
        }
    });

    return {
        totalProducts,
        activeProducts,
        inactiveProducts,
        productsByCategory: productsByCategory.map(cat => ({
            categoryId: cat.id,
            categoryName: cat.name,
            productCount: cat._count.products
        }))
    };
};

// Get orders statistics
export const getOrdersStatistics = async () => {
    const totalOrders = await prisma.order.count();
    
    const ordersByStatus = await prisma.order.groupBy({
        by: ['status'],
        _count: {
            status: true
        }
    });

    // Calculate total revenue (sum of all order totalPrice)
    const revenueData = await prisma.order.aggregate({
        _sum: {
            totalPrice: true
        },
        where: {
            status: 'PAID'
        }
    });

    // Get orders by status for easy access
    const pendingOrders = ordersByStatus.find(o => o.status === 'PENDING')?._count.status || 0;
    const paidOrders = ordersByStatus.find(o => o.status === 'PAID')?._count.status || 0;
    const deliveredOrders = ordersByStatus.find(o => o.status === 'DELIVERED')?._count.status || 0;
    const cancelledOrders = ordersByStatus.find(o => o.status === 'CANCELLED')?._count.status || 0;

    // Calculate average order value
    const averageOrderValue = paidOrders > 0 
        ? (revenueData._sum.totalPrice || 0) / paidOrders 
        : 0;

    return {
        totalOrders,
        pendingOrders,
        paidOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: revenueData._sum.totalPrice || 0,
        averageOrderValue: Math.round(averageOrderValue),
        ordersByStatus: ordersByStatus.map(o => ({
            status: o.status,
            count: o._count.status
        }))
    };
};

// Get categories statistics
export const getCategoriesStatistics = async () => {
    const totalCategories = await prisma.category.count();
    const activeCategories = await prisma.category.count({
        where: { isActive: true }
    });
    const inactiveCategories = await prisma.category.count({
        where: { isActive: false }
    });

    return {
        totalCategories,
        activeCategories,
        inactiveCategories
    };
};

// Get blogs statistics
export const getBlogsStatistics = async () => {
    const totalBlogs = await prisma.blog.count();
    const publishedBlogs = await prisma.blog.count({
        where: { isPublished: true }
    });
    const draftBlogs = await prisma.blog.count({
        where: { isPublished: false }
    });

    return {
        totalBlogs,
        publishedBlogs,
        draftBlogs
    };
};

// Get recent activities (last 10 orders)
export const getRecentActivities = async () => {
    const recentOrders = await prisma.order.findMany({
        take: 10,
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            status: true,
            createdAt: true,
            user: {
                select: {
                    fullName: true,
                    email: true
                }
            }
        }
    });

    return recentOrders.map(order => ({
        orderId: order.id,
        status: order.status,
        userName: order.user.fullName,
        userEmail: order.user.email,
        createdAt: order.createdAt
    }));
};

// Get top selling products based on number of orders
export const getTopSellingProducts = async (limit: number = 5) => {
    const topProducts = await prisma.orderItem.groupBy({
        by: ['productId'],
        _count: {
            orderId: true
        },
        _sum: {
            quantity: true,
            unitPrice: true
        },
        orderBy: {
            _count: {
                orderId: 'desc'
            }
        },
        take: limit
    });

    // Get product details for top selling products
    const productIds = topProducts.map(p => p.productId);
    const products = await prisma.product.findMany({
        where: {
            id: { in: productIds }
        },
        select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            category: {
                select: {
                    name: true
                }
            }
        }
    });

    // Merge data
    return topProducts.map(tp => {
        const product = products.find(p => p.id === tp.productId);
        return {
            productId: tp.productId,
            productTitle: product?.title || 'Unknown',
            categoryName: product?.category.name || 'Unknown',
            thumbnailUrl: product?.thumbnailUrl || null,
            orderCount: tp._count.orderId || 0,
            totalQuantitySold: tp._sum.quantity || 0,
            totalRevenue: tp._sum.unitPrice || 0
        };
    });
};

// Get payment statistics
export const getPaymentStatistics = async () => {
    const totalPayments = await prisma.payment.count();
    
    const paymentsByStatus = await prisma.payment.groupBy({
        by: ['status'],
        _count: {
            status: true
        }
    });

    const successfulPayments = paymentsByStatus.find(p => p.status === 'SUCCEEDED')?._count.status || 0;
    const pendingPayments = paymentsByStatus.find(p => p.status === 'PENDING')?._count.status || 0;
    const failedPayments = paymentsByStatus.find(p => p.status === 'FAILED')?._count.status || 0;

    return {
        totalPayments,
        successfulPayments,
        pendingPayments,
        failedPayments,
        paymentsByStatus: paymentsByStatus.map(p => ({
            status: p.status,
            count: p._count.status
        }))
    };
};

// Get comprehensive dashboard statistics
export const getDashboardStatistics = async () => {
    const [
        users,
        products,
        orders,
        categories,
        blogs,
        recentActivities,
        topSellingProducts,
        payments
    ] = await Promise.all([
        getUsersStatistics(),
        getProductsStatistics(),
        getOrdersStatistics(),
        getCategoriesStatistics(),
        getBlogsStatistics(),
        getRecentActivities(),
        getTopSellingProducts(5),
        getPaymentStatistics()
    ]);

    return {
        users,
        products,
        orders,
        categories,
        blogs,
        recentActivities,
        topSellingProducts,
        payments,
        generatedAt: new Date()
    };
};
