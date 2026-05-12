import bcrypt           from 'bcryptjs';
import { Request, 
    Response }          from 'express';
import jwt              from 'jsonwebtoken';

import { config }       from '../config';
import prisma           from '../db/setup';
import { Login, 
    Register,
    UpdatePassword,
}                       from '../schemas/auth.schema';
import { createNewUser, 
    userByEmail }       from '../services/auth.service';
import { createRefreshToken, 
    findValidRefreshToken,
    revokeRefreshTokenByValue,
    revokeAllUserRefreshTokens } from '../services/refreshToken.service';
import { AppError }     from '../utils/AppErros';

export const register = async ( req : Request<{}, {}, Register >, res : Response ) => {
    // Body 
    let body = req.body;
    let newUser;
    // admin account is exist
    const adminExists = await prisma.user.findFirst({
        where: {
            role: 'admin',
        },
    });
    if ( !adminExists ) {
        newUser = await createNewUser( body, true );
    }
    else {
        // Find user using email
        const user = await userByEmail( body.email );
        if ( user ) {
            throw new AppError( 'User already exist', 409 );
        }
        // save data in db 
        newUser = await createNewUser( body, false);
    }
    
    // Generate short-lived access token
    const payload = {
        role: newUser.role,
        id: newUser.id,
    };
    const accessToken = jwt.sign(payload, config.jwt_secret, {
        expiresIn: config.accessTokenExpiry, // 15 minutes
    } as jwt.SignOptions);
    
    // Generate long-lived refresh token and store in database
    const { plainToken: refreshToken } = await createRefreshToken(
        newUser.id,
        config.refreshTokenExpiry // 30 days
    );
    
    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,//process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: config.refreshTokenExpiry * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth/refresh',
    });
    
    res.status( 201 ).json({
        'status' : 'success',
        message : 'Account created successfully',
        accessToken, // Send access token in response body
        user: {
            id: newUser.id,
            fullName: newUser.fullName,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            phoneCountryCode: newUser.phoneCountryCode,
            country: newUser.country,
            role: newUser.role,
        },
    });
};

export const login = async ( req : Request<{}, {}, Login>, res : Response ) => {

    // Check user is exist in db using db 
    const user = await userByEmail( req.body.email );
    //  -> false = return 401 "Invalid email or password"
    if (!user ) {
        throw new AppError( 'Invalid email or password', 401 );
    }
    // Check crediencile is correct 
    const passwordCompare = await bcrypt.compare( req.body.password, user.password );
    // -> false = return 401 "Invalid email or password"
    if ( !passwordCompare ) {
        throw new AppError( 'Invalid email or password', 401 );
    }
    // Generate short-lived access token
    const payload = {
        role        :   user.role,
        id          :   user.id,
    };
    const accessToken = jwt.sign(payload, config.jwt_secret, {
        expiresIn: config.accessTokenExpiry, // 15 minutes
    } as jwt.SignOptions);
    
    // Generate long-lived refresh token and store in database
    const { plainToken: refreshToken } = await createRefreshToken(
        user.id,
        config.refreshTokenExpiry // 30 days
    );
    
    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,//process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: config.refreshTokenExpiry * 24 * 60 * 60 * 1000,
        path: '/api/v1/auth/refresh'
    });

    // Return access token and user data
    res.status(200).json({
        accessToken, // Send access token in response body
        user : {
            id              :   user.id,
            fullName        :   user.fullName,
            email           :   user.email,
            phoneNumber     :   user.phoneNumber,
            phoneCountryCode:   user.phoneCountryCode,
            country         :   user.country,
            role            :   user.role,
        },
    });

};

export const refreshAccessToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    console.error( "hello test", req.cookies )
    if (!refreshToken) {
      throw new AppError("Refresh token not found", 401);
    }
  
    const tokenRecord = await findValidRefreshToken(refreshToken);
  
    if (!tokenRecord) {
      res.clearCookie("refreshToken");
      throw new AppError("Invalid or expired refresh token", 401);
    }
  
    const payload = {
      id: tokenRecord.user.id,
      role: tokenRecord.user.role,
    };
  
    const accessToken = jwt.sign(payload, config.jwt_secret, {
      expiresIn: config.accessTokenExpiry, // e.g. 15m
    } as jwt.SignOptions );
  
    res.status(200).json({ accessToken });
  };
  
export const logout = async ( req : Request, res : Response ) => {
    const refreshToken = req.cookies.refreshToken;

    // Revoke the refresh token if it exists
    if (refreshToken) {
        await revokeRefreshTokenByValue(refreshToken);
    }

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,//process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/v1/auth/refresh'
    });

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
    });
};

export const updatePassword = async ( req : Request<{}, {}, UpdatePassword>, res : Response ) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Get user from database
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });

    // Revoke all refresh tokens for this user (force re-login on all devices)
    await revokeAllUserRefreshTokens(userId);

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,//process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/v1/auth/refresh'
    });

    res.status(200).json({
        status: 'success',
        message: 'Password updated successfully. Please login again.',
    });
};