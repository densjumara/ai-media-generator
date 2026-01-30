// Photo Routes - Handles all photo generation endpoints

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import aiService from '../services/aiService.js';

const router = express.Router();

// Store for tracking generation jobs
const generationJobs = new Map();

/**
 * POST /api/photo/generate-dalle
 * Generate image using DALL-E 3
 */
router.post('/generate-dalle', async (req, res) => {
  try {
    const { prompt, size, quality, style } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const jobId = uuidv4();

    // Format prompt for better results
    const formattedPrompt = aiService.formatPrompt(prompt, style || 'photorealistic');

    // Start generation in background
    const generationPromise = aiService.generateImageWithDallE(
      formattedPrompt,
      { size, quality, style }
    );

    // Store job info
    generationJobs.set(jobId, {
      status: 'generating',
      model: 'DALL-E 3',
      prompt: prompt,
      createdAt: new Date(),
      promise: generationPromise
    });

    // Wait for result
    const result = await generationPromise;

    // Update job status
    generationJobs.set(jobId, {
      status: 'completed',
      model: 'DALL-E 3',
      prompt: prompt,
      result: result,
      createdAt: new Date(),
      completedAt: new Date()
    });

    res.json({
      success: true,
      jobId: jobId,
      data: result
    });
  } catch (error) {
    console.error('DALL-E Route Error:', error.message);
    res.status(500).json({
      error: error.message,
      service: 'DALL-E 3'
    });
  }
});

/**
 * POST /api/photo/generate-stability
 * Generate image using Stability AI
 */
router.post('/generate-stability', async (req, res) => {
  try {
    const { prompt, width, height, steps } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const jobId = uuidv4();
    const formattedPrompt = aiService.formatPrompt(prompt, 'photorealistic');

    const result = await aiService.generateImageWithStabilityAI(
      formattedPrompt,
      { width, height, steps }
    );

    generationJobs.set(jobId, {
      status: 'completed',
      model: 'Stability AI',
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
    console.error('Stability AI Route Error:', error.message);
    res.status(500).json({
      error: error.message,
      service: 'Stability AI'
    });
  }
});

/**
 * POST /api/photo/generate-replicate
 * Generate image using Replicate
 */
router.post('/generate-replicate', async (req, res) => {
  try {
    const { prompt, model, num_outputs } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const jobId = uuidv4();
    const formattedPrompt = aiService.formatPrompt(prompt);

    const result = await aiService.generateImageWithReplicate(
      formattedPrompt,
      { model, num_outputs }
    );

    generationJobs.set(jobId, {
      status: 'completed',
      model: 'Replicate',
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
    console.error('Replicate Route Error:', error.message);
    res.status(500).json({
      error: error.message,
      service: 'Replicate'
    });
  }
});

/**
 * POST /api/photo/batch-generate
 * Generate multiple images in batch
 */
router.post('/batch-generate', async (req, res) => {
  try {
    const { prompts, service = 'dalle', options = {} } = req.body;

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return res.status(400).json({ error: 'Prompts array is required' });
    }

    const jobId = uuidv4();
    const batchResults = [];

    generationJobs.set(jobId, {
      status: 'generating',
      type: 'batch',
      totalCount: prompts.length,
      completedCount: 0,
      results: [],
      createdAt: new Date()
    });

    // Generate images for each prompt
    for (let i = 0; i < prompts.length; i++) {
      try {
        const prompt = prompts[i];
        let result;

        if (service === 'dalle') {
          result = await aiService.generateImageWithDallE(prompt, options);
        } else if (service === 'stability') {
          result = await aiService.generateImageWithStabilityAI(prompt, options);
        } else if (service === 'replicate') {
          result = await aiService.generateImageWithReplicate(prompt, options);
        }

        batchResults.push({
          prompt: prompt,
          result: result,
          success: true
        });

        // Update progress
        const job = generationJobs.get(jobId);
        job.completedCount = i + 1;
      } catch (error) {
        batchResults.push({
          prompt: prompts[i],
          error: error.message,
          success: false
        });
      }
    }

    // Update final status
    generationJobs.set(jobId, {
      status: 'completed',
      type: 'batch',
      totalCount: prompts.length,
      completedCount: batchResults.filter(r => r.success).length,
      results: batchResults,
      createdAt: new Date(),
      completedAt: new Date()
    });

    res.json({
      success: true,
      jobId: jobId,
      batchSize: prompts.length,
      successCount: batchResults.filter(r => r.success).length,
      data: batchResults
    });
  } catch (error) {
    console.error('Batch Generation Error:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * GET /api/photo/job/:jobId
 * Get generation job status
 */
router.get('/job/:jobId', (req, res) => {
  try {
    const { jobId } = req.params;
    const job = generationJobs.get(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({
      jobId: jobId,
      status: job.status,
      model: job.model,
      prompt: job.prompt,
      progress: job.totalCount ? {
        completed: job.completedCount,
        total: job.totalCount,
        percentage: Math.round((job.completedCount / job.totalCount) * 100)
      } : null,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      result: job.result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/photo/models
 * Get available models and their capabilities
 */
router.get('/models', (req, res) => {
  res.json({
    available_models: [
      {
        id: 'dalle-3',
        name: 'DALL-E 3',
        provider: 'OpenAI',
        capabilities: [
          'Text-to-image generation',
          'High quality photorealistic images',
          'Natural language understanding'
        ],
        sizes: ['1024x1024', '1792x1024', '1024x1792'],
        qualities: ['standard', 'hd'],
        styles: ['natural', 'vivid'],
        costPerImage: '$0.04-0.20',
        latency: '15-60 seconds'
      },
      {
        id: 'stable-diffusion-xl',
        name: 'Stable Diffusion XL',
        provider: 'Stability AI',
        capabilities: [
          'Fast image generation',
          'Customizable parameters',
          'Cost-effective'
        ],
        resolutions: ['512x512', '768x768', '1024x1024'],
        samplers: ['K_EULER', 'K_EULER_ANCESTRAL', 'K_DPM_2'],
        costPerImage: '$0.01-0.03',
        latency: '5-30 seconds'
      },
      {
        id: 'replicate-models',
        name: 'Replicate Collection',
        provider: 'Replicate',
        capabilities: [
          'Multiple model options',
          'Community models',
          'Flexible architecture'
        ],
        models: ['stability-ai/sdxl', 'openjourney', 'realistic-vision'],
        costPerImage: '$0.005-0.02',
        latency: '10-45 seconds'
      }
    ]
  });
});

/**
 * POST /api/photo/analyze
 * Analyze generated or uploaded image
 */
router.post('/analyze', async (req, res) => {
  try {
    const { imageUrl, analysisType = 'general' } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const analysis = await aiService.analyzeMedia(imageUrl, analysisType);

    res.json({
      success: true,
      analysis: analysis
    });
  } catch (error) {
    console.error('Analysis Error:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
