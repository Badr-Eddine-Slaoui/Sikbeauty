import { Router }                   from 'express';

import { GetLatestProducts }        from '../controllers/public.controller';
import { tryCatch }                 from '../middlewares/tryCatch.middleware';

const router = Router();

router.get('/', tryCatch( GetLatestProducts ));

export default router;