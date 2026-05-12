import { Router }           from 'express';
import { stripeWebhook }    from "../controllers/webhook.controller";

const router = Router();

router.post( "/", stripeWebhook );


export default router;