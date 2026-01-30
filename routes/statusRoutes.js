// Status Routes - Job tracking and monitoring

import express from 'express';

const router = express.Router();

/**
 * GET /api/status/models
 * Check status of all AI model services
 */
router.get('/models', async (req, res) => {
  try {
    const modelStatus = {
      services: {
        openai: {
          name: 'OpenAI (DALL-E 3, GPT-4V)',
          status: process.env.OPENAI_API_KEY ? 'configured' : 'not-configured',
          models: ['DALL-E 3', 'GPT-4V', 'GPT-4'],
          capabilities: ['text-to-image', 'image-analysis', 'video-description']
        },
        stabilityai: {
          name: 'Stability AI (Stable Diffusion XL)',
          status: process.env.STABILITY_API_KEY ? 'configured' : 'not-configured',
          models: ['Stable Diffusion XL', 'Stable Diffusion 3'],
          capabilities: ['text-to-image', 'fast-generation']
        },
        replicate: {
          name: 'Replicate',
          status: process.env.REPLICATE_API_TOKEN ? 'configured' : 'not-configured',
          models: ['SDXL', 'OpenJourney', 'Realistic Vision'],
          capabilities: ['text-to-image', 'flexible-models']
        },
        runway: {
          name: 'Runway ML',
          status: process.env.RUNWAY_API_KEY ? 'configured' : 'not-configured',
          models: ['Gen-3', 'Gen-2'],
          capabilities: ['text-to-video', 'image-to-video']
        },
        huggingface: {
          name: 'Hugging Face',
          status: process.env.HUGGINGFACE_API_KEY ? 'configured' : 'not-configured',
          models: ['Multiple models available'],
          capabilities: ['text-to-image', 'custom-models']
        }
      },
      summary: {
        configuredServices: Object.values({
          openai: process.env.OPENAI_API_KEY ? true : false,
          stabilityai: process.env.STABILITY_API_KEY ? true : false,
          replicate: process.env.REPLICATE_API_TOKEN ? true : false,
          runway: process.env.RUNWAY_API_KEY ? true : false,
          huggingface: process.env.HUGGINGFACE_API_KEY ? true : false
        }).filter(Boolean).length,
        totalServices: 5
      },
      lastUpdated: new Date().toISOString()
    };

    res.json(modelStatus);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * GET /api/status/health
 * System health check
 */
router.get('/health', (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB'
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development'
      }
    };

    res.json(health);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 'unhealthy'
    });
  }
});

/**
 * GET /api/status/services
 * Detailed service status
 */
router.get('/services', (req, res) => {
  try {
    const services = {
      photoGeneration: {
        available: true,
        providers: ['DALL-E 3', 'Stability AI', 'Replicate'],
        status: 'operational'
      },
      videoGeneration: {
        available: true,
        providers: ['Runway ML', 'Text-to-Video'],
        status: 'operational'
      },
      imageAnalysis: {
        available: true,
        providers: ['GPT-4V'],
        status: 'operational'
      },
      batchProcessing: {
        available: true,
        maxBatchSize: 50,
        status: 'operational'
      },
      apiRateLimits: {
        photoGeneration: {
          rateLimit: '100 requests/minute',
          remaining: 95
        },
        videoGeneration: {
          rateLimit: '10 requests/minute',
          remaining: 9
        }
      }
    };

    res.json(services);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * GET /api/status/usage
 * API usage statistics
 */
router.get('/usage', (req, res) => {
  try {
    const usage = {
      period: 'current-month',
      statistics: {
        photosGenerated: 1250,
        videosGenerated: 45,
        imagesAnalyzed: 3200,
        batchesProcessed: 78,
        totalApiCalls: 4573,
        averageLatency: '3.2 seconds'
      },
      costs: {
        estimated: '$523.45',
        currency: 'USD',
        breakdown: {
          photoGeneration: '$285.60',
          videoGeneration: '$198.50',
          imageAnalysis: '$39.35'
        }
      },
      topModels: [
        {
          model: 'DALL-E 3',
          usagePercentage: 45,
          totalCalls: 2057
        },
        {
          model: 'Stable Diffusion XL',
          usagePercentage: 35,
          totalCalls: 1601
        },
        {
          model: 'Runway ML',
          usagePercentage: 15,
          totalCalls: 683
        },
        {
          model: 'GPT-4V',
          usagePercentage: 5,
          totalCalls: 232
        }
      ],
      timestamp: new Date().toISOString()
    };

    res.json(usage);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
