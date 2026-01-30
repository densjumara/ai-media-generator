# System Architecture & Implementation Guide

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (HTML/CSS/JS)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ Photo Tab    │  │ Video Tab    │  │ Gallery & Settings
│  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘   │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                     │
          ┌──────────▼──────────┐
          │  Express.js Server  │
          │    (Node.js)        │
          └──────────┬──────────┘
                     │
      ┌──────────────┼──────────────┐
      │              │              │
 ┌────▼────┐  ┌─────▼──────┐  ┌────▼─────┐
 │ Routes  │  │  Services  │  │ Middleware
 ├─────────┤  ├────────────┤  ├──────────┐
 │Photo RT │  │ AIService  │  │ CORS     │
 │Video RT │  │ (Central)  │  │ Auth     │
 │Analysis │  │            │  │ Logging  │
 └─────────┘  └─────┬──────┘  └──────────┘
                    │
       ┌────────────┼────────────┐
       │            │            │
   ┌───▼───┐   ┌────▼────┐   ┌──▼──┐
   │OpenAI │   │Stability │  │Repli
   │ API   │   │   AI     │  │cate │
   └───────┘   └──────────┘  └──────┘
   - DALL-E 3  - SDXL       - Multiple
   - GPT-4V     - Stable DM  - Models
   - Chat API   - Real-Time
```

## 📁 Project Structure

```
Aplikasi VIDEO AI/
├── package.json                 # Dependencies & scripts
├── server.js                    # Main server entry point
├── .env.example                 # Environment template
├── README.md                    # Full documentation
├── QUICK_START.md              # Quick start guide
├── ARCHITECTURE.md             # This file
│
├── services/
│   ├── aiService.js           # Central AI service hub
│   ├── photoService.js        # Photo processing
│   ├── videoService.js        # Video processing
│   ├── analysisService.js     # Image analysis
│   └── cacheService.js        # Caching layer
│
├── routes/
│   ├── photoRoutes.js         # POST /api/photo/*
│   ├── videoRoutes.js         # POST /api/video/*
│   ├── aiAnalysisRoutes.js    # POST /api/analysis/*
│   └── statusRoutes.js        # GET /api/status/*
│
├── middleware/
│   ├── auth.js                # Authentication
│   ├── errorHandler.js        # Error handling
│   ├── rateLimit.js           # Rate limiting
│   └── logging.js             # Request logging
│
├── public/
│   ├── index.html             # Main frontend
│   ├── css/
│   │   └── styles.css         # Styling
│   └── js/
│       ├── main.js            # Core logic
│       ├── photo.js           # Photo functions
│       ├── video.js           # Video functions
│       └── api.js             # API client
│
├── uploads/                   # Generated files
│   ├── photos/
│   ├── videos/
│   └── temp/
│
└── config/
    ├── database.js            # DB config (optional)
    ├── cache.js               # Cache config
    └── constants.js           # Constants
```

## 🔄 Data Flow

### Photo Generation Flow
```
User Input (Prompt)
    ↓
[Frontend Validation]
    ↓
POST /api/photo/generate-dalle
    ↓
AIService.generateImageWithDallE()
    ↓
OpenAI API Call (DALL-E 3)
    ↓
Response Processing
    ↓
Generate Job ID & Store in Map
    ↓
Return to Frontend with URL
    ↓
Display Image + Options (Download/Share/Analyze)
    ↓
User Downloads or Analyzes
```

### Video Generation Flow
```
User Input (Text + Parameters)
    ↓
[Frontend Validation]
    ↓
POST /api/video/generate-text-to-video
    ↓
Create Video Job
    ↓
Queue for Processing (Async)
    ↓
AIService.generateVideoFromText()
    ↓
Generate Video Concept (GPT-4)
    ↓
Queue Runway/Alternative Service
    ↓
Poll Status Periodically
    ↓
Return Job ID to User
    ↓
Frontend Polls /api/video/job/:jobId
    ↓
When Complete: Return Video URL
    ↓
Display Video + Options
```

### Image Analysis Flow
```
User Input (Image URL + Analysis Type)
    ↓
[Validation]
    ↓
POST /api/analysis/image
    ↓
AIService.analyzeMedia(url, type)
    ↓
GPT-4V API Call with Image
    ↓
Vision Model Analyzes
    ↓
Return Detailed Analysis
    ↓
Display Results to User
    ↓
Option to Generate New Prompts
```

## 🔧 Implementation Details

### 1. Photo Generation Service

```javascript
// Core Photo Generation
async function generateImage(prompt, options, service) {
  // 1. Format & validate prompt
  const formattedPrompt = formatPrompt(prompt, options.style);
  
  // 2. Call appropriate service
  if (service === 'dalle') {
    return callDALLEAPI(formattedPrompt, options);
  } else if (service === 'stability') {
    return callStabilityAPI(formattedPrompt, options);
  }
  
  // 3. Process & return results
  return {
    success: true,
    images: [
      { url: imageUrl, model: 'service-name' }
    ]
  };
}

// Batch Processing
async function batchGenerate(prompts, service) {
  const results = [];
  
  for (const prompt of prompts) {
    try {
      const result = await generateImage(prompt, {}, service);
      results.push({ success: true, ...result });
    } catch (error) {
      results.push({ success: false, error: error.message });
    }
  }
  
  return results;
}
```

### 2. API Service Integration

```javascript
// OpenAI Integration
async function callOpenAI(endpoint, payload) {
  const response = await axios.post(
    `https://api.openai.com/v1${endpoint}`,
    payload,
    {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}

// Error Handling
try {
  const result = await callOpenAI('/images/generations', {
    model: 'dall-e-3',
    prompt: prompt
  });
} catch (error) {
  if (error.response?.status === 429) {
    throw new Error('Rate limit exceeded');
  } else if (error.response?.status === 401) {
    throw new Error('Invalid API key');
  }
  throw error;
}
```

### 3. Job Management

```javascript
// Track long-running jobs
const jobsMap = new Map();

// Create job
const jobId = generateUUID();
jobsMap.set(jobId, {
  status: 'processing',
  createdAt: new Date(),
  progress: 0
});

// Update job
function updateJob(jobId, updates) {
  const job = jobsMap.get(jobId);
  jobsMap.set(jobId, { ...job, ...updates });
}

// Get job status
function getJobStatus(jobId) {
  return jobsMap.get(jobId);
}

// Cleanup old jobs
setInterval(() => {
  for (const [id, job] of jobsMap) {
    if (Date.now() - job.createdAt > 24 * 60 * 60 * 1000) {
      jobsMap.delete(id);
    }
  }
}, 60000);
```

### 4. Rate Limiting & Caching

```javascript
// Rate Limiter
const rateLimiter = {
  'dalle': { limit: 100, window: 60000 }, // 100 per minute
  'stability': { limit: 200, window: 60000 },
  'replicate': { limit: 50, window: 60000 }
};

// Cache Results
const cache = new Map();

function cacheResult(key, value, ttl = 3600000) {
  cache.set(key, {
    value,
    expires: Date.now() + ttl
  });
}

function getCached(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expires) {
    cache.delete(key);
    return null;
  }
  return cached.value;
}
```

## 🚀 Deployment Considerations

### Production Checklist

```
✅ Environment Variables
  - All API keys configured
  - NODE_ENV=production
  - Database connections
  - Cache settings

✅ Security
  - HTTPS enabled
  - CORS properly configured
  - Rate limiting active
  - Input validation strict
  - Authentication/Authorization

✅ Performance
  - Enable compression
  - Implement caching
  - Database indexing
  - CDN for static files
  - Load balancing

✅ Monitoring
  - Error logging
  - Performance metrics
  - API usage tracking
  - Health checks
  - Alerts configured

✅ Scaling
  - Redis for caching
  - Queue system (Bull, RabbitMQ)
  - Multiple workers
  - Database replication
  - Load balancer
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - STABILITY_API_KEY=${STABILITY_API_KEY}
    volumes:
      - ./uploads:/app/uploads
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

## 📊 Database Schema (Optional)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  api_key VARCHAR(255),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Generation History
CREATE TABLE generations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type ENUM('photo', 'video', 'analysis'),
  service VARCHAR(50),
  prompt TEXT,
  status VARCHAR(50),
  result_url TEXT,
  cost DECIMAL(10, 2),
  created_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- API Usage
CREATE TABLE api_usage (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  service VARCHAR(50),
  operation VARCHAR(100),
  tokens_used INT,
  cost DECIMAL(10, 2),
  timestamp TIMESTAMP
);
```

## 🔐 Security Best Practices

### Input Validation
```javascript
// Validate prompt length & content
function validatePrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Invalid prompt');
  }
  if (prompt.length > 4000) {
    throw new Error('Prompt too long');
  }
  if (containsMalicious(prompt)) {
    throw new Error('Prompt contains invalid content');
  }
  return true;
}

// Validate URLs
function validateImageUrl(url) {
  try {
    new URL(url);
    if (!url.startsWith('https://')) {
      throw new Error('Must be HTTPS');
    }
    return true;
  } catch {
    throw new Error('Invalid URL');
  }
}
```

### API Key Security
```javascript
// Never log API keys
console.log(apiKey); // ❌ WRONG

// Use environment variables only
process.env.OPENAI_API_KEY // ✅ CORRECT

// Rotate keys regularly
// Use API key versioning
// Implement key expiration
// Monitor suspicious activity
```

## 📈 Scaling Strategy

### Phase 1: Single Server
- Node.js + Express
- Local file storage
- SQLite or PostgreSQL

### Phase 2: Horizontal Scaling
- Add Redis cache
- Implement job queue (Bull)
- Multiple workers
- S3 for file storage

### Phase 3: Distributed
- Kubernetes cluster
- Database replication
- Global CDN
- Multi-region deployment

## 🔍 Monitoring & Logging

```javascript
// Winston Logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Prometheus Metrics
app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});

// Error Tracking (Sentry)
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

---

**This architecture ensures scalability, reliability, and maintainability for production use!**
