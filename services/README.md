# Services

This folder contains business logic and external API integrations.

## Files

- **aiService.js** - AI provider integrations (OpenAI, Stability AI, Replicate, Runway ML)
- **imageService.js** - Image processing utilities
- **videoService.js** - Video processing utilities

## aiService.js Methods

```javascript
import aiService from './services/aiService.js';

// Photo generation
await aiService.generateImageWithDallE(prompt, options);
await aiService.generateImageWithStabilityAI(prompt, options);
await aiService.generateImageWithReplicate(prompt, options);

// Video generation
await aiService.generateVideoFromText(prompt, options);
await aiService.generateVideoWithRunway(prompt, options);

// Analysis
await aiService.analyzeMedia(imageUrl, analysisType);
```

## Adding New Services

1. Create new file (e.g., `chatService.js`)
2. Export methods
3. Use in routes

```javascript
// services/chatService.js
export async function generateResponse(message) {
  // Implementation
}
```
