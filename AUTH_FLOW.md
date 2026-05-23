# Authentication Flow Documentation

## Overview

Complete OTP-based authentication system with email verification, password reset, and token refresh functionality.

---

## Authentication Endpoints

### 1. **User Registration**

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "firstName": "string (min: 2 chars)",
  "lastName": "string (min: 2 chars)",
  "email": "valid email",
  "phoneNumber": "valid phone number",
  "password": "string (min: 6 chars)",
  "isAgreeWithTerms": true
}
```

**Response (201 Created):**

```json
{
  "statusCode": 201,
  "message": "User Register Successfully. Check your mail to verify",
  "data": {
    "message": "Please check your Email to verify your account",
    "otp": "123456"
  }
}
```

**Validation Rules:**

- First & Last Name: Minimum 2 characters
- Email: Valid email format
- Phone: Valid international phone format
- Password: Minimum 6 characters
- Terms: Must be agreed (true)

---

### 2. **Email Verification (OTP)**

**Endpoint:** `POST /auth/verify-email`

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200 OK):**

```json
{
  "statusCode": 200,
  "message": "Email verified successfully",
  "data": {
    "id": "user-uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "USER",
    "accessToken": "jwt-token"
  }
}
```

**Flow:**

1. User receives OTP via email after registration
2. OTP is valid for a limited time (configurable)
3. After successful verification, user gets access token

---

### 3. **Resend Verification OTP**

**Endpoint:** `POST /auth/resend-verification-otp`

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**

```json
{
  "statusCode": 200,
  "message": "Verification OTP sent successfully. Please check your email.",
  "data": {
    "message": "Verify Otp has sent to your email",
    "otp": "123456"
  }
}
```

**Conditions:**

- User must exist
- User must not already be verified
- User must not be blocked or deleted

---

### 4. **User Login**

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": {
    "id": "user-uuid",
    "role": "USER",
    "accessToken": "jwt-token",
    "isPaid": false
  }
}
```

**Login Flow:**

1. Validate email and password
2. If user not verified, automatically send OTP for verification
3. If verified, return access token
4. Check user account status (not deleted, not blocked)

---

### 5. **Forgot Password - Request OTP**

**Endpoint:** `POST /auth/forget-password`

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**

```json
{
  "statusCode": 200,
  "message": "Password reset OTP sent to your email",
  "data": {
    "message": "Verification otp sent successfully. Please check your inbox.",
    "otp": "123456"
  }
}
```

**Conditions:**

- User must be email verified
- User must not be deleted or blocked

---

### 6. **Forgot Password - Verify OTP**

**Endpoint:** `POST /auth/verify-forgot-password-otp`

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200 OK):**

```json
{
  "statusCode": 200,
  "message": "OTP verified successfully",
  "data": {
    "resetToken": "jwt-reset-token",
    "expireInMinutes": 5
  }
}
```

**Important:**

- Reset token is valid for 5 minutes
- Token must be passed in Authorization header for password reset
- OTP is one-time use only

---

### 7. **Reset Password**

**Endpoint:** `POST /auth/reset-password`

**Headers:**

```
Authorization: Bearer <resetToken>
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "newPassword": "newpassword123"
}
```

**Response (200 OK):**

```json
{
  "statusCode": 200,
  "message": "Password reset successfully",
  "data": {
    "message": "Password reset successfully"
  }
}
```

**Validation:**

- Reset token must be valid and not expired
- Token email must match request email
- New password must be at least 6 characters

---

### 8. **Change Password (Authenticated)**

**Endpoint:** `PATCH /auth/change-password`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Request Body:**

```json
{
  "oldPassword": "currentpassword123",
  "newPassword": "newpassword123"
}
```

**Response (200 OK):**

```json
{
  "statusCode": 200,
  "message": "Password changed successfully",
  "data": {
    "message": "Password changed successfully!"
  }
}
```

**Validation:**

- Old password must match current password
- New password must be different from old password
- Both passwords must be at least 6 characters

---

### 9. **Refresh Token (Authenticated)**

**Endpoint:** `POST /auth/refresh-token`

**Headers:**

```
Authorization: Bearer <accessToken>
```

**Response (200 OK):**

```json
{
  "statusCode": 200,
  "message": "Token Refresh Successfully",
  "data": {
    "id": "user-uuid",
    "role": "USER",
    "accessToken": "new-jwt-token",
    "isPaid": false
  }
}
```

---

## User Account States

| State        | Description       | Actions Available |
| ------------ | ----------------- | ----------------- |
| **ACTIVE**   | Normal account    | All operations    |
| **INACTIVE** | Disabled account  | Read-only         |
| **BLOCKED**  | Suspended account | No access         |
| **DELETED**  | Soft deleted      | Contact support   |

---

## OTP Types

| OTP Type              | Usage                            | Validity   |
| --------------------- | -------------------------------- | ---------- |
| **USER_VERIFICATION** | Email verification during signup | 10 minutes |
| **FORGOT_PASSWORD**   | Password reset flow              | 10 minutes |

---

## Security Features

✅ **Password Security:**

- Bcrypt hashing with salt rounds (12)
- Password minimum length validation (6 chars)
- Password confirmation in change/reset flows

✅ **OTP Security:**

- 6-digit numeric OTP
- Time-based expiry (10 minutes)
- One-time use only
- Rate limiting on resend

✅ **Token Security:**

- JWT-based access tokens
- Configurable expiry time
- Reset tokens with short lifetime (5 mins)
- Email verification required for sensitive operations

✅ **Account Protection:**

- Email uniqueness validation
- Phone number uniqueness validation
- Soft delete mechanism
- Account blocking capability

---

## Error Handling

### Common Error Responses:

**400 Bad Request:**

```json
{
  "statusCode": 400,
  "message": "Invalid email format!"
}
```

**401 Unauthorized:**

```json
{
  "statusCode": 401,
  "message": "Invalid token"
}
```

**403 Forbidden:**

```json
{
  "statusCode": 403,
  "message": "Account has been blocked"
}
```

**404 Not Found:**

```json
{
  "statusCode": 404,
  "message": "User not found"
}
```

**409 Conflict:**

```json
{
  "statusCode": 409,
  "message": "User already exists with the email"
}
```

---

## Complete Auth Flow Diagram

```
REGISTRATION FLOW:
1. User Signup (POST /auth/register)
   ↓
2. OTP sent to email
   ↓
3. Verify Email (POST /auth/verify-email)
   ↓
4. Account activated, access token issued

LOGIN FLOW:
1. User Login (POST /auth/login)
   ↓
2. If not verified → Resend OTP
   ↓
3. If verified → Return access token

PASSWORD RESET FLOW:
1. Request Reset (POST /auth/forget-password)
   ↓
2. OTP sent to email
   ↓
3. Verify OTP (POST /auth/verify-forgot-password-otp)
   ↓
4. Get reset token (5 min valid)
   ↓
5. Reset Password (POST /auth/reset-password)
   ↓
6. Password updated, login again
```

---

## Type Definitions

All TypeScript interfaces are defined in `auth.interface.ts`:

- `ILoginRequest` - Login request payload
- `IRegisterRequest` - Registration request payload
- `IVerifyEmailRequest` - Email verification request
- `IChangePasswordRequest` - Password change request
- `IForgetPasswordRequest` - Forget password request
- `IResetPasswordRequest` - Password reset request
- `ILoginResponse` - Login response with token
- `IVerifyEmailResponse` - Verification response
- Plus response interfaces for all endpoints

---

## Environment Configuration

Required in `.env`:

```
JWT_ACCESS_SECRET=your-secret-key
JWT_ACCESS_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=12
OTP_EXPIRY_TIME=10m
```

---

## Testing with Postman

Import the provided `Template-API.postman_collection.json` file to test all endpoints.

---

## Notes

- All timestamps are in UTC
- All responses follow standard format with statusCode, message, and data
- All requests require proper validation before processing
- Email notifications are sent for OTP and important actions
- User data is soft-deleted (marked as deleted, not removed from DB)
