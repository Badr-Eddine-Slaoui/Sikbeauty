import { NextFunction, 
    Request, 
    Response }          from 'express';
import { ZodError }     from 'zod';

import { CustomError }  from '../types';

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    _next: NextFunction ): void => {

        // Log errors for debugging
        console.error('Error occurred:', err);

        // Handle Zod validation errors that escaped middleware
        if (err instanceof ZodError) {
            const flattened = err.flatten();
            const firstFieldError = Object.values(flattened.fieldErrors).flat().filter(Boolean)[0] as string | undefined;
            const firstFormError = flattened.formErrors?.[0] as string | undefined;
            res.status(400).json({
                status: 'fail',
                message: firstFieldError || firstFormError || 'Données invalides.',
                errors: flattened,
            });
            return;
        }

        // Determine if it's an "operational" error (AppError) or unknown programming error
        const statusCode = err.statusCode ?? 500;
        const status = err.status ?? 'error';
      
        // If it's an operational error, send the message; otherwise, hide details
        const message =
          err.isOperational && err.message
            ? err.message
            : 'Une erreur inattendue est survenue. Veuillez réessayer.';
      
        res.status(statusCode).json({
          status,
          message,
          ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err,
          }),
        });
};
