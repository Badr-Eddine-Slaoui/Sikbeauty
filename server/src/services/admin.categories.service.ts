import { Prisma }       from '@prisma/client';
import slugify          from 'slugify';

import prisma           from '../db/setup';
import { NewCaterory, 
    UpadeCategory }     from '../schemas/categories.schema';
import { AppError }     from '../utils/AppErros';


export const categoryById = async ( id : number ) => (
    await prisma.category.findUnique({
        where : {
            id,
        },
    }));

export const createCategory = async ( body : NewCaterory) => {
    
    const slug = body.slug ? body.slug : slugify(body.name, { lower: true, strict: true });
    try {
        const category = await prisma.category.create({
            data : {
                ...body,
                slug,
            },
        });
        return category;
    } catch ( error ) {
        console.error( error );

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new AppError('Slug already exists. Please choose a different slug', 409);
        }
        throw error;
    }
};

export const updateCategory = async ( body : UpadeCategory, id : number ) => {
    try {
        const category = await prisma.category.update({
            where : {
                id,
            },
            data : body,
        });
        return category;
    } catch ( error ) {
        console.error( error );

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new AppError('Slug already exists. Please choose a different slug', 409);
        }
        throw error;
    }
};

// export const getAllCategories = async ( status : boolean)=> (
//     await prisma.category.findMany({
//         where : {
//             isActive : status,
//         },
//     })
// );

// This is not perfect if has larg product inside category !!!!!!!??????!!!!!!!!
/**/ 
// export const updateAllStatusOfProductInCategory = async ( id : number, status: boolean ) => {
//     await prisma.product.updateMany({
//         where : {
//             categoryId : id,
//         },
//         data : {
//             status,
//         },
//     });
// };
/**/