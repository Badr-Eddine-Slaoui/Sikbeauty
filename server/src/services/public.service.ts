
import prisma from '../db/setup';

export const LatestProduct = async () => (
    await prisma.product.findMany({
        orderBy : {
            createdAt : 'desc', 
        },
        where : {
            status : true,
        },
        select : {
            id                  :   true,
            status              :   true,
            title               :   true,
            description         :   true,
            price               :   true,
            // priceIndividual     :   true,
            thumbnailUrl        :   true,
            // discountPercentage  :   true,
            // discountThreshold   :   true,
            discountType  :   true,
            discount   :   true,
        },
        take : 5,
    })
);