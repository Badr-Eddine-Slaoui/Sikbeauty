import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z }                    from 'zod';

extendZodWithOpenApi(z);

// export const requestProductId = z.object({
//     productId : z.string()
//         .regex(/^\d+$/, { message: 'Id must contain only numbers' })
//         .openapi({
//             param : {
//                 in : 'path',
//                 name : 'productId', 
//             },
//         }),
// }).strict();

export const incrementDecrementSchema = z.object({
    action : z.enum(['increment', 'decrement']),
}).strict();

export const quantity = z.object({
    quantity : z.number().gte(1),
}).strict();

export const bodyCatItem = quantity.extend({
    productId : z.number()
        .gte(1),
}).strict();

export const messageInfo = z.object({
    status      :   z.string(),
    message     :   z.string(),
});

export const itemcartSchema = z.object({
        cartId  :   z.number()
            .gte(1),
        items   :   z.array(
            z.object({
                id  :   z.number()
                    .gte(1),
                product     :   z.object({
                    id              :   z.number()
                        .gte(1),
                    description         : z.string(),
                    // stock           : z.number()
                    //     .gte(1),
                    status          :   z.boolean(),
                    thumbnailUrl    :   z.string(),
                    price           :   z.number(),
                    // minQuantity     :   z.number(),
                    discount        :   z.number() ,
                    discountType    :   z.string() || z.null(),
                    // finalPrice          :   z.number(),
                    unitPrice       :   z.number(),
                }),
                quantity    :   z.number()
                    .gte(1),
            }),
        ),
        total   :   z.number(),
});

export const retrieveCartInfoSchema = z.object({
    cartId  :   z.number()
        .gte(1),
    items   :   z.array(
        z.object({
            id  :   z.number()
                .gte(1),
            product     :   z.object({
                id              :   z.number()
                    .gte(1),
                status          : z.boolean(),
                thumbnailUrl    : z.string(),
                price           :   z.number() || z.string(),
                // minQuantity     :   z.number(),
                discount        : z.number() ,
                discountType    :   z.string() || z.null(),
                unitPrice       :   z.number(),
            }),
            quantity    :   z.number()
                .gte(1),
        }),
    ),
    total   :   z.number(),
});

export type RetrieveCartInfo = z.infer< typeof retrieveCartInfoSchema >

export const responseCartSchema = messageInfo.merge( itemcartSchema );



export type BodyCartItem = z.infer<typeof bodyCatItem>
export type Quantity = z.infer<typeof quantity>
// export type ProductId = z.infer<typeof requestProductId>
export type IncrementDecrementAction = z.infer<typeof incrementDecrementSchema>