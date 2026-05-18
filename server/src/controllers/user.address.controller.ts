import { Request, 
    Response }          from 'express';
import { StatusCodes }  from 'http-status-codes';

import { UpdateUserAddress, UserAddress }  from '../schemas/user.address.schema';
import { addressById, delAddress, getAllAddress, newAddress, updAddress }   from '../services/user.address.service';
import { User }         from '../types';
import { AppError } from '../utils/AppErros';
import { ParamId } from '../utils/schemas.util';


export const craeteNewAddress = async ( req : Request, res : Response ) => {
    // body
    const body = req.body as UserAddress;
    // user
    const user = req.user as User;
    // create new adress
    const address = await newAddress( user.id, body );
    // return success created 
    res.status( StatusCodes.CREATED ).json({
        status : 'sussess',
        message : 'Adress created susseccfully',
        address,
    });
};

export const updateAddress = async ( req : Request, res : Response ) => {
    // params 
    const param = req.params as ParamId;
    // body
    const body = req.body as UpdateUserAddress;
    // user
    const user = req.user as User;
    // update address 
    const address = await updAddress( user.id, Number( param.id ), body );
    // return success created 
    res.status( StatusCodes.OK ).json({
        status : 'sussess',
        message : 'Adress updated susseccfully',
        address,
    });
};

export const allAddress = async ( req : Request, res : Response ) => {
    // user
    const user = req.user as User;
    // Get all address
    const address = await getAllAddress( user.id );
    // return address 
    res.status( StatusCodes.CREATED ).json(
        address,
    );
};

export const deleteAddress = async ( req : Request, res : Response ) => {
    // param
    const param = req.params as ParamId;
    // user
    const user = req.user as User;
    // delete address 
    await delAddress( user.id, Number(param.id) );
    // return address 
    res.status( StatusCodes.CREATED ).json({
        status : 'sussess',
        message : 'Adress deleted susseccfully',
    });
};

export const addressInformation = async ( req : Request, res : Response ) => {
    // param 
    const param = req.params as ParamId;
    // user
    const user = req.user as User;
    // Get address info using user_id and address_id
    const address = await addressById( user.id, Number( param.id ));
    // Not found
    if ( !address ) {
        throw new AppError( 'Address not found', 404 );
    }
    // return the address information 
    res.status( StatusCodes.OK ).json(
        address,
    );
};