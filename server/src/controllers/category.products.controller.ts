import { Request, 
    Response }                  from 'express';
import { StatusCodes }          from 'http-status-codes';

import { getAllCategories, 
    getCategoyById }            from '../services/category.products.service';
import { 
    getProductCategoryPagination, 
    totalProductInCategory }    from '../services/products.service';
import { User }                 from '../types';
// import { EUR, 
//     MAD, 
//     USD }                       from '../utils';
// import { Prisma }               from '@prisma/client';

export const getProducts = async ( req : Request, res : Response ) => {
    const page  =   Number(req.query.page);
    const limit =   Number(req.query.limit);
    const user  =   req.user as User;
    const { id } =  req.params;

    const skip = ( page  - 1 ) * limit;
    await getCategoyById( Number(id) );
    let categories, productsUserCurrency;
    const total = await totalProductInCategory( Number(id) );
    const totalPage = Math.ceil(total / limit );
    const pageInfo = {
        currentPage     :   page,
        pageSize        :   limit,
        totalItems      :   total,
        totalPages      :   totalPage,
        hasNextPage     :   page <totalPage,
        hasPreviousPage :   page > 1,
        nextPage        :   page <totalPage ? page + 1 : null,
        previousPage    :   page > 1 ? page - 1 : null,
    };
    // if ( req.user?.role ) {
        categories = await getProductCategoryPagination( skip, limit, Number(id) );
        // if ( user.role != 'admin' ) {
           productsUserCurrency = categories.map( ( product ) => {
                // const priceCurrency = Math.floor( product.price * (user.currency === "EUR" ? EUR : USD ) )
                let discount = 0;
    
                if (product.discountType === 'PRICE') {
                    discount = Math.min(product.discount || 0, product.price);
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
                    discount                :    product.discountType === "PRICE" ? ( ( product.discount || 0 )/ 100 ).toFixed( 2 ) : product.discount,
                    thumbnailUrl            :   product.thumbnailUrl,
                    status                  :   product.status,
                }
            })
        // }
    // }
    // return result
    res.status(StatusCodes.OK).json({
        pageInfo,
        // data        :   user.role === 'admin' ? categories : productsUserCurrency,
        data        :   productsUserCurrency,
        // currency    :   user.currency 
    });
};

// YOU MUST CHECK ACTIVATION 
export const allCategories = async ( req : Request, res : Response ) => {
    const search = req.query.search as string | undefined;
    let categories;
    if ( req.user?.role == 'admin')
        categories = await getAllCategories(search);
    else 
        categories = await getAllCategories( 'true' );
    res.status(StatusCodes.OK).json(categories);
};

