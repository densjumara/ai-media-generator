# Middleware Functions

This folder contains Express middleware functions.

## Files

- **errorHandler.js** - Global error handling middleware
- **auth.js** - Authentication middleware (optional)
- **validation.js** - Input validation middleware

## Usage in server.js

```javascript
import errorHandler from './middleware/errorHandler.js';
import { validateInput } from './middleware/validation.js';

// Use middleware
app.use(validateInput);
app.use(errorHandler);
```

## Creating New Middleware

```javascript
export const myMiddleware = (req, res, next) => {
  // Your logic here
  next(); // Call next to continue
};
```
