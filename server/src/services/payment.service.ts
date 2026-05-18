import { OrderStatus, PaymentStatus }    from "@prisma/client";
import prisma               from "../db/setup";
import stripe               from "../lib/stripe";
import { InformationOrder } from "../schemas/order.orderItem.schema";
import { getProducts }      from "./products.service";
import {  updateOrderPaid } from "./order.orderItem.service";



export const createStripeCheckoutSession = async ( orderInfo : InformationOrder
    /*orderId : number*/, userId : number ) => {
      // get order info 
    // check session is exipred or not if not exipred returned to client
    if ( orderInfo.stripeSessionId ) {
        let session = await stripe.checkout.sessions.retrieve( orderInfo.stripeSessionId );
        if ( session.status !== "expired" && session.status !== "complete" ) {
            return {
                session,
                reused : true,
            }
        }
    }
    // get products name 
    const prosuctIds    =   orderInfo.order_items.map( item => item.productId );
    const productsName  =   await getProducts( prosuctIds );
    const productNameMap = new Map(
      productsName.map(product => [product.id, product.title])
    );
    // ITEMS 
    const line_items = orderInfo.order_items.map(item => {
      const productName = productNameMap.get(item.productId);
    
      if (!productName) {
        throw new Error(`Product name not found for productId ${item.productId}`);
      }
    
      return {
        price_data: {
          currency: 'EUR',
          unit_amount: item.unitPrice, // if unitPrice is in EUR
          product_data: {
            name: productNameMap.get( item.productId ) as string,
          }
        },
        quantity: item.quantity
      };
    });
    const session = await stripe.checkout.sessions.create({
        mode : "payment",
        payment_method_types: ["card"],
        line_items,
        metadata: {
          orderId:  orderInfo.id,
          userId,
        },
        payment_intent_data: {
          metadata: { 
            orderId:  orderInfo.id,
            userId, 
          }
        },
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`
    });
    
    return {
      session,
      reused : false,
    };
};

export const createPaymentRecord = async ( paymentData : {
    orderId               : number,
    stripeSessionId       : string,
    amount                : number,
    status                : PaymentStatus,
    stripePaymentIntentId? : string, 
}) => {
  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.upsert({
      where: {
        stripeSessionId: paymentData.stripeSessionId,
      },
      update: {
        status: paymentData.status,
        stripePaymentIntentId: paymentData.stripePaymentIntentId ?? undefined,
      },
      create: {
        orderId                 : paymentData.orderId,
        stripeSessionId         : paymentData.stripeSessionId,
        stripePaymentIntentId   : paymentData.stripePaymentIntentId ?? null,
        amount                  : paymentData.amount,
        status                  : paymentData.status,
      },
    });
  
    if (payment.status === PaymentStatus.SUCCEEDED) {
      await tx.order.update({
        where: { id: paymentData.orderId },
        data: { status: OrderStatus.PAID },
      });
    }
  });
  
};

// export const getPaymentBySessionId = async ( stripeSessionId : string ) => (
//   prisma.payment.findFirst({
//     where: {
//       stripeSessionId,
//     },
//   })
// );
