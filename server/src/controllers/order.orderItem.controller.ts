import { Request, 
    Response }              from 'express';
import { StatusCodes }      from 'http-status-codes';

import { getCartByUserId }  from '../services/cart.cartItem.service';
import { 
    createOrderItems,
    generateNewCart,
    getOrder,
    getOrderById,
    getSearchOrders,
    totalOrders,
    // createOrderItems, 
    validateCart }          from '../services/order.orderItem.service';
import { User }             from '../types';
import { AppError }         from '../utils/AppErros';
import { UserAddress }      from '../schemas/user.address.schema';
import { SearchOrder, 
    WhereOrders }           from '../schemas/order.orderItem.schema';
import { ParamId }          from '../utils/schemas.util';
// import prisma               from "../db/setup";


export const newOrder = async ( req : Request, res : Response ) => {
    // User id
    const user = req.user as User;
    // userAddress
    const address = req.body as UserAddress
    // Retrieve cart info 
    const cart = await getCartByUserId( user.id );
    // Check cart is empty or not 
    if ( !cart || cart.items.length === 0 )
        throw new AppError( 'Cart is empty', 400 );
    // validate cart
    const message = await validateCart( user.id );
    // If cart OutDeted
    // let newCart;
    if ( message.conflict ) {
        const newCartClient = await generateNewCart( {
            cartId : cart.id,
            cartItems : cart.items,
            productMap : message.productMap,
        }, user.role );
        return res.status( StatusCodes.CONFLICT ).json({
            status      :   'REQUIRES_CONFIRMATION',
            message     :   'Some items in your cart have changed',
            conflicts   :   message.messageConflict,
            newCart     :   newCartClient
        });
    };

    // Create new order
    const orderId = await createOrderItems( {
        cartId : cart.id,
        cartItems : cart.items,
        productMap : message.productMap
    },  user.id, address );

    
    res.status( StatusCodes.CREATED ).json({
        status  :   'success',
        message :   'Order created successfully',
        data    :   {
            id  :   orderId
        }
    });
};

export const filterOrder = async ( req : Request, res : Response ) => {
    // filter attrubute 
    let search = req.query as SearchOrder;
    // pagination 
    const page = +search.page;
    const limit = +search.limit;
    const skip = ( page  - 1 ) * limit;

    // convert string field to numbers and prepare where object for filtring data 
    let where : WhereOrders = {
        userId      :   search.userId ? +search.userId : undefined,
        status      :   search.status ? search.status : undefined,
    };

    // get total orders using where object and craete pageInfo 
    const total = await totalOrders( where, search.startDate, search.endDate );
    const totalPage = Math.ceil( total / limit );
    const pageInfo = {
        currentPage     :   page,
        pageSize        :   limit,
        totalItems      :   total,
        totalPages      :   totalPage,
        hasNextPage     :   page <totalPage,
        hasPreviousPage :   page > 1,
        nextPage        :   page <totalPage ? page + 1 : null,
        previousPage    :   page > 1 ? page - 1 : null,
    };
    // filter orders 
    let filterOrderdata = await getSearchOrders( skip, limit, where, search.startDate, search.endDate );
    const ordersResponse = filterOrderdata.map(order => ({
        ...order,
        totalPrice:    (order.totalPrice / 100).toFixed(2),
    }));
    // Return data to admin 
    res.status( StatusCodes.OK ).json({
        pageInfo,
        data        :   ordersResponse,
        // currency    :   user.currency 
    });
};

// retrieve order information by id 
export const retrieveOrderInfo = async ( req : Request, res : Response ) => {
    // param
    const param = req.params as ParamId;
    const user = req.user as User;

    // retrive order info - admin can view any order, users can only view their own
    const order = user.role === 'admin' 
        ? await getOrder( +param.id )
        : await getOrderById( +param.id, req.user.id );
    // check order is exist or not 
    if ( !order ) {
        throw new AppError( 'Order not found', 404 );
    }
    // format order info
     const orderInfo = {
        ...order,
        totalPrice: (order.totalPrice / 100).toFixed(2),
        order_items: order.order_items.map((item: any) => ({
            ...item,
            price: (item.price / 100).toFixed(2),         // original price
            unitPrice: (item.unitPrice / 100).toFixed(2), // after discount
            discount: item.discountType === 'PRICE'
                ? (item.discount / 100).toFixed(2)
                : item.discount,                          // percent discount stays as number
        })),
        orderAddress : order.orderAddress[0],
    };
    
    res.status( StatusCodes.OK ).json( orderInfo );
};


