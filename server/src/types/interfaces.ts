import { DiscountType, Prisma } from '@prisma/client';
import { Role } from '.';


export interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}



export interface AddNewItemToCart  {
    productId   :     number, 
    cartId      :     number, 
    role        :     Role,
    quantity    :     number
}

export interface QuantityValidator {
    // stock       :   number,
    role        :   Role,
    quantity    :   number,
    newQuantity :   number,
    // minQuantity :   number,
}

export interface Item {
    id          :   number;
    createdAt   :   Date;
    updatedAt   :   Date;
    productId   :   number;
    quantity    :   number;
    cartId      :   number;
}

export interface ProductItem {
    id                  :   number;
    title               :   string;
    price               :   number;
    discount            :   number | null;
    discountType        :   DiscountType | null;
    status              :   boolean;
    // minQuantity         :   number;
    thumbnailUrl        :   string;
}

export interface CartOutDated {
    cartId      :   number,
    cartItems   :   Item[],
    productMap  :   Map<number, ProductItem>,
}