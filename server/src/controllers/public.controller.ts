
import { Request, 
    Response }                  from 'express';

import { LatestProduct }        from '../services/public.service';

export const GetLatestProducts = async ( req : Request, res : Response ) => {
    const products = await LatestProduct();
    const productsDiscount = products.map( ( product ) => {
        let discount = 0;

        if (product.discountType === 'PRICE') {
            discount = Math.min( product.discount || 0, product.price );
        } else if (product.discountType === 'PERCENT') {
            discount = Math.floor((product.price * (product.discount || 0)) / 100);
        }
        
        const finalPrice = product.price - discount

        return {
            description             :   product.description,
            title                   :   product.title,
            id                      :   product.id,
            // minQuantity             :   product.minQuantity,
            price                   :   ( product.price / 100 ).toFixed(2),
            finalPrice              :   ( finalPrice / 100 ).toFixed(2),
            discountType            :   product.discountType,
            discount                :   product.discount,
            thumbnailUrl            :   product.thumbnailUrl,
            status                  :   product.status,
        }
    })
    return res.send({
        products: productsDiscount,
    });
};