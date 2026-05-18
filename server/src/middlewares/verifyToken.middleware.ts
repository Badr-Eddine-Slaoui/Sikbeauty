
import {     NextFunction,
    Request,
    Response }                 from 'express';
import jwt                     from 'jsonwebtoken';

import { config }              from '../config';
import { User }                from '../types';
import { AppError }            from '../utils/AppErros';

export const verifyToken = ( req : Request, res : Response, next : NextFunction ) => {
    // Read access token from Authorization header
    const authorization = req.headers.authorization;

    if ( !authorization ) {
        throw new AppError( 'Authorization header missing', 401);
    }

    const [ bearer, token ] = authorization.split(' ');

    if ( !bearer || bearer !== 'Bearer' || !token ) {
        throw new AppError('Invalid authorization format. Use: Bearer <token>', 401);
    }

    try {
        const decoded = jwt.verify( token, config.jwt_secret ) as User;
        req.user = {
            role        :   decoded.role,
            id          :   decoded.id,
            // currency    :   decoded.currency
        };
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError('Access token expired', 401);
        }
        throw new AppError('Invalid access token', 401);
    }
    next();
};

export const verifyTokenOptional = ( req : Request, res : Response, next : NextFunction ) => {
    // Read access token from Authorization header
    const authorization = req.headers.authorization;

    if ( !authorization ) {
        return next();
    }

    const [ bearer, token ] = authorization.split(' ');

    if ( !bearer || bearer !== 'Bearer' || !token ) {
        return next();
    }

    try {
        const decoded = jwt.verify( token, config.jwt_secret ) as User;
        req.user = {
            role        :   decoded.role,
            id          :   decoded.id,
        };
    }
    catch {
        return next();
    }

    next();
};