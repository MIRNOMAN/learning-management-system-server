import { UserRoleEnum } from '@prisma/client';
import z from 'zod';

const loginUser = z.object({
  body: z
    .object({
      email: z
        .string({
          error: 'Email is required!',
        })
        .email({
          message: 'Invalid email format!',
        }),
      password: z
        .string({
          error: 'Password is required!',
        })
        .min(6, {
          message: 'Password must be at least 6 characters!',
        }),
    })
    .strict(),
});

const registerUser = z.object({
  body: z
    .object({
      firstName: z
        .string({
          error: 'First Name is required!',
        })
        .min(2, {
          message: 'First name must be at least 2 characters!',
        }),
      lastName: z
        .string({
          error: 'Last Name is required!',
        })
        .min(2, {
          message: 'Last name must be at least 2 characters!',
        }),
      email: z
        .string({
          error: 'Email is required!',
        })
        .email({
          message: 'Invalid email format!',
        }),
      phoneNumber: z
        .string({
          error: 'Phone Number is required!',
        })
        .regex(
          /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
          {
            message: 'Invalid phone number format!',
          },
        ),
      isAgreeWithTerms: z.boolean().refine(val => val === true, {
        message: 'You must agree to the terms and conditions',
      }),
      password: z
        .string({
          error: 'Password is required!',
        })
        .min(6, {
          message: 'Password must be at least 6 characters!',
        }),
    })
    .strict(),
});

const verifyEmail = z.object({
  body: z
    .object({
      email: z
        .string({
          error: 'Email is required!',
        })
        .email({
          message: 'Invalid email format!',
        }),
      otp: z
        .string({
          error: 'OTP is required!',
        })
        .length(6, {
          message: 'OTP must be exactly 6 digits!',
        }),
    })
    .strict(),
});

const resendOtp = z.object({
  body: z
    .object({
      email: z
        .string({
          error: 'Email is required!',
        })
        .email({
          message: 'Invalid email format!',
        }),
    })
    .strict(),
});

const changePassword = z.object({
  body: z
    .object({
      oldPassword: z
        .string({
          error: 'Old password is required!',
        })
        .min(6, {
          message: 'Password must be at least 6 characters!',
        }),
      newPassword: z
        .string({
          error: 'New password is required!',
        })
        .min(6, {
          message: 'New password must be at least 6 characters!',
        }),
    })
    .refine(data => data.oldPassword !== data.newPassword, {
      message: 'New password must be different from old password!',
      path: ['newPassword'],
    })
    .strict(),
});

const forgetPassword = z.object({
  body: z
    .object({
      email: z
        .string({
          error: 'Email is required!',
        })
        .email({
          message: 'Invalid email format!',
        }),
    })
    .strict(),
});

const verifyForgotOtp = z.object({
  body: z
    .object({
      email: z
        .string({
          error: 'Email is required!',
        })
        .email({
          message: 'Invalid email format!',
        }),
      otp: z
        .string({
          error: 'OTP is required!',
        })
        .length(6, {
          message: 'OTP must be exactly 6 digits!',
        }),
    })
    .strict(),
});

const resetPassword = z.object({
  body: z
    .object({
      email: z
        .string({
          error: 'Email is required!',
        })
        .email({
          message: 'Invalid email format!',
        }),
      newPassword: z
        .string({
          error: 'New password is required!',
        })
        .min(6, {
          message: 'New password must be at least 6 characters!',
        }),
    })
    .strict(),
});

export const authValidation = {
  loginUser,
  registerUser,
  verifyEmail,
  resendOtp,
  changePassword,
  forgetPassword,
  verifyForgotOtp,
  resetPassword,
};
