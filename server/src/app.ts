import cookieParser     from 'cookie-parser';
import cors             from 'cors';
import express          from 'express';
import path             from 'path';

import { errorHandler }         from './middlewares/error.middleware';
import categoriesRouter         from './routes/admin.categories.route';
import productsRouter           from './routes/admin.products.route';
import authRouter               from './routes/auth.route';
import cartsRouter              from './routes/cart.cartItem.route';
import productCategoryRoute     from './routes/category.products.route';
import acceptCheckoutRouter     from './routes/checkout.route';
import ordersRouter             from './routes/order.orderItem.route';
import products                 from './routes/products.route';
import latestProducts           from './routes/public.route';
import userAddress              from './routes/user.address.route';
import userProfileRouter        from './routes/user.profile.route';
import adminBlogRouter          from './routes/admin.blog.route';
import blogRouter               from './routes/blog.route';
import paymentRoute             from './routes/payment.route';
import webhookRoute             from './routes/webhook.route';
import adminDashboardRouter     from './routes/admin.dashboard.route';
import adminUsersRouter         from './routes/admin.users.route';
import adminReportsRouter       from './routes/admin.reports.route';
import helmet                   from 'helmet';

const app = express();

app.use(
    "/webhooks/stripe",
    express.raw({ type: "application/json" }),
    webhookRoute
);

app.use(express.json());
app.use(cookieParser());

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    })
);

// Strong Content Security Policy
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],          // only your domain
            scriptSrc: ["'self'"],           // only JS from your domain
            // styleSrc: ["'self'", "'unsafe-inline'"], // allow inline styles if needed
            imgSrc: ["'self'", 'data:'],     // allow images from your domain or base64
            connectSrc: ["'self'"],          // only your API endpoints
            fontSrc: ["'self'"],             // only your fonts
            objectSrc: ["'none'"],           // block Flash / <object>
            frameSrc: ["'none'"],            // block iframes
            baseUri: ["'self'"],             // prevent base tag manipulation
            formAction: ["'self'"],          // prevent form submission to another site
        },
    })
);

// Other Helmet protections (optional but recommended)
app.use(helmet.xssFilter());           // adds X-XSS-Protection header
app.use(helmet.frameguard({ action: 'deny' })); // prevents clickjacking
app.use(helmet.hsts({ maxAge: 31536000 })); // enforce HTTPS (1 year)
app.use(helmet.noSniff());

// AUTH - Configure CORS to allow credentials
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use( '/api/v1/auth/', authRouter );

// CATEGORIES
app.use( '/api/v1/admin/categories', categoriesRouter );

// PUBLIC APIS
app.use(  '/api/v1/products/latest', latestProducts);

// PRODUCTS
app.use( '/api/v1/admin/products',   productsRouter);
app.use( '/api/v1/products',   products);

// PRODUCTS CATEGORY 
app.use( '/api/v1/categories', productCategoryRoute );

// CARTS 
app.use( '/api/v1/cart/items', cartsRouter );

// ORDERS
app.use( '/api/v1/cart/orders', ordersRouter );

// validate cart
app.use( '/api/v1/checkout', acceptCheckoutRouter );

// User address
app.use( '/api/v1/user/address',  userAddress );

// USER PROFILE
app.use( '/api/v1/user', userProfileRouter );

// BLOGS
app.use( '/api/v1/admin/blogs', adminBlogRouter );
app.use( '/api/v1/blogs', blogRouter );
app.use( '/api/v1/payment', paymentRoute );

// ADMIN DASHBOARD
app.use( '/api/v1/admin/dashboard', adminDashboardRouter );

// ADMIN USERS
app.use( '/api/v1/admin/users', adminUsersRouter );

// ADMIN REPORTS
app.use( '/api/v1/admin/reports', adminReportsRouter );

app.use(errorHandler);

export default app;