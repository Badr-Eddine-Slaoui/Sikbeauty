import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getAllUsersWithOrders, getUserWithOrders, getTotalUsers } from '../services/admin.users.service';

export const getUsers = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const search = req.query.search as string | undefined;

    const users = await getAllUsersWithOrders(page, limit, search);
    const totalUsers = await getTotalUsers(search);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(StatusCodes.OK).json({
        data: users,
        pageInfo: {
            currentPage: page,
            totalPages,
            totalItems: totalUsers,
            itemsPerPage: limit
        }
    });
};

export const getUserOrders = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const user = await getUserWithOrders(userId);
    
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }

    // Format prices from cents to euros
    const formattedUser = {
        ...user,
        orders: user.orders.map(order => ({
            ...order,
            totalPrice: (order.totalPrice / 100).toFixed(2),
            order_items: order.order_items.map(item => ({
                ...item,
                price: (item.price / 100).toFixed(2),
                unitPrice: (item.unitPrice / 100).toFixed(2),
                discount: item.discount ? (item.discountType === 'PRICE' ? (item.discount / 100).toFixed(2) : item.discount.toString()) : null
            }))
        }))
    };

    res.status(StatusCodes.OK).json(formattedUser);
};
