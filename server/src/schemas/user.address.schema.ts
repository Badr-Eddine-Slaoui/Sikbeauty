import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { z }                    from 'zod';

extendZodWithOpenApi(z);


export const userAddressSchema = z.object({
    fullName: z.string()
        .min(3, 'Full name must be at least 3 characters.')
        .max(80, 'Full name must be less than 80 characters.')
        .trim(),
    email: z.string()
        .email('Invalid email address.')
        .max(100, 'Email must be less than 100 characters.')
        .trim(),
    phoneCountryCode: z.string()
        .regex(/^\+\d{1,4}$/, 'Country code must be + followed by 1 – 4 digits.')
        .trim(),
    phoneNumber: z.string()
        .min(4, 'Phone number is too short.')
        .max(20, 'Phone number is too long.')
        .regex(/^\d+$/, 'Phone number must contain only digits.')
        .trim(),
    street: z.string()
        .min(3, 'Street must be at least 3 characters.')
        .max(120, 'Street must be less than 120 characters.')
        .trim(),
    city: z.string()
        .min(2, 'City must be at least 2 characters.')
        .max(80, 'City must be less than 80 characters.')
        .trim(),
    state: z.string()
        .min(2, 'State must be at least 2 characters.')
        .max(80, 'State must be less than 80 characters.')
        .trim(),
    postalCode: z.string()
        .optional(),
    country: z
        .string()
        .min(2, 'Country is required.')
        .max(56, 'Country name must be less than 56 characters.')
        .trim(),
}).strict()
    .superRefine( (val, ctx ) => {
        const countryCode = val.phoneCountryCode;
        const phone = parsePhoneNumberFromString( countryCode + val.phoneNumber );
        if ( !phone || !phone.isValid() ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid phone number for this country.',
                path: ['phone'],
            });
        }
    });

export const upadateUserAddressSchema = z.object({
    fullName: z.string()
        .min(3, 'Full name must be at least 3 characters.')
        .max(80, 'Full name must be less than 80 characters.')
        .trim()
        .optional(),
  
    email: z.string()
        .email('Invalid email address.')
        .max(100, 'Email must be less than 100 characters.')
        .trim()
        .optional(),
  
    phoneCountryCode: z.string()
        .regex(/^\+\d{1,4}$/, 'Country code must be + followed by 1 – 4 digits.')
        .trim()
        .optional(),
  
    phoneNumber: z.string()
        .min(4, 'Phone number is too short.')
        .max(20, 'Phone number is too long.')
        .regex(/^\d+$/, 'Phone number must contain only digits.')
        .trim()
        .optional(),
  
    street: z.string()
        .min(3, 'Street must be at least 3 characters.')
        .max(120, 'Street must be less than 120 characters.')
        .trim()
        .optional(),
  
    city: z.string()
        .min(2, 'City must be at least 2 characters.')
        .max(80, 'City must be less than 80 characters.')
        .trim()
        .optional(),
  
    state: z.string()
        .min(2, 'State must be at least 2 characters.')
        .max(80, 'State must be less than 80 characters.')
        .trim()
        .optional(),
  
    postalCode: z.string()
        .optional(),
    country: z.string()
        .min(2, 'Country is required.')
        .max(56, 'Country name must be less than 56 characters.')
        .trim()
        .optional(),
}).strict()
    .superRefine( (val, ctx ) => {
        const countryCode = val.phoneCountryCode;
        const phoneNumber = val.phoneNumber;
        if ( countryCode &&  phoneNumber) {
            const phone = parsePhoneNumberFromString( countryCode + val.phoneNumber );
            if ( !phone || !phone.isValid() ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Invalid phone number for this country.',
                    path: ['phone'],
                });
            }
        }
        else if ( !countryCode && phoneNumber || countryCode && !phoneNumber) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Country code and phone number must be entered together',
                path: ['phone'],
            });
        }
    });

export const responseUserAddress = z.object({
    id                : z.number()
        .gte(1),
    fullName          : z.string(),
    email             : z.string(),
    userId            : z.number()
        .gte(1),
    phoneNumber       : z.string(),
    phoneCountryCode  : z.string(),
    street            : z.string(),
    city              : z.string(),
    state             : z.string(),
    postalCode        : z.string(),
    country           : z.string(),
    createdAt         : z.string(),
    updatedAt         : z.string(),
}).strict();

export type UserAddress = z.infer<typeof userAddressSchema>
export type UpdateUserAddress = z.infer<typeof upadateUserAddressSchema>