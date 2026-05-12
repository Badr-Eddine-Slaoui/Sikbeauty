import { Request, 
    Response }              from "express";
import stripe               from "../lib/stripe";
import { 
  handleCheckoutCompleted, 
    handleCheckoutExpired, 
    // handleCheckoutExpired, 
    handlePaymentFailed }   from "../services/webhook.service";
    import { config }       from '../config';
import { StatusCodes }      from "http-status-codes";

export const stripeWebhook = async ( req : Request, res : Response ) => {

    const signature = req.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature!,
            config.webhook_secret
            );
          console.log( event )
        } catch (err) {
            console.error("Webhook signature verification failed:", err);
            return res.status( StatusCodes.BAD_REQUEST ).send("Invalid signature");
        }
        try {
          switch (event.type) {
            
            case "checkout.session.completed":
              await handleCheckoutCompleted( event.data.object );
              console.error( "test hello ")
              break;
            
            case "payment_intent.payment_failed":
              console.log("Payment failed:", event.data.object.id );
              await handlePaymentFailed( event.data.object )
              break;
            
            case "checkout.session.expired":
              await handleCheckoutExpired( event.data.object );
              break;
        }
    } catch (err) {
      console.error("⚠️ Webhook processing error:", err);
    }
  res.status(200).json({ received: true }); 
};

