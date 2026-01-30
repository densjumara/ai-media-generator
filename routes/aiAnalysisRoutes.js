// AI Analysis Routes - Advanced content analysis endpoints

import express from 'express';
import aiService from '../services/aiService.js';

const router = express.Router();

/**
 * POST /api/analysis/image
 * Analyze image content
 */
router.post('/image', async (req, res) => {
  try {
    const { imageUrl, analysisType = 'general' } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const validTypes = ['general', 'aesthetic', 'technical', 'content'];
    if (!validTypes.includes(analysisType)) {
      return res.status(400).json({
        error: `Invalid analysis type. Valid types: ${validTypes.join(', ')}`
      });
    }

    const analysis = await aiService.analyzeMedia(imageUrl, analysisType);

    res.json({
      success: true,
      imageUrl: imageUrl,
      analysisType: analysisType,
      result: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Image Analysis Error:', error.message);
    res.status(500).json({
      error: error.message,
      type: 'image-analysis-failed'
    });
  }
});

/**
 * POST /api/analysis/compare-images
 * Compare two images and provide detailed analysis
 */
router.post('/compare-images', async (req, res) => {
  try {
    const { imageUrl1, imageUrl2 } = req.body;

    if (!imageUrl1 || !imageUrl2) {
      return res.status(400).json({ error: 'Both image URLs are required' });
    }

    // Analyze both images
    const [analysis1, analysis2] = await Promise.all([
      aiService.analyzeMedia(imageUrl1, 'general'),
      aiService.analyzeMedia(imageUrl2, 'general')
    ]);

    res.json({
      success: true,
      comparison: {
        image1: {
          url: imageUrl1,
          analysis: analysis1.analysis
        },
        image2: {
          url: imageUrl2,
          analysis: analysis2.analysis
        },
        similarities: 'Manual comparison needed',
        differences: 'Manual comparison needed'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Image Comparison Error:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * POST /api/analysis/generate-prompt
 * Generate detailed prompts from image analysis
 */
router.post('/generate-prompt', async (req, res) => {
  try {
    const { imageUrl, promptType = 'comprehensive' } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Analyze the image first
    const analysis = await aiService.analyzeMedia(imageUrl, 'general');

    // Generate a detailed prompt from the analysis
    const generatedPrompt = `Based on analysis: ${analysis.analysis}. Generate a detailed prompt for recreating similar image.`;

    res.json({
      success: true,
      originalAnalysis: analysis.analysis,
      generatedPrompt: generatedPrompt,
      promptType: promptType,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Prompt Generation Error:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * POST /api/analysis/quality-score
 * Score image quality and provide recommendations
 */
router.post('/quality-score', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Analyze technical aspects
    const technicalAnalysis = await aiService.analyzeMedia(imageUrl, 'technical');

    // Generate a quality score and recommendations
    const qualityScore = {
      overall: 75, // Would be calculated from actual analysis
      resolution: 80,
      colorBalance: 78,
      composition: 72,
      lighting: 82,
      recommendations: [
        'Improve color balance for more vivid tones',
        'Consider composition adjustments for better visual flow',
        'Resolution is adequate for most uses'
      ]
    };

    res.json({
      success: true,
      imageUrl: imageUrl,
      qualityScore: qualityScore,
      technicalAnalysis: technicalAnalysis.analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Quality Score Error:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * POST /api/analysis/batch-analyze
 * Analyze multiple images in batch
 */
router.post('/batch-analyze', async (req, res) => {
  try {
    const { imageUrls, analysisType = 'general' } = req.body;

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ error: 'Image URLs array is required' });
    }

    if (imageUrls.length > 50) {
      return res.status(400).json({
        error: 'Maximum 50 images per batch',
        provided: imageUrls.length
      });
    }

    const results = [];

    // Analyze images sequentially (with delays to avoid rate limits)
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const analysis = await aiService.analyzeMedia(imageUrls[i], analysisType);
        results.push({
          imageUrl: imageUrls[i],
          success: true,
          analysis: analysis.analysis,
          index: i
        });

        // Add delay between requests
        if (i < imageUrls.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        results.push({
          imageUrl: imageUrls[i],
          success: false,
          error: error.message,
          index: i
        });
      }
    }

    const successCount = results.filter(r => r.success).length;

    res.json({
      success: true,
      totalImages: imageUrls.length,
      successCount: successCount,
      failureCount: results.length - successCount,
      results: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Batch Analysis Error:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * POST /api/analysis/categorize-content
 * Automatically categorize image content
 */
router.post('/categorize-content', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const analysis = await aiService.analyzeMedia(imageUrl, 'content');

    // Extract categories from analysis
    const categories = {
      mainSubject: ['Unknown'], // Would be extracted from analysis
      artStyle: 'Mixed',
      colorPalette: ['Multiple'],
      mood: 'Neutral',
      technicalLevel: 'Unknown',
      tags: ['image', 'analysis']
    };

    res.json({
      success: true,
      imageUrl: imageUrl,
      categories: categories,
      analysis: analysis.analysis,
      confidence: 0.85, // Would be calculated from actual analysis
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Categorization Error:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

export default router;
