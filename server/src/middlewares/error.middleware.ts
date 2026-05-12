import { NextFunction, 
    Request, 
    Response }          from 'express';

import { CustomError }  from '../types';

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    _next: NextFunction ): void => {

        console.error(err);

        // Determine if it's an "operational" error (AppError) or unknown programming error
        const statusCode = err.statusCode ?? 500;
        const status = err.status ?? 'error';
      
        // If it's an operational error, send the message; otherwise, hide details
        const message =
          err.isOperational && err.message
            ? err.message
            : 'Something went wrong!';
      
        res.status(statusCode).json({
          status,
          message,
        });
};
