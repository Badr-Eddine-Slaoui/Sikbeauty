import { z }                    from 'zod';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { paginationSchema }     from './products.schema';
import { pageInfo } from './category.products.shemas';
import { OrderStatus, PaymentStatus} from "@prisma/client"

extendZodWithOpenApi(z);

// export enum OrderStatus {
//     PENDING = 'PENDING',
//     PAID = 'PAID',
//     DELIVERED = 'DELIVERED',
//     CANCELLED = 'CANCELLED',
// }

export const searchOrderSchema = z
  .object({
      status    : z.nativeEnum(OrderStatus).optional(),
      userId    : z.string().optional(),
      startDate : z.string().min(1).optional(),
      endDate   : z.string().min(1).optional(),
  })
  .merge(paginationSchema)
  .strict()
  .superRefine((val, ctx) => {
      if (!!val.startDate !== !!val.endDate) {
          ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'You must include both startDate and endDate.',
              path: ['startDate'],
          });
      }
  });

export const responseOrderSuccess = z.object({
    pageInfo    :   pageInfo,
    data        :   z.array( z.object({
        id          : z.number().gte( 1 ),
        status      : z.nativeEnum(OrderStatus),
        totalPrice  : z.string(),
        user: z.object({
            id                    : z.number().gte( 1 ),
            email                 : z.string(),
            phoneCountryCode      : z.string(),
            phoneNumber           : z.string(),
        }),
        }),
    ),
    },
);

const order = z.object({
    id          : z.number().gte( 1 ),
    userId      : z.number().gte( 1 ),
    status      : z.string(),
    createdAt   : z.string(),
    updatedAt   : z.string(),
});
const orderAddress = z.object({
    id              : z.number().gte( 1 ),
        fullName        : z.string(),
        email           : z.string(),
        orderId         : z.number().gte( 1 ),
        phoneNumber     : z.string(),
        phoneCountryCode: z.string(),
        street          : z.string(),
        city            : z.string(),
        state           : z.string(),
        country         : z.string(),
        postalCode      : z.string(),
        createdAt       : z.string(),
        updatedAt       : z.string(),
})
const orderClientInfo = order.merge( z.object({
        totalPrice  : z.string()
    })
);

const orderServerInfo = order.merge( z.object({
        totalPrice  : z.number()
    })
);
export const allInformationResonseOrderById = z.object({
    orderClientInfo,
    order_items : z.array( z.object({
        id              : z.number().gte( 1 ),
        productId       : z.number().gte( 1 ),
        price           : z.string(),
        quantity        : z.string(),
        discount        : z.number().gte( 0 ),
        discountType    : z.string().nullable(),
        unitPrice       : z.string(),
    })),
    orderAddress : orderAddress
})

export const orderInfoServer = z.object({
    orderServerInfo,
    order_items : z.array( z.object({
        id              : z.number().gte( 1 ),
        productId       : z.number().gte( 1 ),
        price           : z.number(),
        quantity        : z.string(),
        discount        : z.number().gte( 0 ),
        discountType    : z.string().nullable(),
        unitPrice       : z.number(),
    })),
    orderAddress : orderAddress
})
export type SearchOrder = z.infer<typeof searchOrderSchema>

export type WhereOrders = {
    userId?: number,
    status?: OrderStatus,
}

export type InformationOrder = {
    id          :   number,
    userId      :   number,
    status      :   OrderStatus,
    createdAt   :   Date,
    updatedAt   :   Date,
    totalPrice  :   number,
    stripeSessionId : string | null
    order_items : {
        id              : number,
        productId       : number,
        price           : number,
        quantity        : number,
        discount        : number | null,
        discountType    : string | null,
        unitPrice       : number,
    }[],
    payment : {
        id                  : number, 
        status              : PaymentStatus, 
        stripeSessionId     : string 
    }[],
    orderAddress : {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        fullName: string;
        email: string;
        orderId: number;
        phoneNumber: string;
        phoneCountryCode: string;
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string | null;
    }[];

}
// export type InformationOrderServer = z.infer<typeof orderInfoServer>