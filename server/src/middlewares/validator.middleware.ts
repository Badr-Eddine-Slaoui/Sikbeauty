
import {     NextFunction, 
    Request, 
    Response }          from 'express';
import fs               from  'fs/promises';
import { StatusCodes }  from 'http-status-codes';
import { ZodError, 
    ZodSchema }         from 'zod';

import { imageSchema, 
    newProductSchemas, 
    schemaImageVideo }  from '../schemas/products.schema';
import { MulterFiles }  from '../types/interfaces';

/**
 * Extracts a user-friendly message from a ZodError.
 */
function extractZodMessage(error: ZodError): string {
    const flattened = error.flatten();
    const firstFieldError = Object.values(flattened.fieldErrors).flat().filter(Boolean)[0];
    const firstFormError = flattened.formErrors?.[0];
    return (firstFieldError as string) || (firstFormError as string) || 'Données invalides. Veuillez vérifier les champs.';
}

/**
 * Builds a standardised Zod-error response body.
 */
function zodErrorResponse(error: ZodError) {
    const flattened = error.flatten();
    return {
        status  : 'fail',
        message : extractZodMessage(error),
        errors  : flattened,
    };
}

export function validatorBody( schema : ZodSchema ) {
    return ( req : Request, res : Response, next : NextFunction) => {
        try {
            schema.parse( req.body );
            next();
        }
        catch ( error ) {
            if (error instanceof ZodError) {
                res.status(StatusCodes.BAD_REQUEST).json(zodErrorResponse(error));
            }
            else 
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'Une erreur inattendue est survenue.' });
        }
    };
}

export function validatorParam( schema : ZodSchema ) {
    return ( req : Request, res : Response, next : NextFunction) => {
        try {
            schema.parse( req.params );
            next();
        }
        catch ( error ) {
            if (error instanceof ZodError) {
                res.status(StatusCodes.BAD_REQUEST).json(zodErrorResponse(error));
            }
            else 
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'Une erreur inattendue est survenue.' });
        }
    };
}

export function validatorQuery( schema : ZodSchema ) {
    return ( req : Request, res : Response, next : NextFunction) => {
        try {
            schema.parse( req.query );
            next();
        }
        catch ( error ) {
            if (error instanceof ZodError) {
                res.status(StatusCodes.BAD_REQUEST).json(zodErrorResponse(error));
            }
            else 
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'Une erreur inattendue est survenue.' });
        }
    };
}

async function ensureDir(dir : string) {
    await fs.mkdir(dir, { recursive: true } );
}

export async function validateBeforeUpload(req: Request, res: Response, next: NextFunction) {
    try {
        const body              =   { ...req.body };
        const files             =   req.files as MulterFiles;
        if ( !files ) {
            res.status(StatusCodes.BAD_REQUEST).json({
                status  : 'fail',
                message : 'Au moins une image est requise',
            });
            return;
        }
        const images            =   files.images || [];
        const video             =   files.video?.[0] || null;
        body.price              =   parseFloat( body.price )
        body.discountType       =   body.discountType || null; 
        body.discount           =   parseFloat( body.discount ) || 0; 
        body.categoryId         =   parseInt(body.categoryId, 10); 
        req.body                =   { ...body };
        body.images             =   images;
        body.video              =   video;
        newProductSchemas.parse(body);
        await ensureDir('uploads/images');
        await ensureDir('uploads/videos');
        next();
    }
    catch ( error ) {
        if (error instanceof ZodError) {
            res.status(StatusCodes.BAD_REQUEST).json(zodErrorResponse(error));
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'Une erreur inattendue est survenue.' });
        }
    }
}

export async function validateImage(req: Request, res: Response, next: NextFunction) {
    try {
        imageSchema.parse(req.file);
        next();
    }
    catch ( error ) {
        if (error instanceof ZodError) {
            res.status(StatusCodes.BAD_REQUEST).json(zodErrorResponse(error));
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'Une erreur inattendue est survenue.' });
        }
    }
}

export function validatVideoImage( req: Request, res: Response, next: NextFunction ) {
    try {
        const files    =   req.files as MulterFiles;
        if ( !files ) {
            res.status(StatusCodes.OK).json({
                status  : 'success',
                message : 'Aucune modification effectuée',
            });
            return;
        }
        const body              =   {
            image : files.image?.[0] || null,
            video : files.video?.[0] || null,
        };
        schemaImageVideo.parse( body );
        next();
    }
    catch ( error ) {
        if (error instanceof ZodError) {
            res.status(StatusCodes.BAD_REQUEST).json(zodErrorResponse(error));
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'error', message: 'Une erreur inattendue est survenue.' });
        }
    }
}
