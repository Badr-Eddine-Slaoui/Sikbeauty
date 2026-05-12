import { NextFunction,
    Request, 
    Response }          from 'express';

export const tryCatch = (controller : (req: Request, res: Response, next: NextFunction ) => Promise<unknown>)  => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await controller(req, res, next);
    } catch (err) {
        next(err);
    }
};