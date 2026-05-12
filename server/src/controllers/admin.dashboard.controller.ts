import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getDashboardStatistics } from '../services/admin.dashboard.service';

export const getDashboardStats = async (req: Request, res: Response) => {
    const statistics = await getDashboardStatistics();
    
    // Format revenue values from cents to euros
    const formattedStats = {
        ...statistics,
        orders: {
            ...statistics.orders,
            totalRevenue: (statistics.orders.totalRevenue / 100).toFixed(2),
            averageOrderValue: (statistics.orders.averageOrderValue / 100).toFixed(2),
        },
        topSellingProducts: statistics.topSellingProducts.map(product => ({
            ...product,
            totalRevenue: (product.totalRevenue / 100).toFixed(2)
        }))
    };

    res.status(StatusCodes.OK).json(formattedStats);
};
