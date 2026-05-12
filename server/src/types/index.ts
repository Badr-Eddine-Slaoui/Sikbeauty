import { RetrieveCartInfo } from "../schemas/cart.cartItem.schema";


export type Config = {
    port                :   number
    databaseUrl         :   string,
    nodeEnv             :   'development' | 'production' | 'test',
    jwt_secret          :   string,
    payment_key         :   string,
    webhook_secret      :   string,
    accessTokenExpiry   :   string,
    refreshTokenExpiry  :   number
}

// Errors
export type CustomError = Error & {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
};

type Currency= "USD" | "MAD" | "EUR"

export type User = {
  id        :   number,
  role      :   Role,
  // currency  :   Currency
}
export type Role = 'Individual'/*| 'Professional'*/| 'admin';

declare global {
  namespace Express {
    interface Request {
      user: User,
      cart?: RetrieveCartInfo
    }
  }
}

export type  image = {
    url           : string,
    is_thumbnail  : boolean,
    productId     : number
}

export type DiscountType = 'PRICE'| 'PERCENT'

