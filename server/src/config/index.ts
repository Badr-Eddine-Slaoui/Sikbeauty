
import 'dotenv/config'; 

import { Config } from '../types';

const config : Config = {
    port                :   Number( process.env.PORT) || 3000,
    databaseUrl         :   process.env.DATABASE_URL || '',
    nodeEnv             :   process.env.NODE_ENV as Config['nodeEnv']|| 'development',
    jwt_secret          :   process.env.JWT_SECRET || '',
    payment_key         :   process.env.STRIPE_SECRET_KEY || '',
    webhook_secret      :   process.env.STRIPE_WEBHOOK_SECRET || '',
    accessTokenExpiry   :   process.env.ACCESS_TOKEN_EXPIRY || '15m',
    refreshTokenExpiry  :   Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS) || 7,
};

export { config };
