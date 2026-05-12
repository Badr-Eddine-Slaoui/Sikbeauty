// #
import { Request, 
    Response }              from 'express';
import { StatusCodes }      from 'http-status-codes';

import { CheckoutItems }    from '../schemas/checkout.schema';
import { 
    getCartByUserId }       from '../services/cart.cartItem.service';
import { updateCart }       from '../services/checkout.service';
import { getProducts }      from '../services/products.service';
import { User }             from '../types';
import { AppError }         from '../utils/AppErros';
import { generateNewCart, 
    validateCart }          from '../services/order.orderItem.service';
// delete item if user click in accept 

// chceck cart conflict 
export const validateCartBeforeCreateOrder = async ( req : Request, res : Response ) => {
    // user
    const user = req.user as User;

    const cart = await getCartByUserId( user.id );
    // Check cart is empty or not 
    if ( !cart || cart.items.length === 0 )
        throw new AppError( 'Cart is empty', 400 );
    // validate cart
    const message = await validateCart( user.id);
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
    res.status( StatusCodes.OK ).json({
        status  :   'success',
        message :   'Cart is valid',
    });
};

export const resolveCheckoutConflict = async ( req : Request, res : Response ) => {
    // user
    const user = req.user as User;
    // body 
    const body = req.body as CheckoutItems;

    // Check clinet accept modifecation cart or not 
    if ( body.accept === false ) {
        res.status( StatusCodes.OK ).json( {
            status  :   'checkout_cancelled',
            message :   'Checkout canceled. Some items have changed. Please update your cart',
        } );
        return;
    };
    // Get cart data 
    const cart = await getCartByUserId( user.id );
    // Check cart is empty 
    if ( !cart || cart.items.length === 0 )
        throw new AppError( 'Cart is empty', 400 );
    // Generate array of products 
    // let itemIds : number[]= []
    const productIds = cart.items.map( ( item ) => 
        // itemIds.push( item.id );
        item.productId, 
    );
    // console.error( productIds );
    // Retrieve all product using array product ids
    
    const products = await getProducts( productIds );
    // Map pair productId and productInfo for simple retrive productInfo using productId key
    const productMap = new Map( products.map( ( product ) => [ product.id, product ] ) );
    await updateCart( {
        cartId      : cart.id,
        cartItems   : cart.items,
        productMap,
    }, user.role );
    // Generate cart for create orders
    // const newCart  = await generateNewCart( {
    //     cartId      : cart.id,
    //     cartItems   : cart.items,
    //     productMap,
    // }, user.role );

    // if ( newCart.cartItems.length === 0 ) {
    //     throw new AppError( 'Cart is empty', 400 );
    // };
    // await createOrderItems( { 
    //     id : cart.id ,
    //     items : newCart.cartItems,
    //     total : newCart.total,
    // }, user.id, itemIds );

    res.status( StatusCodes.CREATED ).json({
        status  :   'success',
        message :   'Cart updated successfully',
        // newCart : {
        //     id : cart.id,
        //     ...newCart,
        // },
    });
};

