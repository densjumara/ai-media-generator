# Configuration Files

This folder contains all application configuration files.

## Files

- **database.js** - Database connection settings
- **constants.js** - Application constants and configuration values

## Usage

```javascript
// In your files:
import config from './config/database.js';
import { API_TIMEOUT, MAX_FILE_SIZE } from './config/constants.js';
```

## Environment Variables

Configuration is managed via `.env` file in the root directory. Copy `.env.example` to `.env` and fill in your values.
