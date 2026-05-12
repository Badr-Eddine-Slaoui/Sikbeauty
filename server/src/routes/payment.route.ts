import express                  from "express";
import { createCheckoutSession } from "../controllers/payment.controller";
import { tryCatch }             from "../middlewares/tryCatch.middleware";
import { verifyToken }          from "../middlewares/verifyToken.middleware";
import { verifyPermission }     from "../middlewares/verifyPermission.middleware";
import { permissionRoles }      from "../utils/index";
import { validatorBody }        from "../middlewares/validator.middleware";
import { checkoutSessionPaymnetSchema } from "../schemas/payment.schema";

const router = express.Router();

router.post("/checkout", 
    verifyToken,
    verifyPermission( permissionRoles ),
    validatorBody( checkoutSessionPaymnetSchema ),
    tryCatch( createCheckoutSession ) 
);

export default router;
