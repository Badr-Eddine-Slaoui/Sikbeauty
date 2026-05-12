import Stripe       from "stripe";
import { config }   from "../config/index";

const stripe = new Stripe( config.payment_key, {
    apiVersion: "2025-12-15.clover",
});

export default stripe;
