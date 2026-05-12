import prisma           from '../db/setup';
import { CartOutDated } from '../types/interfaces';
import { deleteItem }   from './cart.cartItem.service';

export const updateCart = async ( info : CartOutDated, role : string ) => {
    for ( const item of info.cartItems ) {
        const product = info.productMap.get( item.productId );
        if ( !product ) continue;
        if ( product?.status !== true ) {
            await deleteItem( item.id );
        }

                         // //////////////////////////DELETED
        // else if ( role === "Professional" && product.stock < product.minQuantity ) {
        //     await deleteItem( item.id );
        // }
        // else if( item.quantity > product.stock ) {
        //     // if  ( role === "Professional" && product.stock < product.minQuantity )
        //     await prisma.cartItem.update({
        //         where : {
        //             id : item.id
        //         },
        //         data : {
        //             quantity : product.stock
        //         },
        //     });
        // };
                         // //////////////////////////DELETED

    }
};