import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z }                    from 'zod';

extendZodWithOpenApi(z);


export const checkoutSessionPaymnetSchema = z.object({
    orderId : z.number().gte(1)
}).strip( );

export type CheckoutSessionPaymnet = z.infer<typeof checkoutSessionPaymnetSchema>