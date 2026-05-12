// import { createStripeCheckoutSession } from "../services/stripe.service.js";

import { Request, 
    Response }                              from "express";
import { CheckoutSessionPaymnet }           from "../schemas/payment.schema";
import { getOrderById, 
    updateOrderStripeSession }              from "../services/order.orderItem.service";
import { AppError }                         from "../utils/AppErros";
import { createPaymentRecord, 
    createStripeCheckoutSession }           from "../services/payment.service"
import { StatusCodes }                      from "http-status-codes";
import { User }                             from "../types";
import { PaymentStatus }                    from "@prisma/client";


// create checkout session


export const createCheckoutSession = async ( req : Request, res : Response ) => {
    // // param
    const body = req.body as CheckoutSessionPaymnet;

    // user 
    const user = req.user as User
    // get order using id
    const order = await getOrderById( body.orderId, user.id );
    if ( !order ) 
        throw new AppError( 'Order not found', 404 );
    if (order.status !== "PENDING") {
        throw new AppError("Order is not payable", 404);
    }
    // carete session payment
    const session = await createStripeCheckoutSession( order, user.id );
    // Save payment attempt
    if ( session.reused === false ) {
        await updateOrderStripeSession( session.session.id, order.id );
        await createPaymentRecord({
            orderId             : order.id,
            stripeSessionId     : session.session.id,
            amount              : order.totalPrice,
            status              : PaymentStatus.PENDING,
        });
    }

    res.status( StatusCodes.OK ).json( { 
        status  :   "success",
        url     :   session.session.url 
    } );
}