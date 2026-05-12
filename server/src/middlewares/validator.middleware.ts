
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

export function validatorBody( schema : ZodSchema ) {
    return ( req : Request, res : Response, next : NextFunction) => {
        try {
            
            console.error( 'test', req.body );
            schema.parse( req.body );
            next();
        }
        catch ( error ) {
            if (error instanceof ZodError) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success : false,
                    errors  : error.flatten(),
                    error   : 'Invalid data',
                });

            }
            else 
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });

        }
    };
}

export function validatorParam( schema : ZodSchema ) {
    return ( req : Request, res : Response, next : NextFunction) => {
        try {
            console.error( req.params );
            schema.parse( req.params );
            next();
        }
        catch ( error ) {
            if (error instanceof ZodError) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success : false,
                    errors  : error.flatten(),
                    error   : 'Invalid data',
                });

            }
            else 
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });

        }
    };
}

export function validatorQuery( schema : ZodSchema ) {
    return ( req : Request, res : Response, next : NextFunction) => {
        try {
            console.error( req.query );
            schema.parse( req.query );
            next();
        }
        catch ( error ) {
            if (error instanceof ZodError) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    success : false,
                    errors  : error.flatten(),
                    error   : 'Invalid data',
                });

            }
            else 
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });

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
                message : 'At least one image is required',
            });
            return;
        }
        const images            =   files.images || [];
        const video             =   files.video?.[0] || null;
        // body.priceIndividual    =   parseFloat(body.priceIndividual); 
        // body.priceProfessional  =   parseFloat(body.priceProfessional); 
        body.price              =   parseFloat( body.price )
        body.discountType       =   body.discountType || null; 
        body.discount           =   parseFloat( body.discount ) || 0; 
        // body.stock              =   parseInt(body.stock, 10); 
        body.categoryId         =   parseInt(body.categoryId, 10); 
        // body.minQuantity        =   parseInt(body.minQuantity, 10); 
        req.body                =   { ...body };
        body.images             =   images;
        body.video              =   video;
        console.error( body )
        newProductSchemas.parse(body);
        await ensureDir('uploads/images');
        await ensureDir('uploads/videos');
        next();
    }
    catch ( error ) {
        if (error instanceof ZodError) {
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                errors: {
                    formErrors: [],
                    fieldErrors: error.flatten().fieldErrors,
                },
                error: 'Invalid data',
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
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
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                errors: {
                    formErrors: [],
                    fieldErrors: error.flatten().fieldErrors,
                },
                error: 'Invalid data',
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
}

export function validatVideoImage( req: Request, res: Response, next: NextFunction ) {
    try {
        const files    =   req.files as MulterFiles;
        if ( !files ) {
            res.status(StatusCodes.OK).json({
                status  : 'success',
                message : 'No changes were made',
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
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                errors: {
                    formErrors: [],
                    fieldErrors: error.flatten().fieldErrors,
                },
                error: 'Invalid data',
            });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
}
