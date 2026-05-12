
import { Request, 
    Response }                  from 'express';
import { StatusCodes }          from 'http-status-codes';

import { BodyCartItem, 
    IncrementDecrementAction,
    Quantity, 
}                               from '../schemas/cart.cartItem.schema';
import { addNewItem,
    changeCartItemQuantity,
    countItemInCart,
    deleteItem,
    findCartItem, 
    findItemById, 
    getOrCreateCart, 
    // quantityValidator,
    retrieveCartInfo,
    updateQuantityItem }                               from '../services/cart.cartItem.service';
import { getProductUsingId }    from '../services/products.service';
import { User }                 from '../types';
import { AppError }             from '../utils/AppErros';
import { ParamId }              from '../utils/schemas.util';


export const newCartItem = async ( req : Request, res : Response ) => {
    // body 
    const body = req.body as BodyCartItem;
    // user 
    const user = req.user as User;

    // check product exist or not
    console.error( body.productId )
    const product = await getProductUsingId( body.productId, 'user' );
    // Check status of product
    if ( product.status === false ) 
        throw new AppError('Product not found', 404);
    // check user has active cart if not -> create one
    const cart = await getOrCreateCart( user );
    const count = await countItemInCart( cart.id );
    if ( count >= 20 )
        throw new AppError( 'Your cart is full. Please complete your order before adding more items', 409 );
    // check cart user has product id 
    let item = await findCartItem( body.productId, cart.id );
    // create new item and added to cart
    if ( !item ) {
        console.error( 'Create new item ');
            // deleted
        // await quantityValidator( {
        //     // stock       :   product.stock,
        //     role        :   user.role,
        //     quantity    :   0,
        //     newQuantity :   body.quantity,
        //     // minQuantity :   product.minQuantity,
        // });
        item = await addNewItem( { 
            productId   :   body.productId, 
            cartId      :   cart.id, 
            role        :   user.role, 
            quantity    :   body.quantity, 
        });
    }
    //  update item cart
    else {
        console.error( 'Upadate item');
        // deleted
        // await quantityValidator( {
        //     // stock       :   product.stock,
        //     role        :   user.role,
        //     quantity    :   item.quantity,
        //     newQuantity :   body.quantity,
        //     minQuantity :   product.minQuantity,
        // });
        item = await changeCartItemQuantity( item.id, body.quantity, item.quantity );
    }
    const cartInfo = await retrieveCartInfo( user );
    console.error( "hello")
    // return new cart data
    res.status( StatusCodes.OK ).json( {
        'status'    :   'success',
        'message'   :   'Product added to cart suceessfully',
        'data'      :   cartInfo,
    });
};

export const updateQuantity = async ( req : Request, res : Response ) => {
    // param
    const param = req.params as ParamId;
    // body
    const body = req.body as Quantity;
    // user
    const user = req.user as User;
    // Check item is exist
    const item = await findItemById( Number(param.id) );
    // console.log( item.product.id )
    // check product status

    await getProductUsingId( item.productId, "user" );

    await getProductUsingId( item.productId, 'user' );

    // check quantity stock
        // deleted
    // await quantityValidator( {
    //     // stock       :   item.product.stock,
    //     role        :   req.user.role,
    //     quantity    :   0,
    //     newQuantity :   body.quantity,
    //     minQuantity :   item.product.minQuantity,
    // });
    // update number
    await updateQuantityItem( body.quantity, Number( param.id ) );
    // retrieve cart info
    const cartInfo = await retrieveCartInfo( user );
    // return data
    res.status( StatusCodes.OK ).json( {
        'status'    :   'success',
        'message'   :   'Update item quantity successfully',
        'data'      :   cartInfo,
    });
};

export const retrieveCart = async ( req : Request, res : Response ) => {
    // user
    const user = req.user as User;
    // Get all cart info and calculate total 
    res.status( StatusCodes.OK ).json(await retrieveCartInfo( user ));
};

export const incrementDecrementQuantity = async ( req : Request, res : Response ) => {
    // param 
    const id = Number( req.params.id );
    // body 
    const body = req.body as IncrementDecrementAction;
    // user 
    const user = req.user as User;
    // Check item is exist
    const item = await findItemById( id );
    // check product status
    await getProductUsingId( item.productId, 'user' );
    console.error( item );
    if ( body.action === 'decrement' && item.quantity === 1 )
        throw new AppError( 'Quantity cannot be less than 1', 400 );
    // check quantity stock
        // deletd 
    // await quantityValidator( {
    //     // stock       :   item.product.stock,
    //     role        :   req.user.role,
    //     quantity    :   item.quantity,
    //     newQuantity :   body.action === 'decrement' ? -1 : 1,
    //     minQuantity :   item.product.minQuantity,
    // });
    // Update data
    await changeCartItemQuantity( item.id, body.action === 'decrement' ? -1 : 1, item.quantity );
    // retrieve cart info
    const cartInfo = await retrieveCartInfo( user );
    // return data
    res.status( StatusCodes.OK ).json( {
        'status'    :   'success',
        'message'   :   'Update item quantity successfully',
        'data'      :   cartInfo,
    });
};

export const deleteCartItem = async ( req : Request, res : Response ) => {
    // param
    const id = Number( req.params.id );

    // Find item cart
    await findItemById( id );
    // delete item 
    await deleteItem( id );
    res.json({
        status  :   'success',
        message :   'Item deleted successfully',
    });
};