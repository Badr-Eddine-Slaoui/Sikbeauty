import bcrypt       from 'bcryptjs';

import prisma       from '../db/setup';
import { Register } from '../schemas/auth.schema';


export const userByEmail = async ( email : string) => (
    await prisma.user.findFirst({
        where : {
            email,
        },
    })
);
enum Roles {
    admin   = 'admin',
    company = 'company',
    basic   = 'basic',
}
export const createNewUser = async ( body : Register, type : boolean ) => {
    
    const hashPassword = await bcrypt.hash( body.password, 10 );
    if ( type == true ) {
        return await prisma.user.create({
            data : {
                password        :   hashPassword,
                fullName        :   body.fullName,
                email           :   body.email,
                country         :   body.country,
                phoneNumber     :   body.phoneNumber,
                phoneCountryCode:   body.phoneCountryCode,
                role            :   Roles.admin,
                isEmailVerified :   true,
                // jobTitle        :  null,
                // companyName     :   null,
            },
        });
    }
    else {
        return await prisma.user.create({
            data : {
                password        :   hashPassword,
                fullName        :   body.fullName,
                email           :   body.email,
                country         :   body.country,
                phoneNumber     :   body.phoneNumber,
                phoneCountryCode:   body.phoneCountryCode,
                role            :   body.role,
                // jobTitle        :   body.role === 'Professional' ? body.jobTitle : null,
                // companyName     :   body.role === 'Professional' ? body.companyName : null,
                isEmailVerified : true, // you must deleted ?????????????????
            },
        });
    };
};

// export const loginService = async ( body ) => {

// }