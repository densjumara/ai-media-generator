# Authentication Configuration

This folder contains authentication-related files.

## Files

- **authService.js** - Authentication service (email & Google)
- **authRoutes.js** - Authentication endpoints
- **jwtMiddleware.js** - JWT token verification

## Setup

1. Add authentication environment variables to `.env`
2. Install required packages: `npm install jsonwebtoken bcryptjs`
3. Setup Google OAuth credentials

## Environment Variables Required

```
JWT_SECRET=your_secret_key
JWT_EXPIRY=24h
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

## Usage

See authRoutes.js for endpoint documentation.
