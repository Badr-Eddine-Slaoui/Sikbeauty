import { OrderStatus, 
  PaymentStatus }                   from "@prisma/client";
import { createPaymentRecord }      from "./payment.service";
import { getOrder }                 from "./order.orderItem.service";
import prisma                       from "../db/setup";

export const handleCheckoutCompleted = async ( session: any ) => {
    // get order info and check if order not paid create paymnet table and change status of order
    const orderId = +session.metadata?.orderId;
    // const userId = session.metadata?.userId;
    if ( !orderId || !session.payment_intent ) return;
    const payment = await prisma.payment.findUnique({
      where: { stripeSessionId: session.id },
    });
    if (!payment || payment.status === PaymentStatus.SUCCEEDED) return;
    // create paymnet record 
    await createPaymentRecord( {
      orderId,
      stripeSessionId       : session.id,
      amount                : payment.amount | 0,
      status                : PaymentStatus.SUCCEEDED,
      stripePaymentIntentId : session.payment_intent
    });
};

export const handlePaymentFailed = async ( paymentIntent : any ) => {
  const orderId = +paymentIntent.metadata?.orderId;
  // const userId = paymentIntent.metadata?.userId;
  if ( !orderId ) return;
  const order = await getOrder( orderId );
  const payment = await prisma.payment.findUnique({
    where: { stripeSessionId: paymentIntent.id },
  });
  if ( !payment ) return;
  await createPaymentRecord({
    orderId,
    stripeSessionId: payment.stripeSessionId,
    stripePaymentIntentId: paymentIntent.id,
    amount: payment.amount,
    status: PaymentStatus.FAILED,
  });
};

export const handleCheckoutExpired = async (session: any) => {
  const orderId = +session.metadata?.orderId;
  if (!orderId) return;

  const paymnet = await prisma.payment.findUnique({
    where: { stripeSessionId: session.id },
  });

  if (!paymnet) {
    console.warn(`No PENDING payment found for expired session ${session.id}`);
    return;
  }

  await createPaymentRecord({
    orderId,
    stripeSessionId: session.id,
    amount: paymnet.amount,
    status: PaymentStatus.EXPIRED,
    stripePaymentIntentId: paymnet.stripePaymentIntentId || undefined,
  });
};
// export const markPaymentSuccess = async ({
//     stripeSessionId,
//     paymentIntentId,
//   }: {
//     stripeSessionId: string;
//     paymentIntentId: string;
//   }) => {
//     return prisma.payment.updateMany({
//       where: {
//         stripeSessionId,
//         status: {
//           not: PaymentStatus.SUCCEEDED,
//         },
//       },
//       data: {
//         status                  :   PaymentStatus.SUCCEEDED,
//         stripePaymentIntentId   :   paymentIntentId,
//       },
//     });
// };

// export const handleCheckoutExpired = async ( session: any ) => {

//     const existingPayment = await getPaymentBySessionId( session.id );
  
//     if ( !existingPayment ) return;
  
//     // Mark payment as FAILED
//     await prisma.payment.update({
//         where: { stripeSessionId : session.id },
//         data: { status: PaymentStatus.EXPIRED },
//     });
// };


