import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { z }                    from 'zod';

extendZodWithOpenApi(z);

const role = z.enum(['Individual']);

export const blockedRoleEmails = ['admin', 'administrator', 'support', 'info', 'contact', 'sales', 'marketing', 'billing', 'finance', 'help', 'office', 'team', 'noreply', 'no-reply', 'donotreply', 'do-not-reply', 'webmaster', 'postmaster', 'abuse', 'security', 'feedback', 'customerservice', 'mailer-daemon', 'system', 'root'];

const passwordSchemas = z.string()
    .min(8, { message : 'password must contain 8 characters' })
    .max(32, { message : 'The maximum number of characters allowed in the password is 32' } )
    .superRefine((password, ctx) => {
        if (!/[A-Z]/.test(password)) {
            ctx.addIssue({
                message :	'Password must contain at least one uppercase letter',
                code	:	z.ZodIssueCode.custom,
            });
        }
        if (!/[a-z]/.test(password)) {
            ctx.addIssue({
                message :	'Password must contain at least one lower letter',
                code	:	z.ZodIssueCode.custom,
            });
        }
        if (!/[0-9]/.test(password)) {
            ctx.addIssue({
                message :	'Password must contain at least one number',
                code	:	z.ZodIssueCode.custom,
            });
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            ctx.addIssue({
                message :	'Password must contain at least one special character',
                code	:	z.ZodIssueCode.custom,
            });
        }
    });

export const registerSchemas = z.object({
    fullName : z.string()
        .min(1, 'Full name cannot be empty')
        .max(100, 'Full name must be less than 100 characters')
        .regex(/^[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ'-]+)*$/, 'Invalid full name format'),

    email   :   z.string()
        .email()
        .max(254)
        .refine((email) => {
            const domain = email.split('@')[1];
            return !blockedRoleEmails.includes(domain);
        }, {
        
            message: 'Please use a company or personal domain email, not a free email provider',
        }),
    
    phoneCountryCode: z.string()
        .regex(/^\+\d{1,4}$/, 'Country code must be + followed by 1 – 4 digits.')
        .trim(),
    phoneNumber: z.string()
        .min(4, 'Phone number is too short.')
        .max(20, 'Phone number is too long.')
        .regex(/^\d+$/, 'Phone number must contain only digits.')
        .trim(),

    country :   z.string()
        .min(2, 'Country name must be at least 2 characters long')
        .max(56, 'Country name must be no more than 56 characters long')
        .regex(/^[A-Za-z\s\-]+$/, 'Invalid country name format'),

    role    :   role,

    password    : passwordSchemas,
    confirmPassword : z.string()
        .min(1, { message : 'Please confirm your password' }),
    // jobTitle: z.string()
    //     .min(2, 'Job title must be at least 2 characters')
    //     .max(50, 'Job title must be at most 50 characters')
    //     .optional(),
    // companyName: z.string()
    //     .min(2, 'Company name must be at least 2 characters')
    //     .max(100, 'Company name must be at most 100 characters')
    //     .optional(),
}).strict()
    .superRefine((val, ctx) => {
        const countryCode = val.phoneCountryCode;
        const phone = parsePhoneNumberFromString( countryCode + val.phoneNumber );
        if ( !phone || !phone.isValid() ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Invalid phone number for this country.',
                path: ['phone'],
            });
        }
        if (val.password !== val.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Password is not the same as confirm password',
                path: ['confirmPassword'],
            });
        }
        // If role = Professional, both fields must not be empty
        // if (val.role === 'Professional') {
        //     if (!val.jobTitle || val.jobTitle.trim() === '') {
        //         ctx.addIssue({
        //             code: z.ZodIssueCode.custom,
        //             message: 'Job title is required for Professionals.',
        //             path: ['jobTitle'],
        //         });
        //     }
      
        //     if (!val.companyName || val.companyName.trim() === '') {
        //         ctx.addIssue({
        //             code: z.ZodIssueCode.custom,
        //             message: 'Company name is required for Professionals.',
        //             path: ['companyName'],
        //         });
        //     }
        // }
    });

export const loginSchema = z.object({
    email : z.string().email().min(5).max(254),
    password : z.string()
        .min(8)
        .max(32),
}).strict();

export const updatePasswordSchema = z.object({
    currentPassword: z.string()
        .min(1, { message: 'Current password is required' }),
    newPassword: passwordSchemas,
    confirmPassword: z.string()
        .min(1, { message: 'Please confirm your new password' }),
}).strict()
    .superRefine((val, ctx) => {
        if (val.newPassword !== val.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'New password and confirm password do not match',
                path: ['confirmPassword'],
            });
        }
        if (val.currentPassword === val.newPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'New password must be different from current password',
                path: ['newPassword'],
            });
        }
    });

export type Login           =  z.infer<typeof loginSchema>
export type Register        =  z.infer<typeof registerSchemas>
export type UpdatePassword  =  z.infer<typeof updatePasswordSchema>