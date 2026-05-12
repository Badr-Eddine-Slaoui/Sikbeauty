
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

export const checkDataBaseConnection = async ( ) => {
    try {
        await prisma.$connect();
        console.error( 'Successfully connected to the PostgreSQL database' );
    }
    catch ( error ) {
        if ( error instanceof Error ) {
            console.error( error.message );
            process.exit( 1 );
        }
    }
};

export default prisma;