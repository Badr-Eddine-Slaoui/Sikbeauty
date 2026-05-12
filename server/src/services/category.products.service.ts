import prisma                   from '../db/setup';
import { AppError }             from '../utils/AppErros';


export const getCategoyById = async ( id : number ) =>{
    const category = await prisma.category.findUnique({
        where : {
            id,
        },
    });
    if ( !category ) {
        throw new AppError( 'Category not found', 404 );
    }
    return category;
};



export const getAllCategories = async ( status : string | undefined )=> (
    await prisma.category.findMany({
        where : {
            isActive : status ? status === 'true' : undefined,
        },
    })
);