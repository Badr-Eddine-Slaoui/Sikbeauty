import prisma from '../db/setup';
import { 
    generateRefreshToken, 
    hashRefreshToken, 
    verifyRefreshToken,
    getRefreshTokenExpiry 
} from '../utils/refreshToken.util';

/**
 * Create a new refresh token for a user
 * @param userId - The user's ID
 * @param expiryDays - Number of days until token expires (default: 30)
 * @returns Object containing the plain token and database record
 */
export const createRefreshToken = async (
    userId: number,
    expiryDays: number = 30
  ) => {
    const tokenId = crypto.randomUUID();
    const plainToken = generateRefreshToken();
    const tokenHash = await hashRefreshToken(plainToken);
    const expiresAt = getRefreshTokenExpiry(expiryDays);
    // const secret = crypto.randomBytes(64).toString("hex");
  
    // const tokenHash = await hashRefreshToken(secret);
  
    // const expiresAt = new Date(
    //   Date.now() + expiryDays * 24 * 60 * 60 * 1000
    // );
  
    const refreshToken = await prisma.refreshToken.create({
      data: {
        id: tokenId,
        userId,
        tokenHash,
        expiresAt,
      },
    });
  
    // what client stores
    return {
        plainToken: `${tokenId}.${plainToken}`,
        refreshToken,
      };
    // return `${tokenId}.${secret}`;
  };

/**
 * Find a refresh token by its hash and verify it's valid
 * @param plainToken - The plain refresh token
 * @returns The refresh token record if valid, null otherwise
 */
// export const findValidRefreshToken = async (plainToken: string) => {
//     // Get all non-revoked tokens (we need to check hash against all)
//     const tokens = await prisma.refreshToken.findMany({
//         where: {
//             revokedAt: null,
//             expiresAt: {
//                 gt: new Date(), // Not expired
//             },
//         },
//         include: {
//             user: true,
//         },
//     });

//     // Find the matching token by comparing hashes
//     for (const token of tokens) {
//         const isValid = await verifyRefreshToken(plainToken, token.tokenHash);
//         if (isValid) {
//             return token;
//         }
//     }

//     return null;
// };

export const findValidRefreshToken = async (plainToken: string) => {
    const [tokenId, secret] = plainToken.split(".");
  
    if (!tokenId || !secret) return null;
  
    const token = await prisma.refreshToken.findUnique({
      where: { id: tokenId },
      include: { user: true },
    });
  
    if (!token) return null;
    if (token.revokedAt) return null;
    if (token.expiresAt < new Date()) return null;
  
    const isValid = await verifyRefreshToken(secret, token.tokenHash);
    if (!isValid) return null;
  
    return token;
  };
/**
 * Revoke a specific refresh token
 * @param tokenId - The refresh token ID
 */
export const revokeRefreshToken = async (tokenId: string) => {
    return prisma.refreshToken.update({
        where: { id: tokenId },
        data: { revokedAt: new Date() },
    });
};

/**
 * Revoke a refresh token by its plain value
 * @param plainToken - The plain refresh token
 */
export const revokeRefreshTokenByValue = async (plainToken: string) => {
    const token = await findValidRefreshToken(plainToken);
    if (token) {
        return revokeRefreshToken(token.id);
    }
    return null;
};

/**
 * Revoke all refresh tokens for a user
 * @param userId - The user's ID
 */
export const revokeAllUserRefreshTokens = async (userId: number) => {
    return prisma.refreshToken.updateMany({
        where: {
            userId,
            revokedAt: null,
        },
        data: {
            revokedAt: new Date(),
        },
    });
};

/**
 * Clean up expired and revoked tokens (can be run periodically)
 * @param daysOld - Delete tokens older than this many days (default: 90)
 */
export const cleanupOldRefreshTokens = async (daysOld: number = 90) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return prisma.refreshToken.deleteMany({
        where: {
            OR: [
                { expiresAt: { lt: new Date() } }, // Expired
                { revokedAt: { lt: cutoffDate } }, // Revoked and old
            ],
        },
    });
};
