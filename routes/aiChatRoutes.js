import express from 'express';
import aiService from '../services/aiService.js';

const router = express.Router();

/**
 * POST /api/ai/chat-ideas
 * body: { type: 'photo'|'video'|'both', prompt: string, style?: string }
 * Returns an object with suggestions for high-quality ideas, shot composition, prompts.
 */
router.post('/chat-ideas', async (req, res) => {
  try {
    const { type = 'both', prompt = '', style = 'photorealistic' } = req.body || {};

    // If aiService has a functioning LLM method, try to use it; otherwise use heuristic generator
    let ideas = {};

    // Try advanced video description for video requests
    if (type === 'video' || type === 'both') {
      try {
        const videoConcept = await aiService.generateVideoDescription(prompt || 'A short creative concept', style);
        ideas.video = {
          concept: videoConcept,
          notes: 'Generated via AI service (when available).'
        };
      } catch (err) {
        // fallback: heuristic
        ideas.video = {
          concept: `Concept: ${prompt || 'Cinematic short'} — outline: Opening shot, mid shots, close-ups, color palette: warm cinematic, soundtrack: ambient electronic`,
          notes: 'Fallback heuristic suggestion'
        };
      }
    }

    if (type === 'photo' || type === 'both') {
      try {
        // Use AI to format some high-quality photo prompts and composition notes
        const formatted = aiService.formatPrompt(prompt || 'Portrait of a person in natural light', style);
        ideas.photo = {
          samplePrompts: [
            `${formatted}, golden hour, shallow depth of field, 85mm lens, natural skin tones`,
            `${formatted}, dramatic lighting, backlight rim, wide-angle environmental portrait`,
            `${formatted}, studio setup, softbox, high-key lighting, crisp details`
          ],
          composition: 'Rule of thirds, leading lines, foreground interest, shallow depth for subject separation',
          camera: 'Use 50-85mm for portraits, aperture f/1.8–f/4, ISO as low as possible for clean image',
          notes: 'High-quality photo ideas with variations for mood and lighting.'
        };
      } catch (err) {
        ideas.photo = {
          samplePrompts: [
            `High quality photo: ${prompt || 'Beautiful scene'}, cinematic lighting, crisp details`,
            `Artistic photo: ${prompt || 'Dramatic scene'}, moody color grading, soft bokeh`,
            `Editorial style: ${prompt || 'Lifestyle scene'}, natural poses, contextual environment`
          ],
          composition: 'Focus on subject placement, use natural frames and negative space',
          camera: 'Use focal length appropriate for subject; prefer prime lenses for sharpness',
          notes: 'Fallback heuristic suggestions.'
        };
      }
    }

    return res.json({ success: true, ideas });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
