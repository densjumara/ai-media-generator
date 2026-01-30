// Video Routes - Handles all video generation endpoints

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import aiService from '../services/aiService.js';

const router = express.Router();

// Store for tracking video generation jobs
const videoJobs = new Map();

/**
 * POST /api/video/generate-text-to-video
 * Generate video from text prompt
 */
router.post('/generate-text-to-video', async (req, res) => {
  try {
    const { prompt, duration = 10, fps = 30, resolution = '1080p', style = 'cinematic' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const jobId = uuidv4();

    // Create video generation job
    const videoJob = {
      jobId: jobId,
      status: 'initializing',
      type: 'text-to-video',
      prompt: prompt,
      parameters: {
        duration: duration,
        fps: fps,
        resolution: resolution,
        style: style
      },
      createdAt: new Date(),
      estimatedCompletionTime: new Date(Date.now() + duration * 1000 * 2) // Rough estimate
    };

    videoJobs.set(jobId, videoJob);

    // Start generation process asynchronously
    setImmediate(async () => {
      try {
        const result = await aiService.generateVideoFromText(prompt, {
          duration,
          fps,
          resolution,
          style
        });

        // Update job with result
        videoJobs.set(jobId, {
          ...videoJob,
          status: 'completed',
          result: result,
          completedAt: new Date()
        });
      } catch (error) {
        videoJobs.set(jobId, {
          ...videoJob,
          status: 'failed',
          error: error.message,
          completedAt: new Date()
        });
      }
    });

    res.json({
      success: true,
      jobId: jobId,
      status: 'queued',
      message: 'Video generation started. Check status with job ID.',
      parameters: videoJob.parameters,
      estimatedCompletionTime: videoJob.estimatedCompletionTime
    });
  } catch (error) {
    console.error('Text-to-Video Error:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * POST /api/video/generate-from-images
 * Generate video from image sequence
 */
router.post('/generate-from-images', async (req, res) => {
  try {
    const { imageUrls, duration = 5, fps = 30, transitionType = 'fade' } = req.body;

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ error: 'Image URLs array is required' });
    }

    const jobId = uuidv4();

    const videoJob = {
      jobId: jobId,
      status: 'processing',
      type: 'image-sequence-to-video',
      imageCount: imageUrls.length,
      parameters: {
        duration: duration,
        fps: fps,
        transitionType: transitionType,
        totalFrames: duration * fps
      },
      createdAt: new Date()
    };

    videoJobs.set(jobId, videoJob);

    // Process video generation
    setImmediate(async () => {
      try {
        const result = await aiService.generateVideoFromImages(imageUrls, {
          duration,
          fps,
          transitionType
        });

        videoJobs.set(jobId, {
          ...videoJob,
          status: 'completed',
          result: result,
          completedAt: new Date()
        });
      } catch (error) {
        videoJobs.set(jobId, {
          ...videoJob,
          status: 'failed',
          error: error.message,
          completedAt: new Date()
        });
      }
    });

    res.json({
      success: true,
      jobId: jobId,
      status: 'processing',
      imageCount: imageUrls.length,
      parameters: videoJob.parameters,
      message: 'Video processing started'
    });
  } catch (error) {
    console.error('Image Sequence Error:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * POST /api/video/generate-runway
 * Generate video using Runway ML
 */
router.post('/generate-runway', async (req, res) => {
  try {
    const { prompt, duration = 4 } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const jobId = uuidv4();

    try {
      const result = await aiService.generateVideoWithRunway(prompt, {
        duration: duration
      });

      videoJobs.set(jobId, {
        jobId: jobId,
        status: 'processing',
        type: 'runway-gen3',
        prompt: prompt,
        result: result,
        createdAt: new Date()
      });

      res.json({
        success: true,
        jobId: jobId,
        data: result
      });
    } catch (error) {
      // Runway API may not be available, provide fallback
      res.status(503).json({
        error: 'Runway ML service not configured or unavailable',
        message: 'Please configure RUNWAY_API_KEY in environment variables',
        fallbackMessage: 'Use text-to-video endpoint for alternative video generation'
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * GET /api/video/job/:jobId
 * Get video generation job status
 */
router.get('/job/:jobId', (req, res) => {
  try {
    const { jobId } = req.params;
    const job = videoJobs.get(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Video job not found' });
    }

    // Remove sensitive data
    const safeJob = {
      jobId: job.jobId,
      status: job.status,
      type: job.type,
      prompt: job.prompt,
      imageCount: job.imageCount,
      parameters: job.parameters,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      ...(job.result && { result: job.result }),
      ...(job.error && { error: job.error })
    };

    res.json(safeJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/video/jobs
 * Get all video generation jobs
 */
router.get('/jobs', (req, res) => {
  try {
    const jobs = Array.from(videoJobs.values()).map(job => ({
      jobId: job.jobId,
      status: job.status,
      type: job.type,
      createdAt: job.createdAt,
      completedAt: job.completedAt
    }));

    res.json({
      totalJobs: jobs.length,
      jobs: jobs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/video/models
 * Get available video generation models
 */
router.get('/models', (req, res) => {
  res.json({
    available_models: [
      {
        id: 'text-to-video',
        name: 'Text-to-Video Generator',
        type: 'text-to-video',
        description: 'Generate videos from text descriptions',
        capabilities: [
          'Scene generation',
          'Character animation',
          'Environmental effects'
        ],
        maxDuration: 60,
        supportedResolutions: ['1080p', '4K'],
        estimatedLatency: '2-5 minutes',
        costPerMinute: '$0.50-1.00'
      },
      {
        id: 'runway-gen3',
        name: 'Runway Gen-3',
        type: 'video-generation',
        provider: 'Runway ML',
        description: 'Advanced video generation with realistic physics',
        capabilities: [
          'Photorealistic video generation',
          'Motion synthesis',
          'Complex scene understanding'
        ],
        maxDuration: 10,
        maxResolution: '1344x768',
        estimatedLatency: '1-3 minutes',
        costPerVideo: '$0.10-0.20'
      },
      {
        id: 'image-sequence',
        name: 'Image Sequence to Video',
        type: 'image-to-video',
        description: 'Create videos from image sequences',
        capabilities: [
          'Smooth transitions',
          'Frame interpolation',
          'Custom timing'
        ],
        supportedFormats: ['JPG', 'PNG', 'WebP'],
        transitionTypes: ['fade', 'slide', 'dissolve', 'wipe'],
        estimatedLatency: '10-30 seconds',
        costPerVideo: '$0.05-0.10'
      }
    ]
  });
});

/**
 * POST /api/video/analyze-frames
 * Analyze video frames and generate description
 */
router.post('/analyze-frames', async (req, res) => {
  try {
    const { videoUrl, frameCount = 5 } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    // This would extract frames and analyze them
    // Implementation depends on video processing library
    res.json({
      success: true,
      message: 'Frame analysis not yet implemented',
      suggestion: 'Extract frames using FFmpeg and analyze each with vision API'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
