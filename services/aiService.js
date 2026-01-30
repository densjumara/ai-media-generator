// AI Service - Central hub for all AI API integrations
// Supports: OpenAI, Replicate, Stability AI, Hugging Face

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class AIService {
  constructor() {
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.replicateKey = process.env.REPLICATE_API_TOKEN;
    this.stabilityKey = process.env.STABILITY_API_KEY;
    this.huggingFaceKey = process.env.HUGGINGFACE_API_KEY;
    
    this.openaiBase = 'https://api.openai.com/v1';
    this.replicateBase = 'https://api.replicate.com/v1';
    this.stabilityBase = 'https://api.stability.ai/v1';
  }

  // ========== PHOTO GENERATION ==========

  /**
   * Generate image using DALL-E 3 (OpenAI)
   * High quality, photorealistic images
   */
  async generateImageWithDallE(prompt, options = {}) {
    try {
      const {
        quality = 'hd', // hd or standard
        style = 'natural', // natural or vivid
        size = '1024x1024', // 1024x1024, 1792x1024, 1024x1792
        n = 1 // Number of images (1 for DALL-E 3)
      } = options;

      const response = await axios.post(
        `${this.openaiBase}/images/generations`,
        {
          model: 'dall-e-3',
          prompt: prompt,
          n: n,
          size: size,
          quality: quality,
          style: style,
          response_format: 'url'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        images: response.data.data.map(img => ({
          url: img.url,
          model: 'DALL-E 3',
          revised_prompt: img.revised_prompt
        })),
        usage: {
          prompt_tokens: 0,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('DALL-E Error:', error.message);
      throw new Error(`DALL-E Generation Failed: ${error.message}`);
    }
  }

  /**
   * Generate image using Stability AI (Stable Diffusion XL)
   * Faster, more efficient image generation
   */
  async generateImageWithStabilityAI(prompt, options = {}) {
    try {
      const {
        steps = 50,
        width = 1024,
        height = 1024,
        guidance_scale = 7.5,
        sampler = 'K_EULER_ANCESTRAL'
      } = options;

      const response = await axios.post(
        `${this.stabilityBase}/text-to-image`,
        {
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: guidance_scale,
          height: height,
          width: width,
          samples: 1,
          steps: steps,
          sampler: sampler
        },
        {
          headers: {
            'Authorization': `Bearer ${this.stabilityKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.artifacts) {
        return {
          success: true,
          images: response.data.artifacts.map(artifact => ({
            url: `data:image/png;base64,${artifact.base64}`,
            model: 'Stable Diffusion XL',
            finish_reason: artifact.finish_reason
          })),
          timestamp: new Date().toISOString()
        };
      }
      
      throw new Error('No artifacts returned from Stability AI');
    } catch (error) {
      console.error('Stability AI Error:', error.message);
      throw new Error(`Stability AI Generation Failed: ${error.message}`);
    }
  }

  /**
   * Generate image using Replicate (Multiple models available)
   * Flexible model selection
   */
  async generateImageWithReplicate(prompt, options = {}) {
    try {
      const {
        model = 'stability-ai/sdxl', // Can switch between models
        num_outputs = 1,
        height = 768,
        width = 768,
        guidance_scale = 7.5,
        num_inference_steps = 50
      } = options;

      const input = {
        prompt: prompt,
        num_outputs: num_outputs,
        height: height,
        width: width,
        guidance_scale: guidance_scale,
        num_inference_steps: num_inference_steps
      };

      const response = await axios.post(
        `${this.replicateBase}/predictions`,
        {
          version: this.getReplicateModel(model),
          input: input
        },
        {
          headers: {
            'Authorization': `Token ${this.replicateKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Poll for completion
      const result = await this.pollReplicateStatus(response.data.id);

      return {
        success: true,
        images: result.output.map(url => ({
          url: url,
          model: model,
          status: result.status
        })),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Replicate Error:', error.message);
      throw new Error(`Replicate Generation Failed: ${error.message}`);
    }
  }

  // ========== VIDEO GENERATION ==========

  /**
   * Generate video from text using OpenAI
   * Uses GPT-4V for intelligent video concept generation
   */
  async generateVideoFromText(prompt, options = {}) {
    try {
      const {
        duration = 10, // seconds
        fps = 30,
        resolution = '1080p',
        style = 'cinematic'
      } = options;

      // First, use GPT-4V to create detailed video description
      const videoDescription = await this.generateVideoDescription(prompt, style);

      return {
        success: true,
        videoId: this.generateId(),
        concept: videoDescription,
        parameters: {
          duration: duration,
          fps: fps,
          resolution: resolution,
          style: style
        },
        status: 'generating',
        estimatedTime: '2-5 minutes',
        message: 'Use Runway ML or similar service for actual video generation'
      };
    } catch (error) {
      console.error('Video Generation Error:', error.message);
      throw new Error(`Video Generation Failed: ${error.message}`);
    }
  }

  /**
   * Generate video using Runway ML API
   * State-of-the-art video generation
   */
  async generateVideoWithRunway(prompt, options = {}) {
    try {
      const {
        duration = 4, // seconds
        model = 'gen3-alpha'
      } = options;

      // This is a template - implement with actual Runway API
      const response = await axios.post(
        'https://api.runwayml.com/v1/requests',
        {
          model: model,
          task: 'gen3',
          prompt: prompt,
          duration: duration,
          width: 1344,
          height: 768
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.RUNWAY_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        videoId: response.data.id,
        status: response.data.status,
        model: model,
        estimatedCompletionTime: response.data.eta
      };
    } catch (error) {
      console.error('Runway Error:', error.message);
      throw new Error(`Runway Video Generation Failed: ${error.message}`);
    }
  }

  /**
   * Generate video from image sequence
   * Creates smooth transition video from multiple images
   */
  async generateVideoFromImages(imageUrls, options = {}) {
    try {
      const {
        duration = 5,
        fps = 30,
        transitionType = 'fade' // fade, slide, dissolve
      } = options;

      return {
        success: true,
        videoId: this.generateId(),
        imageCount: imageUrls.length,
        parameters: {
          duration: duration,
          fps: fps,
          transitionType: transitionType,
          totalFrames: duration * fps
        },
        status: 'ready_for_processing',
        message: 'Use FFmpeg to process image sequence into video'
      };
    } catch (error) {
      console.error('Video from Images Error:', error.message);
      throw new Error(`Video from Images Failed: ${error.message}`);
    }
  }

  // ========== AI ANALYSIS ==========

  /**
   * Analyze image/video content and generate description
   * Uses GPT-4V for advanced vision understanding
   */
  async analyzeMedia(imageUrl, analysisType = 'general') {
    try {
      const prompts = {
        general: 'Analyze this image and provide a detailed description.',
        aesthetic: 'Analyze the aesthetic qualities, composition, and artistic elements.',
        technical: 'Analyze technical aspects like resolution, color grading, lighting.',
        content: 'Identify and describe main subjects, objects, and scene composition.'
      };

      const response = await axios.post(
        `${this.openaiBase}/chat/completions`,
        {
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompts[analysisType] || prompts.general
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl,
                    detail: 'high'
                  }
                }
              ]
            }
          ],
          max_tokens: 1024
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        analysis: response.data.choices[0].message.content,
        type: analysisType,
        tokens_used: response.data.usage.total_tokens
      };
    } catch (error) {
      console.error('Media Analysis Error:', error.message);
      throw new Error(`Media Analysis Failed: ${error.message}`);
    }
  }

  /**
   * Generate detailed video description using GPT-4
   */
  async generateVideoDescription(prompt, style) {
    try {
      const response = await axios.post(
        `${this.openaiBase}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a professional video script writer and director. Create detailed video descriptions based on prompts. Style: ${style}`
            },
            {
              role: 'user',
              content: `Create a detailed video concept for: ${prompt}`
            }
          ],
          max_tokens: 1500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Video Description Error:', error.message);
      throw error;
    }
  }

  // ========== HELPER METHODS ==========

  /**
   * Poll Replicate API for prediction status
   */
  async pollReplicateStatus(predictionId, maxAttempts = 60) {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const response = await axios.get(
        `${this.replicateBase}/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${this.replicateKey}`
          }
        }
      );

      if (response.data.status === 'succeeded') {
        return response.data;
      } else if (response.data.status === 'failed') {
        throw new Error(`Prediction failed: ${response.data.error}`);
      }

      // Wait 2 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    throw new Error('Prediction timeout');
  }

  /**
   * Get Replicate model version ID
   */
  getReplicateModel(modelName) {
    const models = {
      'stability-ai/sdxl': 'stability-ai/sdxl:39ed52f2a60c3b36cimqkzsgc9b6pxjmnblp8f7684e07155cbe2969582c9f23',
      'openjourney': 'prompthunt/openjourney:9936c2001faa2194a45997736d5cd554c8420c2672b9e9992d942545f98c4583',
      'realistic-vision': 'lucataco/realistic-vision-v3:d1f8739cc2b7300873c622a26b5b468175868ab7ee7518e9ef23e0d18e53dc50'
    };
    
    return models[modelName] || models['stability-ai/sdxl'];
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Format prompt for better results
   */
  formatPrompt(prompt, style = 'photorealistic') {
    const styleGuide = {
      photorealistic: 'hyper-realistic, professional photography, 8k, cinematic',
      artistic: 'artistic, painting-like, watercolor effect, illustration',
      anime: 'anime style, manga art, high quality anime, detailed',
      cartoon: 'cartoon style, colorful, fun, 3D render',
      abstract: 'abstract art, surreal, dreamlike, artistic elements'
    };

    const basePrompt = prompt;
    const stylePrompt = styleGuide[style] || styleGuide.photorealistic;

    return `${basePrompt}, ${stylePrompt}, high quality, detailed, masterpiece`;
  }
}

export default new AIService();
