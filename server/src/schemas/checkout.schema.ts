import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z }                    from 'zod';
import { productType } from './products.schema';
import { messageInfo } from './cart.cartItem.schema';

extendZodWithOpenApi(z);

export const checkoutItems = z.object({
    accept : z.boolean(),
}).strict();


export const responseConflictCart = messageInfo.merge( z.object({
    conflict : z.array(z.object({
        itemId      : z.number().gte(1),
        type        : z.string(),
        oldQuantity : z.number().gte(1),
        newQuantity : z.number().gte(0),
        message     : z.string(),
    })),
    newCart : z.object({
        cartItems : z.array( z.object({
            id                  :   z.number().gte(1),
            product : z.object({
                id                  : z.number().gte(1),
                price               : z.number().gte(1),
                unitPrice           : z.number().gte(1),
                discount            : z.number().gte(1),
                thumbnailUrl        : z.string(),
                discountType        : productType,
            }),
            quantity    : z.number().gte(1),
        }))
    })
})).strict();

export type CheckoutItems = z.infer<typeof checkoutItems>