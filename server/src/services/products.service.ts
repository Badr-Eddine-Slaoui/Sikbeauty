import prisma from '../db/setup';
import { AppError } from '../utils/AppErros';
// Return all products just is active 

export const getProductUsingId = async ( id : number, roleUser : string ) => {
    const product = await prisma.product.findUnique({
        where : {
            id,
            // status : roleUser === 'user' ? true : undefined,
        },
        
    });
    if ( product === null ) 
        throw new AppError('Product not found', 404);
    return product;
};

export const totalProductInCategory = async ( id? : number, search? : string ) => (
    prisma.product.count({
        where : {
            categoryId :    id ? id : undefined,
            title      :    search ? search : undefined
        },
    })
);

export const getProductCategoryPagination = async  ( skip : number, 
    limit : number, 
    // role : string, 
    id? : number,
    search? : string ) => (

    prisma.product.findMany({
        skip,
        take: limit,
        where : {
            categoryId :    id ? id : undefined,
            title      :    search ? search : undefined
        },
        orderBy: {
            status: 'desc', // or 'desc'
        },
        select : {
            id                  :   true,
            title               :   true,
            status              :   true,
            description         :   true,
            // priceIndividual     :   role === 'admin' || role === 'Individual' ? true : undefined,
            // minQuantity         :   role === 'admin' || role === 'Professional' ? true : undefined,
            // priceProfessional   :   role === 'admin' || role === 'Professional' ? true : undefined,
            price                   :   true,
            // stock               :   true,
            // discountThreshold   :   role === 'admin' || role === 'Individual' ? true : undefined,
            // discountPercentage  :   role === 'admin' || role === 'Individual' ? true : undefined,
            discount  :   true,
            discountType  :   true,
            thumbnailUrl        :   true,
        },
        
    })

);
export const getProducts = async ( ids : number[] ) => (
    prisma.product.findMany({
        where : {
            id : {
                in : ids,
            },
        },
        select : {
            id                  :   true,
            title               :   true,
            description         :   true,
            price               :   true,
            // priceIndividual     :   true,
            // priceProfessional   :   true,
            // minQuantity         :   true,
            discount            :   true,
            discountType        :   true,
            status              :   true,
            thumbnailUrl        :   true,
            // stock               :   true,
        },
    })
);

// export const allProductUsingPagination = async ( req : Request, res : Response ) => {
//     const query = req.query as Pagination;
//     const skip = ( Number(query.page)  - 1 ) * Number(query.limit);
//     const [ total, products ] = await getProductPagination( skip, Number(query.limit), 'admin' );
    
//     res.status(StatusCodes.OK).send({
//         total : Math.ceil( total ),
//         products,
//     });
// };


// export const getProductPagination = async  ( skip : number, 
//     limit : number, 
//     role : string, 
//     // id? : number,
//     search? : string
//     ) => {
//     const data = await Promise.all([
//         prisma.product.count({
//             where : {
//                 // categoryId : id ? id : undefined,
//                 status     :    role != 'admin' ? true : undefined,
//                 title      :    search ? search : undefined
//             },
//         }),
//         prisma.product.findMany({
//             skip,
//             take: limit,
//             where : {
//                 // categoryId :  id ? id : undefined,
//                 status     :    role != 'admin' ? true : undefined,
//                 title      :    search ? search : undefined
//             },
//             select : {
//                 id : true,
//                 title               :   true,
//                 description         :   true,
//                 priceIndividual     :   role === 'admin' || role === 'Individual' ? true : undefined,
//                 minQuantity         :   role === 'admin' || role === 'Professional' ? true : undefined,
//                 priceProfessional   :   role === 'admin' || role === 'Professional' ? true : undefined,
//                 stock               :   true,
//                 discountThreshold   :   role === 'admin' || role === 'Individual' ? true : undefined,
//                 discountPercentage  :   role === 'admin' || role === 'Individual' ? true : undefined,
//                 thumbnailUrl        :   true,
//             },
//         }),
//     ]);

//     return data;
// };
