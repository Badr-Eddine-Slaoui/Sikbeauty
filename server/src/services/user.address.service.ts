
import prisma from '../db/setup';
import { UpdateUserAddress, UserAddress } from '../schemas/user.address.schema';
import { AppError } from '../utils/AppErros';


export const newAddress = async ( user_id : number, body : UserAddress ) => (
    await prisma.userAddress.create({
        data : {
            ...body,
            userId : user_id,
        },
    })
);

export const updAddress = async ( 
    user_id : number, 
    address_id : number, 
    body : UpdateUserAddress,
) => {

    try {
        return await prisma.userAddress.update({
            where : {
                id : address_id,
                userId : user_id,
            },
            data : body,
        });
        
    }
    catch {
        throw new AppError( 'Address not found', 404 );
    };
};

export const getAllAddress = async ( user_id : number ) => (
    await prisma.userAddress.findMany({
        where : {
            userId : user_id,
        },
    })
);

export const delAddress = async ( user_id : number, address_id : number ) => {
    try {
        await prisma.userAddress.delete({
            where : {
                id : address_id,
                userId : user_id,
            },
        });
    }
    catch {
        throw new AppError( 'Address not found', 404 );
    };
};

export const addressById =async ( user_id : number, address_id : number ) => (
    await prisma.userAddress.findUnique({
        where : {
            userId :  user_id,
            id : address_id,
        },
    })
);