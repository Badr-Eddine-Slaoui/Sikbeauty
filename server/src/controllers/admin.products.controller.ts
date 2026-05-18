import { Request, 
    Response }              from 'express';
import { StatusCodes }      from 'http-status-codes';

import prisma               from '../db/setup';
import {
    createNewProduct, 
    deleteFileFromStorage,
    deleteProduct,
    // getAllProductsForAdmin,
    saveFiles, 
    saveFileToStorage, 
    updateProInfo }         from '../services/admin.products.service';
import { getCategoyById }   from '../services/category.products.service';
import { getProductUsingId } from '../services/products.service';
import { MulterFiles }      from '../types/interfaces';
import { number_images }    from '../utils';
import { AppError }         from '../utils/AppErros';

// // Get all products for admin
// export const getAllProducts = async ( req : Request, res : Response ) => {
//     const products = await getAllProductsForAdmin();
//     res.status( StatusCodes.OK ).json({
//         status  : 'success',
//         count   : products.length,
//         products: products,
//     });
// };

export const newProduct = async ( req : Request, res : Response ) => {

    const files = req.files as MulterFiles;
    const images = files['images'] || [];
    const videos = files['video'] || [];

    if ( !(await getCategoyById(req.body.categoryId))) 
        throw new AppError( 'Category not found', 404 );
    for (const img of images) {
        if (img.size > 2 * 1024 * 1024) 
            throw new Error(`Image ${img.originalname} exceeds 2MB`);
    }
    if ( videos.length > 0 && videos[0].size > 10 * 1024 * 1024 )
        throw new Error(`Video ${videos[0].originalname} exceeds 10MB`);

    const [savedImages, savedVideos] = await Promise.all([
        saveFiles(images, 'uploads/images'),
        videos?.length ? saveFiles(videos, 'uploads/videos') : Promise.resolve([]),
    ]);
    req.body.price = Math.round(  req.body.price * 100 );
    if ( req.body.discountType === 'PRICE') 
        req.body.discount = req.body.discount * 100;
    const product = await createNewProduct( req.body, savedVideos, savedImages );
    res.status( StatusCodes.CREATED ).json({
        status  : 'success',
        message : 'Product created successfully',
        product : {
            id              :   product.id,
            thumbnailUrl    :   product.thumbnailUrl,
            title           :   product.title,
            description     :   product.description,
        },
    });
};

export const product = async ( req : Request, res : Response ) => {
    const product = await getProductUsingId( Number(req.params.id), req.user.role === 'admin' ? ' ': 'user'  );
    res.status( StatusCodes.CREATED ).json(
        product,
    );
};

// Update product info
export const updateProductInfo = async ( req : Request, res : Response ) => {
    const id    =   Number(req.params.id );
    const body  =   req.body;

    await getProductUsingId( id, req.user.role === 'admin' ? ' ': 'user' );
    if ( Object.keys(body).length == 0 ) {
        res.status( StatusCodes.OK ).json({
            status  : 'success',
            message : 'No changes were made',
        });
        return;
    }
    if ( req.body.price ) 
        req.body.price = Math.round(  req.body.price * 100 )
    await updateProInfo( id, body );
    res.status( StatusCodes.CREATED ).json({
        status  : 'success',
        message : 'Product updated successfully',
    });
};

// Update product thumbnail 
export const updateThumbnail = async ( req : Request, res : Response ) => {
    const id = Number( req.params.id );

    // check product exist
    const product = await getProductUsingId( id, req.user.role === 'admin' ? ' ': 'user' );
    // Delete image from storage 
    await deleteFileFromStorage( product.thumbnailUrl );
    // Upload image to disk and save url in db 
    // upload image to storage
    let url;
    if (req.file) {
        url = await saveFileToStorage( req.file, 'uploads/images' );
    }
    // save thumbnail url to db
    await prisma.product.update({
        where : {
            id : id,
        },
        data : {
            thumbnailUrl : url,
        },
    });
    res.status( StatusCodes.CREATED ).json({
        status  : 'success',
        message : 'Product thumbnail image updated successfully',
    });
};

// Update product image 
export const updateImagePoduct = async ( req : Request, res : Response ) => {
    const id        =   Number( req.params.id );
    const imageId   =   Number( req.params.imageId );

    // Check product exist
    const product = await getProductUsingId( id, req.user.role === 'admin' ? ' ': 'user' );
    // Check image id exist
    if ( imageId === 0 || product.images.length === 0 || product.images.length < imageId ) {
        throw new AppError('Image not found', 404);
    }
    // delete image from storage
    await deleteFileFromStorage( product.images[ imageId - 1] );
    // upload image to storage 
    let newImages;
    if (req.file) {
        let url = await saveFileToStorage( req.file, 'uploads/images' );
        newImages = [...product.images];
        newImages[ imageId - 1 ] = url;
    }
    // update url db
    await prisma.product.update({
        where : {
            id : id,
        },
        data : {
            images : newImages,
        },
    });
    res.status( StatusCodes.CREATED ).json({
        status  : 'success',
        message : 'Product image updated successfully',
    });
    
};

// Add new image 
export const addNewImageVideo = async ( req : Request, res : Response ) => {
    const id        =   Number( req.params.id );
    // Check product is exist 
    const product = await getProductUsingId( id, req.user.role === 'admin' ? ' ': 'user' );
    const files = req.files as MulterFiles;
    const image = files['image']?.[0] || null;
    const video = files['video']?.[0] || null;
    // Check if images array is full
    let newImages;
    let urlVideo;
    if ( image ) {
        if ( product.images.length == number_images ) 
            throw new AppError(`Images array is full. Maximum ${number_images} images allowed`, 400);
        // Add image to storage
        const url = await saveFileToStorage( image, 'uploads/images' );
        newImages = [...product.images];
        newImages.push(url);
    }
    if ( video ) {
        await deleteFileFromStorage( product.videoUrl );
        urlVideo = await saveFileToStorage( video, 'uploads/videos' );
    }
    // Save image or video links to db
    await prisma.product.update({
        where : {
            id : id,
        },
        data : {
            ...( newImages && newImages.length > 0 && { images: newImages } ),
            ...( urlVideo && { videoUrl : urlVideo } ),
        },
    });
    // Return response success
    res.status( StatusCodes.CREATED ).json({
        status  : 'success',
        message : 'Product image or video added successfully',
    });
};

// Delete product image 
export const deleteImageProduct = async ( req : Request, res : Response ) => {
    const id        =   Number( req.params.id );
    const imageId   =   Number( req.params.imageId );

    // Check product exist
    const product = await getProductUsingId( id, req.user.role === 'admin' ? ' ': 'user' );
    // Check image id exist
    if ( imageId === 0 || product.images.length === 0 || product.images.length < imageId ) {
        throw new AppError('Image not found', 404);
    }
    // Delete image from storage 
    await deleteFileFromStorage( product.images[ imageId - 1] );
    // delete url from db
    product.images.splice(imageId - 1, 1);
    await prisma.product.update({
        where : {
            id,
        },
        data : {
            images : product.images,
        },
    });
    // Return sucess message
    res.status( StatusCodes.CREATED ).json({
        status  : 'success',
        message : 'Product image deleted successfully',
    });
};

// Delete product
export const deleteProductController = async ( req : Request, res : Response ) => {
    const id = Number( req.params.id );
    
    await deleteProduct( id );
    
    res.status( StatusCodes.OK ).json({
        status  : 'success',
        message : 'Product deleted successfully',
    });
};
