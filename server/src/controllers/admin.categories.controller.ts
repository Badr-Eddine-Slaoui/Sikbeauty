
import { Request, 
    Response }              from 'express';
import { StatusCodes }      from 'http-status-codes';

import { categoryById,
    createCategory,
    updateCategory }        from '../services/admin.categories.service';
import { AppError }         from '../utils/AppErros';

export const newCategory = async ( req : Request, res : Response ) => {
    // Create categories 
    const newCategoryData = await createCategory( req.body );
    console.error('Create new category');
    res.status( StatusCodes.CREATED ).json({
        status  :   'success',
        message :   'Category created successfully',
        data    :   newCategoryData,
    });
};

export const updateCategoryById = async ( req : Request, res : Response ) => {
    const id = Number( req.params.id );
    const body = req.body;
    // Check categories is exist 
    const category = await categoryById( id );
    // //// if -> False :  Category not found ( NOT_FOUND  )
    if ( !category) {
        throw new AppError( 'Category not found', 404 );
    }

    // if -> body is empty : no changes are made ( OK )
    if ( !body.description && !body.name && !body.slug ) {
        res.status( StatusCodes.OK ).json({
            status : 'success',
            message : 'No changes are made',
        });
    }

    // update data
    const dataUpdated = await updateCategory( body, id );
    // Success message 
    res.status(StatusCodes.OK ).json({
        status  :   'success',
        message :   'Category updated successfully',
        data    :   dataUpdated,
    });
};

// export const allCategories =    async ( req : Request, res : Response ) => {
//     const search   = req.query.search;
//     let categories;
//     if ( req.user?.role == 'admin')
//         categories = await getAllCategories( search === 'true' );
//     else 
//         categories = await getAllCategories( true );
//     res.status(StatusCodes.OK).json(categories);
// };

// export const changeStatus = async ( req : Request, res : Response ) => {
//     const id = Number(req.params.id);
//     const category = await getCategoyById( id );

//     await updateAllStatusOfProductInCategory( id, !(category.isActive) );
//     await prisma.category.update({
//         where : {
//             id : id,
//         },
//         data : {
//             isActive : !(category.isActive),
//         },
//     });
//     res.status(StatusCodes.OK ).json({
//         status  :   'success',
//         message :   'Change status of category and product successfully',
//     });
// };