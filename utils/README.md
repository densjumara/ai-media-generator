# Utility Functions

This folder contains helper and utility functions.

## Files

- **logger.js** - Logging and debugging utilities
- **validators.js** - Input validation helpers
- **formatters.js** - Data formatting and transformation

## Usage Examples

```javascript
// logger.js
import logger from './utils/logger.js';
logger.info('Message');
logger.error('Error');

// validators.js
import { validateEmail, validateUrl } from './utils/validators.js';
if (!validateEmail(email)) throw new Error('Invalid email');

// formatters.js
import { formatBytes, formatTime } from './utils/formatters.js';
console.log(formatBytes(1024)); // "1 KB"
```

## Creating New Utilities

1. Add function to appropriate file
2. Export it
3. Import where needed

```javascript
// utils/helpers.js
export function myHelper(param) {
  // Implementation
  return result;
}
```
