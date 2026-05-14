import fs                   from 'fs/promises';
import path                 from 'path';

import prisma               from '../db/setup';
import { Product, 
    UpdateProductInfo }     from '../schemas/products.schema';
import { AppError }         from '../utils/AppErros';
import crypto               from 'crypto';


export const createNewProduct = async ( body : Product, video : string[],  images : string[]) => {
    const thumbnailUrl = images.splice(0, 1);
    const newProduct = await prisma.product.create({
        data : {
            ...body,
            thumbnailUrl   :  thumbnailUrl[0],
            videoUrl : video.length === 1 ? video[0] : '',
            images : images.length == 0 ? [] : images,
        },
    });
    return newProduct;
};

export const saveFiles = async (files: Express.Multer.File[], folder : string) => {
    await fs.mkdir(folder, { recursive: true });
    const save = files.map( async (file ) => {
        const nameFile = `${Math.floor(Math.random() * 1e6).toString().padStart(6, '0')}-${crypto.randomUUID()}-${Date.now()}${(file.originalname).replace(/\s+/g, '-')}`;
        const filepath = path.join(folder, nameFile) as string;
        await fs.writeFile(filepath, file.buffer); 
        return filepath;       
    });
    return Promise.all(save);
};

export const saveFileToStorage = async ( file: Express.Multer.File, folder : string ) => {
    await fs.mkdir(folder, { recursive: true });
    const nameFile = `${Math.floor(Math.random() * 1e6).toString().padStart(6, '0')}-${crypto.randomUUID()}-${Date.now()}${(file.originalname).replace(/\s+/g, '-')}`;
    const filepath = path.join(folder, nameFile) as string;
    await fs.writeFile(filepath, file.buffer); 

    return filepath;
};
// export const createMultipleImagesUrl = async ( images : image[] ) => {
//     await prisma.image.createMany({
//         data : images,
//     });
// };

// UPDATE PRODUCT INFO 

export const updateProInfo = async ( id : number, body : UpdateProductInfo ) => {
    try {
        await prisma.product.update({
            where : {
                id : id,
            },
            data : body,
        });
    }
    catch {
        throw new AppError( 'Somthings wrongs', 500 );
    }
};

export  const deleteFileFromStorage = async ( url : string ) => {
    try {
        const filePath = path.join( __dirname, '../..', url );
        // check file exists
        await fs.access(filePath);
        console.error( filePath );
        await fs.unlink(filePath);
    }
    catch {
        // if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
        //     throw new AppError('File does not exist', 404 );
        // }
    }
};

// Get all products for admin (including inactive products)
// export const getAllProductsForAdmin = async () => {
//     return await prisma.product.findMany({
//         orderBy: {
//             createdAt: 'desc',
//         },
//         include: {
//             category: {
//                 select: {
//                     id: true,
//                     name: true,
//                     slug: true,
//                 },
//             },
//         },
//     });
// };

// Delete product
export const deleteProduct = async (id: number) => {
    // Get product to access file URLs
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    // Delete all associated files from storage
    const filesToDelete = [
        product.thumbnailUrl,
        product.videoUrl,
        ...(product.images || []),
    ].filter(Boolean);

    // Delete files from storage
    await Promise.all(
        filesToDelete.map(file => deleteFileFromStorage(file))
    );

    // Delete product from database
    await prisma.product.delete({
        where: { id },
    });
};

// export const getProductPagination = async  ( skip : number, limit : number, role : string, id? : number ) => {
//     const data = await Promise.all([
//         prisma.product.count({
//             where : {
//                 categoryId : id ? id : undefined,
//                 status     : true,
//             },
//         }),
//         prisma.product.findMany({
//             skip,
//             take: limit,
//             where : {
//                 categoryId :  id ? id : undefined,
//                 status     : true,
//             },
//             select : {
//                 id : true,
//                 title               :   role === 'admin' ? true : undefined,
//                 description         :   true,
//                 price_individual    :   role === 'admin' || role === 'Individual' ? true : undefined,
//                 minQuantity         :   role === 'admin' || role === 'Professional' ? true : undefined,
//                 price_professional  :   role === 'admin' || role === 'Professional' ? true : undefined,
//                 stock               :   true,
//                 discountThreshold   :   role === 'admin' || role === 'Individual' ? true : undefined,
//                 discountPercentage  :   role === 'admin' || role === 'Individual' ? true : undefined,
//                 images : {
//                     orderBy: {
//                         is_thumbnail: 'desc',
//                     },
//                 },
//             },
//         }),
//     ]);

//     return data;
// };
