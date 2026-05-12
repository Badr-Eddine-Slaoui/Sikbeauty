

import { NextFunction,
    Request, 
    Response }      from 'express';

import { AppError } from '../utils/AppErros';


export const verifyPermission = ( permission : string[] ) => ( req : Request, res : Response, next : NextFunction ) => {
    if ( req.user ) {
        console.error( req.user?.role, permission, permission.includes( req.user?.role ));
    }
    if ( !req.user ||  permission.includes( req.user?.role ) === false) {
        throw new AppError( 'You do not have permission to access this resource', 403 );
    }
    next();
};