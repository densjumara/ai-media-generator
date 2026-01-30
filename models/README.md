# Data Models

This folder contains data model definitions and schemas.

## Files

- **Job.js** - Job model for tracking generation jobs
- **User.js** - User model (optional, for authentication)
- **Generation.js** - Generation history model

## Example: Job Model

```javascript
// models/Job.js
export class Job {
  constructor(id, type, prompt, status) {
    this.id = id;
    this.type = type;
    this.prompt = prompt;
    this.status = status;
    this.createdAt = new Date();
  }
}
```

## Usage

```javascript
import { Job } from './models/Job.js';

const job = new Job(uuid(), 'photo', 'A sunset', 'processing');
```

## Database Schema (if using database)

If you add a database, define schemas here and use in services.

```javascript
// For MongoDB, Postgres, etc.
// Define schemas/models in this folder
```
