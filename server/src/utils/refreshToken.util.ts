import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Generate a cryptographically secure random refresh token
 * @returns {string} A random 64-character hex string
 */
export const generateRefreshToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash a refresh token for secure storage in database
 * @param {string} token - The plain refresh token
 * @returns {Promise<string>} The hashed token
 */
export const hashRefreshToken = async (token: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(token, salt);
};

/**
 * Verify a plain refresh token against a hashed token
 * @param {string} plainToken - The plain refresh token
 * @param {string} hashedToken - The hashed token from database
 * @returns {Promise<boolean>} True if tokens match
 */
export const verifyRefreshToken = async (
    plainToken: string,
    hashedToken: string
): Promise<boolean> => {
    return bcrypt.compare(plainToken, hashedToken);
};

/**
 * Calculate expiration date for refresh token
 * @param {number} days - Number of days until expiration (default: 30)
 * @returns {Date} The expiration date
 */
export const getRefreshTokenExpiry = ( days: number = 30 ): Date => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    return expiryDate;
};
