
import prisma               from '../db/setup';
import { Prisma }           from '@prisma/client';
import { DiscountType, 
    Role, 
    User }                  from '../types';
import { AddNewItemToCart, 
    QuantityValidator }     from '../types/interfaces';
import { AppError }         from '../utils/AppErros';
import { getProductUsingId } from './products.service';
import { EUR, 
    MAD }                   from '../utils';
// import 
export const getOrCreateCart = async ( user : User ) => (
    await prisma.cart.upsert({
        where : {
            userId : user.id,
        },
        update : {},
        create : {
            userId          :   user.id,
            // exchangeRate    :   user.currency === "USD" ? 1 : user.currency === "MAD" ? MAD : EUR,
            // currency        :   user.currency
        },  
    })
);

export const countItemInCart = async ( cartId : number ) => (
    await prisma.cartItem.count({
        where : {
            cartId,
        }
    })
);

export const getCartByUserId = async ( userId : number ) => (
    await prisma.cart.findUnique({
        where : {
            userId : userId,
        },
        select : {
            id : true,
            items : true,
        },
    })
);

// CHECK PRODUCT ITEM EXIST IN CART OR NOT
export const findCartItem = async ( productId : number, cartId : number ) => (
    await prisma.cartItem.findUnique({
        where : {
            cartId_productId : {
                productId,
                cartId,
            },
        },
    })
);

export const findItemById = async ( itemId : number ) => {
    const item = await prisma.cartItem.findUnique({
        where : {
            id : itemId,
        },
        include : {
            product : {
                select : {
                    id          :   true,
                    // stock       :   true,
                    // minQuantity :   true,
                },
            },
        },
    });

    if ( item === null ) 
        throw new AppError('Item not found', 404);
    return item;
};

export const changeCartItemQuantity = async ( itemId : number, 
    quantity : number,
    itemQuantity : number) => {
    const updateItem = await prisma.cartItem.update({
        where : {
            id : itemId,
        },
        data : {
            quantity : itemQuantity + quantity,
        },
    });
    return updateItem;
};

// export const decrementCartItemQuantity = async ( itemId : number ) => {
//     const item = await findItemById( itemId );

//     if ( item.quantity === 1 ) return item;
//     const updateItem = await prisma.cartItem.update({
//         where : {
//             id : itemId,
//         },
//         data : {
//             quantity : item.quantity - 1,
//         },
//     });
//     return updateItem;
// };



export const addNewItem = async ( itemCart : AddNewItemToCart ) => {
    const product = await getProductUsingId( itemCart.productId, 'user' );
    // const price = itemCart.role === 'Individual' ? product.priceIndividual : product.priceProfessional;
    const item : {
        // price       :   number,
        // unitPrice   :   number,
        // discount    :   number,
        productId   :   number,
        cartId      :   number,
        quantity    :   number,
        // discountType :  DiscountType | null,
        // discount     :  number ,
        // unitPrice    :  number

    } = {
        productId       :   itemCart.productId,
        cartId          :   itemCart.cartId,
        // discountType    :   product.discountType,
        // discount        :   product.discount || 0, 
        // unitPrice       :   product.price,
        // price,
        // unitPrice  :   price * (1 - (product.discountPercentage || 0) / 100),
        // discount    :   product.discountPercentage || 0,
        quantity    :   itemCart.quantity,
    };
    const newItem = await prisma.cartItem.create({
        data : item,
    });
    return newItem;
};

export const retrieveCartInfo = async ( user : User ) => {
    const cartInfo = await prisma.user.findUnique({
        where : {
            id : user.id,
        },
        select : {
            carts : true,
        },
    });
    if ( !cartInfo?.carts ) {
        const cart = await getOrCreateCart( user );
        return {
            cartId  :   cart.id,
            items   :   [],
            total   :   0,
        };
    }
    
    const items = await prisma.cartItem.findMany({
        where : {
            cartId : cartInfo.carts?.id,
        },
        select : {
            id          :   true,
            product     :   {
                select : {
                    id              :   true,
                    title           :   true,
                    thumbnailUrl    :   true,
                    status          :   true,
                    price           :   true,
                    discount : true,
                    discountType : true,
                },
            },
            quantity    :   true,
        },
    });
    
    let total = 0;
    const result = items.map( ( item ) => {
        let discount = 0;
        if (item.product.discountType === 'PRICE') {
            discount = Math.min( item.product.discount || 0, item.product.price );
        } else if (item.product.discountType === 'PERCENT') {
            discount = Math.floor((item.product.price * (item.product.discount || 0)) / 100);
        }

        const finalPrice = item.product.price - discount;
        total += finalPrice * item.quantity

        return {
            id : item.id,
            product : {
                id              :   item.product.id,
                title           :   item.product.title,
                status          :   item.product.status,
                thumbnailUrl    :   item.product.thumbnailUrl,
                price           :   ( item.product.price / 100 ).toFixed( 2 ) ,
                discount        :   item.product.discountType === "PRICE"? ( ( item.product.discount || 0 ) / 100 ).toFixed( 2 ) : item.product.discount,
                unitPrice       :  ( finalPrice / 100 ).toFixed( 2 ) ,
                discountType    :   item.product.discountType
            },
            quantity    : item.quantity,
        };
    });
    return {
        cartId : cartInfo.carts?.id,
        // currency : cartInfo.carts.currency,
        items: result,
        total : ( total / 100 ).toFixed( 2 ),
    };
};

// export const quantityValidator = async ( quantity : QuantityValidator ) => {

//     // if ( quantity.stock < quantity.quantity + quantity.newQuantity ) {
//     //     throw new AppError( `Only ${ quantity.stock } units are available for this product`, 400);
//     // };
//     // console.error( quantity.quantity , quantity.newQuantity, quantity.minQuantity )
//     if ( quantity.role === "Professional" && quantity.quantity + quantity.newQuantity < quantity.minQuantity ) {
//         throw new AppError( `You must add at least ${quantity.minQuantity} units of this product`, 400);
//     };
// };

export const updateQuantityItem = async ( quantity : number, itemId : number ) => {
    await prisma.cartItem.update({
        where : {
            id : itemId,
        },
        data : {
            quantity,
        },
    });
};

export const deleteItem = async ( id : number ) => {
    await prisma.cartItem.delete({
        where : {
            id,
        },
    });
};

export const getItemsData = async ( cartId : number ) => await prisma.cartItem.findMany({
    where : {
        cartId : cartId,
    },
    select : {
        id          :   true,
        productId   :   true,
        quantity    :   true,
        // price       :   true,
        // discount    :   true,
        // unitPrice  :   true,
    },
});