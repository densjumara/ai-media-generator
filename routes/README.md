# API Routes

This folder contains all API endpoint definitions.

## Files

- **photoRoutes.js** - Photo generation endpoints (7 routes)
  - `POST /api/photo/generate-dalle`
  - `POST /api/photo/generate-stability`
  - `POST /api/photo/generate-replicate`
  - `POST /api/photo/batch-generate`
  - `POST /api/photo/analyze`
  - `GET /api/photo/job/:jobId`
  - `GET /api/photo/models`

- **videoRoutes.js** - Video generation endpoints (6 routes)
  - `POST /api/video/generate-text-to-video`
  - `POST /api/video/generate-from-images`
  - `POST /api/video/generate-runway`
  - `GET /api/video/job/:jobId`
  - `GET /api/video/jobs`
  - `GET /api/video/models`

- **aiAnalysisRoutes.js** - Image analysis endpoints (6 routes)
  - `POST /api/analysis/image`
  - `POST /api/analysis/compare-images`
  - `POST /api/analysis/generate-prompt`
  - `POST /api/analysis/quality-score`
  - `POST /api/analysis/batch-analyze`
  - `POST /api/analysis/categorize-content`

- **statusRoutes.js** - Status monitoring endpoints (4 routes)
  - `GET /api/status/models`
  - `GET /api/status/health`
  - `GET /api/status/services`
  - `GET /api/status/usage`

## Total: 23 API Endpoints

## Creating New Routes

```javascript
import express from 'express';

const router = express.Router();

router.get('/endpoint', async (req, res) => {
  // Your logic here
  res.json({ success: true });
});

export default router;
```

Then mount in `server.js`:
```javascript
import newRoutes from './routes/newRoutes.js';
app.use('/api/new', newRoutes);
```
