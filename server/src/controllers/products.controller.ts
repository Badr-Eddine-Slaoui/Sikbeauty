import { Request, 
    Response } from 'express';
import { StatusCodes }      from 'http-status-codes';

import { Pagination }       from '../schemas/products.schema';
import { 
    getProductCategoryPagination,
    getProductUsingId, 
    totalProductInCategory}     from '../services/products.service';
import { User } from '../types';
import { EUR, MAD, USD } from '../utils';
import { Prisma } from '@prisma/client';



export const allProductUsingPagination = async ( req : Request, res : Response ) => {
    // query
    const query = req.query as Pagination;
    const page  = Number( query.page )
    const limit = Number( query.limit )
    // user
    const user = req.user as User;

    const skip = ( page  - 1 ) * limit;

    // Total of products
    const total = await totalProductInCategory( undefined , query.search );
    // number of pages
    const totalPage = Math.ceil(total / Number(query.limit) );
    // Page info 
    const pageInfo = {
        currentPage     :   page,
        pageSize        :   limit,
        totalItems      :   total,
        totalPages      :   totalPage,
        hasNextPage     :   page < totalPage,
        hasPreviousPage :   page > 1,
        nextPage        :   page <totalPage ? page + 1 : null,
        previousPage    :   page > 1 ? page - 1 : null,
    };
    // get product with pagination and search
    let products = await getProductCategoryPagination( skip, 
        Number(query.limit), 
        // user.role,
        undefined,
        query.search
    )
    // convert to currency user 
    // if ( user.role != 'admin' ) {
        // const price = user.role === "Professional" 
        //     ? product.priceProfessional.mul( 
            //         user.currency === "EUR" ? EUR : user.currency === "MAD" ? MAD : USD ).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP )
            //     : product.priceIndividual.mul( 
                //         user.currency === "EUR" ? EUR : user.currency === "MAD" ? MAD : USD ).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP )
    const productsUserCurrency = products.map( ( product ) => {
        // const priceCurrency = Math.floor( product.price * (user.currency === "EUR" ? EUR : USD ) )
        let discount = 0;
        if (product.discountType === 'PRICE') {
            discount = Math.min(product.discount || 0, product.price);
        } else if (product.discountType === 'PERCENT') {
            discount = Math.floor((product.price * (product.discount || 0)) / 100);
        }

        const finalPrice = product.price - discount;
        return {
            description             :   product.description,
            title                   :   product.title,
            id                      :   product.id,
            // minQuantity             :   product.minQuantity,

            price                   :   ( product.price / 100 ).toFixed(2),
            finalPrice              :   ( finalPrice / 100 ).toFixed(2),
            discountType            :   product.discountType,
            discount                :   product.discountType === "PRICE" ? ( ( product.discount || 0 )/ 100 ).toFixed( 2 ) : product.discount,
            thumbnailUrl            :   product.thumbnailUrl,
            status                  :   product.status,
        }
    })
    // }
    // return result
    res.status(StatusCodes.OK).json({
        pageInfo,
        data        :   productsUserCurrency,
        // currency    :   user.currency === "EUR" ? "EUR" : "USD"
    });
};

// Retrieve product by id 

export const retrieveProduct = async ( req : Request, res : Response ) => {
    const id = Number( req.params.id );
    // const role = req.user?.role;
    const user = req.user as User;
    // Check product exist 
    const product = await getProductUsingId( id, "user" );
    // const priceCurrency = Math.floor( product.price * (user.currency === "EUR" ? EUR : USD ) )
    let discount = 0
    if (product.discountType === 'PRICE') {
        discount = Math.min(product.discount || 0, product.price);
    } else if (product.discountType === 'PERCENT') {
        discount = Math.floor((product.price * (product.discount || 0)) / 100);
    }
    
    const finalPrice = product.price - discount;
    // Response product data
    res.status( StatusCodes.OK ).json({
        id          :   product.id,
        description :   product.description,
        // stock: prod  uct.stock,
        thumbnailUrl:   product.thumbnailUrl,
        status      :   product.status,
        title       :   product.title,
        images      :   product.images,
        videoUrl    :   product.videoUrl,
        // currency    :   user.currency,
        // discountThreshold: product.discountThreshold,
        // discountPercentage: product.discountPercentage,
        discountType:   product.discountType,
        discount    :   product.discount,
        price                   :   ( product.price / 100 ).toFixed(2),
        finalPrice              :   ( finalPrice / 100 ).toFixed(2),   
        // ...(user.role === 'admin' && {
        //     priceIndividual: product.priceIndividual,
        //     minQuantity: product.minQuantity,
        //     priceProfessional: product.priceProfessional,
        // }),

        // ...(user.role === 'Individual' && {
        //     price: product.priceIndividual.mul( 
        //         user.currency === "EUR" ? EUR : 
        //         user.currency === "MAD" ? MAD : USD ).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP ),
        //     // discountThreshold: product.discountThreshold,
        //     // discountPercentage: product.discountPercentage,
        // }),

        // ...(user.role === 'Professional' && {
        //     minQuantity: product.minQuantity,
        //     price: product.priceProfessional.mul( 
        //         user.currency === "EUR" ? EUR : 
        //         user.currency === "MAD" ? MAD : USD ).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP ),
        // }),
    });
};