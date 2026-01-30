# 🚀 Deployment Checklist - AI Media Generator

## Pre-Deployment Phase (Complete Before Running)

### ✅ Environment Setup
- [ ] Node.js 18+ installed (`node --version` to verify)
- [ ] npm 9+ installed (`npm --version` to verify)
- [ ] Git installed (optional, for version control)
- [ ] Code editor (VS Code recommended)
- [ ] API keys obtained for desired services

### ✅ API Keys - Choose at Least ONE

#### Option 1: OpenAI (Recommended for Quality)
- [ ] Visit https://platform.openai.com/account/api-keys
- [ ] Create new API key
- [ ] Copy key to `.env` as `OPENAI_API_KEY`
- [ ] Verify account has billing set up
- [ ] Test: `curl https://api.openai.com/v1/models -H "Authorization: Bearer YOUR_KEY"`

#### Option 2: Stability AI (Best for Speed)
- [ ] Visit https://platform.stabilityai.com/account/keys
- [ ] Create new API key
- [ ] Copy key to `.env` as `STABILITY_API_KEY`
- [ ] Verify account credits available
- [ ] Test using examples

#### Option 3: Replicate (Most Flexible)
- [ ] Visit https://replicate.com/account/api-tokens
- [ ] Create new token
- [ ] Copy token to `.env` as `REPLICATE_API_TOKEN`
- [ ] Verify account has billing set up
- [ ] Test using examples

#### Option 4: Runway ML (Advanced Video)
- [ ] Visit https://app.runwayml.com/settings/api
- [ ] Create new API key
- [ ] Copy key to `.env` as `RUNWAY_API_KEY`
- [ ] Verify account has workspace credits
- [ ] Test using examples

### ✅ Project Setup

```bash
# Step 1: Navigate to project directory
cd "Demo AI Agen System"

# Step 2: Install dependencies
npm install

# Step 3: Create .env file
cp .env.example .env

# Step 4: Add your API keys to .env
# Edit .env file and add at least one API key

# Step 5: Verify setup
npm run dev
```

## Development Phase (Local Testing)

### ✅ Start Server

```bash
npm run dev
# Expected output:
# Server running on http://localhost:5000
# Press CTRL+C to stop
```

### ✅ Test Backend Endpoints

#### Photo Generation Test
```bash
# Test DALL-E 3
curl -X POST http://localhost:5000/api/photo/generate-dalle \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over mountains",
    "size": "1024x1024",
    "quality": "hd"
  }'

# Expected: { jobId: "...", status: "processing", ... }
```

#### Video Generation Test
```bash
curl -X POST http://localhost:5000/api/video/generate-text-to-video \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A robot dancing in the rain",
    "duration": 5
  }'

# Expected: { jobId: "...", status: "processing", ... }
```

#### Status Check Test
```bash
curl http://localhost:5000/api/status/health

# Expected: { status: "ok", uptime: ..., memory: ... }
```

### ✅ Test Frontend

1. Open browser: `http://localhost:5000`
2. Should see:
   - [ ] Dark theme dashboard with logo
   - [ ] 4 main tabs: Photo, Video, Gallery, Settings
   - [ ] Forms with input fields
   - [ ] Navigation works

### ✅ Test Photo Generation

1. Go to **Photo** tab
2. Select **DALL-E 3** option
3. Enter prompt: `"A futuristic city at night"`
4. Click "Generate"
5. Should see:
   - [ ] Loading spinner appears
   - [ ] Image appears after 5-10 seconds
   - [ ] Can download image
   - [ ] Can share image

### ✅ Test Video Generation

1. Go to **Video** tab
2. Select **Text to Video**
3. Enter prompt: `"A cat jumping over a fence"`
4. Set duration: 5 seconds
5. Click "Generate"
6. Should see:
   - [ ] Job ID displayed
   - [ ] Status shows "processing"
   - [ ] Can check status periodically

### ✅ Test Analysis Features

1. Go to **Photo** tab
2. Scroll to **Analyze Image**
3. Enter image URL or upload image
4. Select analysis type
5. Should see analysis results

### ✅ View Settings & Status

1. Go to **Settings** tab
2. Should show:
   - [ ] Service status (Configured/Not configured)
   - [ ] Model information
   - [ ] System health stats
   - [ ] Available models list

## Pre-Production Phase (Before Going Live)

### ✅ Security Review

- [ ] No API keys in code (check `server.js`, `services/aiService.js`)
- [ ] All API keys in `.env` file
- [ ] `.env` file in `.gitignore`
- [ ] CORS configured correctly in `server.js`
- [ ] Input validation present in all routes
- [ ] Error messages don't expose sensitive data

### ✅ Performance Optimization

- [ ] Images optimized (check Sharp configuration)
- [ ] Response times reasonable (< 10 seconds for generation)
- [ ] No memory leaks in job tracking
- [ ] Batch operations working efficiently
- [ ] Rate limiting in place for batch operations

### ✅ Error Handling

Test error scenarios:
- [ ] Invalid API key → Error message
- [ ] Missing prompt → Error message
- [ ] Network timeout → Retry logic works
- [ ] Invalid image URL → Error message
- [ ] Rate limit hit → Graceful degradation

### ✅ Documentation Review

- [ ] README.md is accurate
- [ ] QUICK_START.md follows actual steps
- [ ] API examples are runnable
- [ ] Troubleshooting section covers known issues
- [ ] Comments in code are clear

### ✅ Test All API Endpoints (18 total)

**Photo Endpoints (7)**
- [ ] `POST /api/photo/generate-dalle`
- [ ] `POST /api/photo/generate-stability`
- [ ] `POST /api/photo/generate-replicate`
- [ ] `POST /api/photo/batch-generate`
- [ ] `GET /api/photo/job/:jobId`
- [ ] `GET /api/photo/models`
- [ ] `POST /api/photo/analyze`

**Video Endpoints (6)**
- [ ] `POST /api/video/generate-text-to-video`
- [ ] `POST /api/video/generate-from-images`
- [ ] `POST /api/video/generate-runway`
- [ ] `GET /api/video/job/:jobId`
- [ ] `GET /api/video/jobs`
- [ ] `GET /api/video/models`

**Analysis Endpoints (6)**
- [ ] `POST /api/analysis/image`
- [ ] `POST /api/analysis/compare-images`
- [ ] `POST /api/analysis/generate-prompt`
- [ ] `POST /api/analysis/quality-score`
- [ ] `POST /api/analysis/batch-analyze`
- [ ] `POST /api/analysis/categorize-content`

**Status Endpoints (4)**
- [ ] `GET /api/status/models`
- [ ] `GET /api/status/health`
- [ ] `GET /api/status/services`
- [ ] `GET /api/status/usage`

## Production Deployment Phase

### ✅ Choose Deployment Option

#### Option A: Simple (Single Server)
```bash
# 1. Install PM2 globally
npm install -g pm2

# 2. Start with PM2
pm2 start server.js --name "ai-media-generator"

# 3. Monitor
pm2 monit

# 4. View logs
pm2 logs ai-media-generator
```

#### Option B: Docker (Recommended)
```bash
# 1. Create Dockerfile (see ARCHITECTURE.md)
# 2. Build image
docker build -t ai-media-generator .

# 3. Run container
docker run -p 5000:5000 \
  -e OPENAI_API_KEY="your_key" \
  -e NODE_ENV="production" \
  ai-media-generator

# 4. Use Docker Compose for multiple containers
docker-compose up -d
```

#### Option C: Cloud Platform

**Heroku**
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku config:set OPENAI_API_KEY=your_key
```

**Railway** (Easiest)
1. Push to GitHub
2. Connect GitHub to Railway
3. Add environment variables
4. Deploy automatically

**AWS/GCP/Azure**
- See ARCHITECTURE.md for detailed instructions
- Use Lambda/Cloud Run for serverless
- Or use EC2/Compute Engine for full control

### ✅ Environment Configuration

Production `.env`:
```bash
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# API Keys (use proper secrets management in production)
OPENAI_API_KEY=your_production_key
STABILITY_API_KEY=your_production_key
REPLICATE_API_TOKEN=your_production_token
RUNWAY_API_KEY=your_production_key

# Limits
MAX_FILE_SIZE=104857600  # 100MB
MAX_BATCH_SIZE=50

# Paths
UPLOAD_DIR=/tmp/uploads
TEMP_DIR=/tmp/temp

# CORS
CORS_ORIGIN=https://yourdomain.com

# Logging
LOG_LEVEL=info
```

### ✅ Monitoring Setup

- [ ] Server uptime monitoring (UptimeRobot, Pingdom)
- [ ] Error tracking (Sentry, LogRocket)
- [ ] Performance monitoring (New Relic, DataDog)
- [ ] API logs aggregation (CloudWatch, Stackdriver)
- [ ] Database monitoring (if using database)

### ✅ Backup & Recovery

- [ ] Database backups automated (if using)
- [ ] Generated media backed up to cloud storage (S3, GCS)
- [ ] Configuration backups
- [ ] Recovery procedure documented
- [ ] Disaster recovery plan in place

### ✅ Performance Tuning

- [ ] Enable compression in Express
- [ ] Enable caching headers
- [ ] Use CDN for frontend assets
- [ ] Optimize image processing
- [ ] Setup database indexes (if using)
- [ ] Enable connection pooling

### ✅ SSL/HTTPS Setup

- [ ] SSL certificate obtained (Let's Encrypt free)
- [ ] HTTPS enabled
- [ ] HTTP redirects to HTTPS
- [ ] HSTS header set
- [ ] Mixed content warnings resolved

### ✅ Domain & DNS

- [ ] Domain purchased/configured
- [ ] DNS records configured
- [ ] SSL certificate matches domain
- [ ] Email forwarding setup (if needed)
- [ ] CDN configured (if using)

## Post-Deployment Phase (After Going Live)

### ✅ Monitoring & Maintenance

Daily:
- [ ] Check error logs for issues
- [ ] Verify API responses are normal
- [ ] Check server uptime
- [ ] Review user feedback

Weekly:
- [ ] Analyze usage statistics
- [ ] Review cost reports
- [ ] Check for performance degradation
- [ ] Backup important data

Monthly:
- [ ] Security audit
- [ ] Dependency updates
- [ ] Feature requests review
- [ ] Scale assessment

### ✅ User Support

- [ ] FAQ page created
- [ ] Support email setup
- [ ] Issue reporting system (GitHub Issues)
- [ ] Help documentation updated
- [ ] User tutorials created

### ✅ Analytics & Metrics

Track:
- [ ] Total photos generated
- [ ] Total videos generated
- [ ] Total analyses performed
- [ ] Average generation time
- [ ] Cost per operation
- [ ] User satisfaction
- [ ] Error rates
- [ ] API availability

### ✅ Future Enhancements

Plan for:
- [ ] User authentication system
- [ ] Gallery/project management
- [ ] Payment/subscription system
- [ ] More AI models integration
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Batch scheduling
- [ ] Custom model training

## Quick Troubleshooting

### Server Won't Start
```bash
# Check Node version
node --version  # Should be 18+

# Check port availability
lsof -i :5000  # See what's using port 5000

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### API Key Not Working
```bash
# Verify key is in .env
cat .env | grep API_KEY

# Test key directly
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_KEY"

# Check for extra whitespace
# Remove spaces/newlines from keys
```

### Images Not Generating
- [ ] Check API key is valid
- [ ] Check account has credits
- [ ] Review prompt for inappropriate content
- [ ] Check image size is valid (1024x1024, 512x512, etc.)
- [ ] Review error logs in console

### Videos Taking Too Long
- [ ] Video generation is async - check status endpoint
- [ ] Use polling with 5-second intervals
- [ ] Longer videos take longer to generate
- [ ] Check Runway ML logs for queue

### CORS Errors
- [ ] Update CORS_ORIGIN in .env to your domain
- [ ] Ensure frontend domain matches CORS_ORIGIN
- [ ] Check browser console for specific error

---

## Summary Checklist

**Before First Deploy:**
- [ ] All dependencies installed
- [ ] .env configured with at least one API key
- [ ] Server starts without errors
- [ ] Frontend loads in browser
- [ ] Photo generation works
- [ ] Video generation works
- [ ] All tests pass

**Before Production Deploy:**
- [ ] Security review completed
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Error handling tested
- [ ] Monitoring configured
- [ ] SSL certificate ready
- [ ] Backup strategy in place

**After Production Deploy:**
- [ ] Monitor for issues
- [ ] Collect user feedback
- [ ] Track metrics
- [ ] Plan improvements
- [ ] Keep dependencies updated

---

🎉 **You're ready to deploy the AI Media Generator!**

Need help? Check README.md or QUICK_START.md
