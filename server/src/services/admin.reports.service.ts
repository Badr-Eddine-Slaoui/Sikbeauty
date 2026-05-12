import prisma from '../db/setup';

// Get monthly purchases and orders data for the last 12 months
export const getMonthlyPurchasesAndOrders = async () => {
    const currentDate = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(currentDate.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    // Get all orders from the last 12 months
    const orders = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: twelveMonthsAgo
            }
        },
        select: {
            id: true,
            totalPrice: true,
            createdAt: true,
            status: true
        }
    });

    // Group by month
    const monthlyData: { [key: string]: { totalPurchases: number; orderCount: number; month: string; year: number } } = {};

    orders.forEach(order => {
        const date = new Date(order.createdAt);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = {
                month: date.toLocaleString('fr-FR', { month: 'long' }),
                year: date.getFullYear(),
                totalPurchases: 0,
                orderCount: 0
            };
        }

        // Only count paid and delivered orders for revenue
        if (order.status === 'PAID' || order.status === 'DELIVERED') {
            monthlyData[monthYear].totalPurchases += order.totalPrice;
        }
        monthlyData[monthYear].orderCount += 1;
    });

    // Convert to array and sort by date
    const result = Object.keys(monthlyData)
        .sort()
        .map(key => ({
            ...monthlyData[key],
            totalPurchases: monthlyData[key].totalPurchases / 100, // Convert from cents to dollars/euros
            monthYear: key
        }));

    return result;
};

// Get best selling products with detailed stats
export const getBestSellingProducts = async (limit: number = 10) => {
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
            _sum: {
                quantity: 'desc'
            }
        },
        take: limit
    });

    // Get product details
    const productIds = topProducts.map(p => p.productId);
    const products = await prisma.product.findMany({
        where: {
            id: { in: productIds }
        },
        select: {
            id: true,
            title: true,
            thumbnailUrl: true,
            price: true,
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
            categoryName: product?.category?.name || 'Unknown',
            thumbnailUrl: product?.thumbnailUrl || null,
            price: product?.price ? product.price / 100 : 0,
            orderCount: tp._count.orderId || 0,
            totalQuantitySold: tp._sum.quantity || 0,
            totalRevenue: tp._sum.unitPrice ? tp._sum.unitPrice / 100 : 0
        };
    });
};

// Get monthly user count by country (new users registered each month)
export const getMonthlyUsersByCountry = async () => {
    const currentDate = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(currentDate.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    // Get all users created in the last 12 months
    const users = await prisma.user.findMany({
        where: {
            createdAt: {
                gte: twelveMonthsAgo
            },
            role: {
                not: 'admin' // Exclude admin users
            }
        },
        select: {
            id: true,
            country: true,
            createdAt: true
        }
    });

    // Group by month and country
    const monthlyData: { [key: string]: any } = {};
    const countriesSet = new Set<string>();

    users.forEach(user => {
        const date = new Date(user.createdAt);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const country = user.country || 'Unknown';
        
        countriesSet.add(country);
        
        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = {
                month: date.toLocaleString('fr-FR', { month: 'long' }),
                year: date.getFullYear()
            };
        }

        // Count users per country per month
        if (!monthlyData[monthYear][country]) {
            monthlyData[monthYear][country] = 0;
        }
        monthlyData[monthYear][country] += 1;
    });

    // Convert to array and sort by date
    const countries = Array.from(countriesSet);
    const result = Object.keys(monthlyData)
        .sort()
        .map(key => {
            const monthData: any = {
                ...monthlyData[key],
                monthYear: key
            };
            
            // Ensure all countries have a value for each month (0 if no new users)
            countries.forEach(country => {
                if (!monthData[country]) {
                    monthData[country] = 0;
                }
            });
            
            return monthData;
        });

    return { data: result, countries };
};

// Get comprehensive reports data
export const getReportsData = async () => {
    const [
        monthlyPurchasesAndOrders,
        bestSellingProducts,
        monthlyUsersByCountry
    ] = await Promise.all([
        getMonthlyPurchasesAndOrders(),
        getBestSellingProducts(10),
        getMonthlyUsersByCountry()
    ]);

    // Calculate summary statistics
    const totalRevenue = monthlyPurchasesAndOrders.reduce((sum, month) => sum + month.totalPurchases, 0);
    const totalOrders = monthlyPurchasesAndOrders.reduce((sum, month) => sum + month.orderCount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get current month vs previous month
    const currentMonthData = monthlyPurchasesAndOrders[monthlyPurchasesAndOrders.length - 1];
    const previousMonthData = monthlyPurchasesAndOrders[monthlyPurchasesAndOrders.length - 2];
    
    const revenueGrowth = previousMonthData && previousMonthData.totalPurchases > 0
        ? ((currentMonthData.totalPurchases - previousMonthData.totalPurchases) / previousMonthData.totalPurchases) * 100
        : 0;

    const ordersGrowth = previousMonthData && previousMonthData.orderCount > 0
        ? ((currentMonthData.orderCount - previousMonthData.orderCount) / previousMonthData.orderCount) * 100
        : 0;

    return {
        monthlyPurchasesAndOrders,
        bestSellingProducts,
        monthlyUsersByCountry: monthlyUsersByCountry.data,
        countries: monthlyUsersByCountry.countries,
        summary: {
            totalRevenue,
            totalOrders,
            averageOrderValue,
            currentMonthRevenue: currentMonthData?.totalPurchases || 0,
            currentMonthOrders: currentMonthData?.orderCount || 0,
            revenueGrowth,
            ordersGrowth
        },
        generatedAt: new Date()
    };
};
