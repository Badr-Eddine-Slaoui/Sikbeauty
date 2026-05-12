
import z                    from 'zod';

import { loginSchema, 
    registerSchemas }       from '../schemas/auth.schema';
import { registry }         from './setup';

registry.registerPath({
    method: 'post',
    path: '/api/v1/auth/register',
    description: 'Register new account',
    summary: 'New account',
    tags : ['Auth'],
    request : {
        body : {
            content : {
                'application/json' : {
                    schema : registerSchemas,
                },
            },
        },
    },
    responses : {
        201 : {
            description : 'Account created successfuly',
            content : {
                'application/json' : {
                    schema : z.object({
                        status : z.string(),
                        message : z.string(),
                    }),
                },
            },
        },
        404 : {
            description : 'Invalid data',
        },
    },
});

registry.registerPath({
    method: 'post',
    path: '/api/v1/auth/login',
    description: 'Login in platform',
    summary: 'Login',
    tags : ['Auth'],
    request : {
        body : {
            content : {
                'application/json' : {
                    schema : loginSchema,
                },
            },
        },
    },
    responses : {
        201 : {
            description : 'Log in platform successfully',
            content : {
                'application/json' : {
                    schema : z.object({
                        token  : z.string(),
                        user    : z.object({
                            id          :   z.number(),
                            fullName    :   z.string(),
                            email       :   z.string(),
                            phoneCountryCode:   z.string(),
                            phoneNumber     :   z.string(),
                            country     :   z.string(),
                            role        :   z.string(),
                        //     jobTitle    :   z.string(),
                        //     companyName : z.string(),
                        }),
                    }),
                },
            },
        },
        401 : {
            description : 'Unauthorized: The request requires user authentication or the provided credentials are invalid',
        },
        404 : {
            description : 'Invalid data',
        },
    },
});