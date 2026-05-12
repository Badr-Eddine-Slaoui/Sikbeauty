
import { Order, OrderStatus, PaymentStatus, Prisma }       from '@prisma/client';
import prisma           from '../db/setup';
import { DiscountType, 
    Role }              from '../types';
import { CartOutDated } from '../types/interfaces';
import { AppError }     from '../utils/AppErros';
import {
    getCartByUserId }   from './cart.cartItem.service';
import { getProducts }  from './products.service';
import { UserAddress }  from '../schemas/user.address.schema';
import { SearchOrder, WhereOrders } from '../schemas/order.orderItem.schema';
import { createPaymentRecord, createStripeCheckoutSession } from './payment.service';

interface Item {
    productId       :   number,
    price           :   number ,
    discount        :   number | null ,
    discountType    :   DiscountType | null,
    unitPrice       :   number ,
    quantity        :   number,

}

interface NewOrder {
    total       :   number | string,
    cartItems   :   Item[],
    itemIds     :   number[]
};

const generateConflictItemMessage = ( info : CartOutDated ) => {
    const messageConflict = [];
    for ( const item of info.cartItems ) {
        const product = info.productMap.get( item.productId );
        if ( product?.status !== true ) {
            messageConflict.push( {
                itemId      :   item.id,
                type        :   'PRODUCT_NOT_FOUND',
                oldQuantity :   item.quantity,
                newQuantity :   0,
                message     :   'Product not found',
                product     :   {
                    id          :   product?.id,
                    title       :   product?.title,
                    thumbnailUrl:   product?.thumbnailUrl,
                },
            });
        }
    }
    return messageConflict;
};


export const generateOrderCart = async ( info : CartOutDated , orderId : number) => {
    let cartItems = [];
    let itemIds = []
    let total = 0;
    for ( const item of info.cartItems ) {
        const product = info.productMap.get( item.productId );
        itemIds.push( item.id )
        if ( !product || product?.status !== true ) continue;
        const basePrice = product.price;
        let discount = 0;
        if (product.discountType === 'PRICE') {
            discount = Math.min(product.discount || 0, product.price);
        } else if (product.discountType === 'PERCENT') {
            discount = Math.floor((product.price * (product.discount || 0)) / 100);
        }
        const unitPrice = product.price - discount;
        total += unitPrice * item.quantity
        let itemData : {
                orderId         :   number,
                productId       :   number,
                price           :   number ,
                discount        :   number | undefined ,
                discountType    :   DiscountType | null,
                unitPrice       :   number ,
                quantity        :   number,
        } = {
                orderId             ,
                productId       :   product.id,
                price           :   basePrice,
                unitPrice       :   unitPrice ,
                discount        :   product.discount ?  product.discount : undefined,
                discountType    :   product.discountType,
                quantity        :   item.quantity
        };
        cartItems.push( itemData );
    }
    return {
        cartItems,
        total,
        itemIds,
    };
};

export const generateNewCart = async ( info : CartOutDated, role : string ) => {
    let cartItems = [];
    let total = 0;
    for ( const item of info.cartItems ) {
        const product = info.productMap.get( item.productId );
        if ( !product || product?.status !== true ) continue;
        const basePrice = product.price;
        let discount = 0;
        if (product.discountType === 'PRICE') {
            discount = Math.min(product.discount || 0, product.price);
        } else if (product.discountType === 'PERCENT') {
            discount = Math.floor((product.price * (product.discount || 0)) / 100);
        }
        const unitPrice = product.price - discount;
        total += unitPrice * item.quantity
        let itemData : {
            id            :   number,
            product     : {
                id              :   number,
                title           :   string,
                price           :   string,
                thumbnailUrl?   :   string,
                discount        :   undefined | string,
                discountType    :   DiscountType | null,
                unitPrice       :   string,
            },
            quantity            :   number,
        } = {
            id              :   item.id,
            product : {
                id              :   product.id,
                title           :   product.title,
                price           :   ( basePrice / 100 ).toFixed( 2 ),
                unitPrice       :  ( unitPrice / 100 ).toFixed( 2 ),
                discount        :   product.discountType === "PRICE" ?  ( ( product.discount || 0 ) / 100 ).toFixed( 2 ) : product.discount?.toFixed( 2 ),
                thumbnailUrl    :   product.thumbnailUrl,
                discountType    :   product.discountType,
            },
            quantity        : item.quantity,
        };
        cartItems.push( itemData );
    }
    return {
        cartItems,
        total : ( total / 100 ).toFixed( 2 ),
    };
};

export const validateCart = async ( userId : number ) => {
    // Retrieve cart info 
    const cart = await getCartByUserId( userId );
    // Check cart is empty or not 
    if ( !cart || cart.items.length === 0 )
        throw new AppError( 'Cart is empty', 400 );
    // Generate array of products ids
    const productIds = cart.items.map( ( item ) => {
        return item.productId;
    });
    // Retrieve all products using array product ids
    const products = await getProducts( productIds );
    // Gnerate Map of key product id aand in value product data
    const productMap = new Map( products.map( ( product ) => [ product.id, product ] ) );
    // validate price discont, stock using product and cart item
    const messageConflict = generateConflictItemMessage( {
        cartId      :   cart.id,
        cartItems   :   cart.items,
        productMap,
    });

    // const newCartItem = await generateNewCart( {
    //     cartId : cart.id,
    //     cartItems : cart.items,
    //     productMap,
    // }, role, messageConflict.length !== 0 ? true : false );

    return {
        conflict : messageConflict.length === 0 ? false : true,
        messageConflict,
        // newCart : {
        //     id    : cart.id,
        //     total : newCartItem.total,
        //     items : newCartItem.cartItems,
        // },
        productMap,
    };
};

export const updateOrderStripeSession = async ( session : string, orderId : number ) => {
    await prisma.order.update({
        where : {
            id : orderId,
            status: {
                not: OrderStatus.PAID,
            },
        },
        data : {
            stripeSessionId : session,
        },
    })
};

export const createOrderItems = async ( cart : CartOutDated, 
    userId : number, userAddress : UserAddress ) => {
    let order : Order | undefined;
    await prisma.$transaction(async (prisma) => {
        order = await prisma.order.create({
            data : {
                userId,
                totalPrice : 0,
                orderAddress : {
                    create : {
                        fullName : userAddress.fullName,    
                        email           : userAddress.email,
                        phoneNumber     : userAddress.phoneNumber,
                        phoneCountryCode: userAddress.phoneCountryCode,
                        street          : userAddress.street,
                        city            : userAddress.city,
                        state           : userAddress.state,
                        country         : userAddress.country,
                        postalCode      : userAddress.postalCode,
                    },
                },
            },
        });
        const newCart = await generateOrderCart( cart, order.id );
        await prisma.order.update({
            where : {
                id : order.id,
            },
            data : {
                totalPrice : newCart.total ,
            }
        });
        // userAddress.orderId = order.id
        // create order items
        await prisma.orderItem.createMany({ data: 
            newCart.cartItems,
        });
        // Delete items cart 
        await prisma.cartItem.deleteMany({ where: { id: { in: newCart.itemIds } } });
    });
    if (!order) throw new AppError( "Please retry click checkout", 400 );

    return order.id;
};

export const totalOrders = async ( searchOrder : WhereOrders, 
    startdate : string | undefined, endDate : string | undefined) => (
    await prisma.order.count({
        where : {
            ...searchOrder,
            createdAt: startdate && endDate ?  {
                gte: new Date( startdate ),
                lte: new Date( endDate ),
            } : undefined,
        }
    })
);

export const getSearchOrders = async ( skip :number,
    limit : number,  
    search : WhereOrders,
    startdate : string | undefined, endDate : string | undefined) => (
    await prisma.order.findMany({
        skip,
        take: limit,
        where : {
                ...search,
                createdAt: startdate && endDate ?  {
                    gte: new Date( startdate ),
                    lte: new Date( endDate ),
                } : undefined,
            },
            select: {
                id: true,
                status: true,
                totalPrice: true,
                createdAt: true,
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phoneCountryCode : true,
                    phoneNumber : true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
            // include: { order_items: true, orderAddress: true },
    })
);

export const getOrder = async ( id : number ) => (
    await prisma.order.findUnique({
        where : {
            id,
        },
        include : {
            user: {
                select: {
                    id              : true,
                    fullName        : true,
                    email           : true,
                    phoneCountryCode: true,
                    phoneNumber     : true,
                }
            },
            order_items : {
                select : {
                    id              : true,
                    productId       : true,
                    price           : true,
                    quantity        : true,
                    discount        : true,
                    discountType    : true,
                    unitPrice       : true,
                    product         : {
                        select: {
                            id          : true,
                            title       : true,
                            thumbnailUrl: true,
                        }
                    }
                }
            },
            payment: {
                orderBy: { createdAt: "desc" },
                select: { 
                    id                  : true, 
                    status              : true, 
                    stripeSessionId     : true 
                },
                take: 1,
            },
            orderAddress    :   true
        },
    })
)

export const getOrderById = async ( id : number, userId : number ) => (
    await prisma.order.findUnique({
        where : {
            id,
            userId,
        },
        include : {
            user: {
                select: {
                    id              : true,
                    fullName        : true,
                    email           : true,
                    phoneCountryCode: true,
                    phoneNumber     : true,
                }
            },
            order_items : {
                select : {
                    id              : true,
                    productId       : true,
                    price           : true,
                    quantity        : true,
                    discount        : true,
                    discountType    : true,
                    unitPrice       : true,
                    product         : {
                        select: {
                            id          : true,
                            title       : true,
                            thumbnailUrl: true,
                        }
                    }
                }
            },
            payment: {
                orderBy: { createdAt: "desc" },
                select: { 
                    id                  : true, 
                    status              : true, 
                    stripeSessionId     : true 
                },
                take: 1,
            },
            orderAddress    :   true
        },
    })
);

export const updateOrderPaid = async ( stripeSessionId : string, orderId : number ) => {
    await prisma.order.updateMany({
        where: {
            id: orderId,
            status: {
                not: OrderStatus.PAID,
            },
        },
        data: {
            stripeSessionId,
            status: OrderStatus.PAID,
        },
    });
};