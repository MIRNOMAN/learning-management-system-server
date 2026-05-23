import { UserRoleEnum, UserStatus, OTPFor } from '@prisma/client';

// Login Request
export interface ILoginRequest {
  email: string;
  password: string;
}

// Register Request
export interface IRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  isAgreeWithTerms: boolean;
}

// Email Verification Request
export interface IVerifyEmailRequest {
  email: string;
  otp: string;
}

// Resend OTP Request
export interface IResendOtpRequest {
  email: string;
}

// Change Password Request
export interface IChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// Forget Password Request
export interface IForgetPasswordRequest {
  email: string;
}

// Verify Forgot Password OTP Request
export interface IVerifyForgotOtpRequest {
  email: string;
  otp: string;
}

// Reset Password Request
export interface IResetPasswordRequest {
  email: string;
  newPassword: string;
}

// Login Response
export interface ILoginResponse {
  id: string;
  role: UserRoleEnum;
  accessToken: string;
  isPaid?: boolean;
}

// Register Response
export interface IRegisterResponse {
  message: string;
  otp: string;
}

// Email Verification Response
export interface IVerifyEmailResponse {
  id: string;
  name: string;
  email: string;
  role: UserRoleEnum;
  accessToken: string;
}

// Resend OTP Response
export interface IResendOtpResponse {
  message: string;
  otp: string;
}

// Change Password Response
export interface IChangePasswordResponse {
  message: string;
}

// Forget Password Response
export interface IForgetPasswordResponse {
  message: string;
  otp: string;
}

// Verify Forgot Password OTP Response
export interface IVerifyForgotPassOtpResponse {
  resetToken: string;
  expireInMinutes: number;
}

// Reset Password Response
export interface IResetPasswordResponse {
  message: string;
}

// Refresh Token Response
export interface IRefreshTokenResponse {
  id: string;
  role: UserRoleEnum;
  accessToken: string;
  isPaid?: boolean;
}

// User Auth Payload
export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRoleEnum;
}
