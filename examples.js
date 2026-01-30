// Example API Usage & Testing Guide
// File: examples.js

// ============================================
// PHOTO GENERATION EXAMPLES
// ============================================

// Example 1: Generate Photo with DALL-E 3
async function example_dalle() {
  const response = await fetch('http://generatvideo.com/api/photo/generate-dalle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'A luxury yacht sailing through Mediterranean Sea at sunset, photorealistic, 4K, professional photography',
      size: '1024x1024',
      quality: 'hd',
      style: 'vivid'
    })
  });

  const data = await response.json();
  console.log('Generated Image:', data.data.images[0].url);
  return data;
}

// Example 2: Generate Photo with Stability AI
async function example_stability() {
  const response = await fetch('http://generatvideo.com/api/photo/generate-stability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'Futuristic cyberpunk city with neon lights, rain, ultra detailed, 4K',
      width: 1024,
      height: 1024,
      steps: 75
    })
  });

  const data = await response.json();
  console.log('Generated Image:', data.data.images[0].url);
  return data;
}

// Example 3: Batch Photo Generation
async function example_batch() {
  const prompts = [
    'Beautiful sunset over mountains',
    'Futuristic robot in cyberpunk city',
    'Serene forest with morning light',
    'Ocean waves crashing on beach',
    'Snow-capped mountains in winter'
  ];

  const response = await fetch('http://generatvideo.com/api/photo/batch-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompts: prompts,
      service: 'dalle',
      options: {
        size: '1024x1024',
        quality: 'standard'
      }
    })
  });

  const data = await response.json();
  console.log(`Generated ${data.successCount} out of ${data.batchSize} images`);
  return data;
}

// Example 4: Get Photo Generation Models
async function example_photo_models() {
  const response = await fetch('http://generatvideo.com/api/photo/models');
  const data = await response.json();
  
  console.log('Available Models:');
  data.available_models.forEach(model => {
    console.log(`- ${model.name}: ${model.description}`);
    console.log(`  Cost: ${model.costPerImage}`);
    console.log(`  Latency: ${model.latency}`);
  });
  
  return data;
}

// ============================================
// VIDEO GENERATION EXAMPLES
// ============================================

// Example 5: Text-to-Video Generation
async function example_text_to_video() {
  const response = await fetch('http://generatvideo.com/api/video/generate-text-to-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'A serene forest with rays of sunlight breaking through trees, birds flying peacefully, gentle breeze moving leaves, cinematic camera movement',
      duration: 10,
      fps: 30,
      resolution: '1080p',
      style: 'cinematic'
    })
  });

  const data = await response.json();
  console.log('Job ID:', data.jobId);
  console.log('Status:', data.status);
  
  // Poll for completion
  checkVideoCompletion(data.jobId);
  return data;
}

// Example 6: Image Sequence to Video
async function example_image_to_video() {
  const imageUrls = [
    'https://generatvideo.com/image1.jpg',
    'https://generatvideo.com/image2.jpg',
    'https://generatvideo.com/image3.jpg',
    'https://generatvideo.com/image4.jpg',
    'https://generatvideo.com/image5.jpg'
  ];

  const response = await fetch('http://generatvideo.com/api/video/generate-from-images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageUrls: imageUrls,
      duration: 5,
      fps: 30,
      transitionType: 'fade'
    })
  });

  const data = await response.json();
  console.log('Video Job Created:', data.jobId);
  checkVideoCompletion(data.jobId);
  return data;
}

// Example 7: Get Video Job Status
async function example_video_status(jobId) {
  const response = await fetch(`http://generatvideo.com/api/video/job/${jobId}`);
  const job = await response.json();
  
  console.log('Job Status:', job.status);
  console.log('Type:', job.type);
  if (job.result) {
    console.log('Result:', job.result);
  }
  
  return job;
}

// Example 8: Get All Video Jobs
async function example_all_video_jobs() {
  const response = await fetch('http://generatvideo.com/api/video/jobs');
  const data = await response.json();
  
  console.log(`Total Jobs: ${data.totalJobs}`);
  data.jobs.forEach(job => {
    console.log(`- ${job.jobId}: ${job.status} (${job.type})`);
  });
  
  return data;
}

// ============================================
// IMAGE ANALYSIS EXAMPLES
// ============================================

// Example 9: Analyze Image
async function example_analyze_image() {
  const response = await fetch('http://generatvideo.com/api/analysis/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageUrl: 'https://generatvideo.com/image.jpg',
      analysisType: 'general'  // general, aesthetic, technical, content
    })
  });

  const data = await response.json();
  console.log('Analysis:');
  console.log(data.result.analysis);
  return data;
}

// Example 10: Aesthetic Analysis
async function example_aesthetic_analysis() {
  const response = await fetch('http://generatvideo.com/api/analysis/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageUrl: 'https://generatvideo.com/beautiful-image.jpg',
      analysisType: 'aesthetic'
    })
  });

  const data = await response.json();
  console.log('Aesthetic Analysis:');
  console.log(data.result.analysis);
  return data;
}

// Example 11: Compare Two Images
async function example_compare_images() {
  const response = await fetch('http://generatvideo.com/api/analysis/compare-images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageUrl1: 'https://generatvideo.com/image1.jpg',
      imageUrl2: 'https://generatvideo.com/image2.jpg'
    })
  });

  const data = await response.json();
  console.log('Image 1 Analysis:', data.comparison.image1.analysis);
  console.log('Image 2 Analysis:', data.comparison.image2.analysis);
  return data;
}

// Example 12: Batch Image Analysis
async function example_batch_analysis() {
  const imageUrls = [
    'https://generatvideo.com/image1.jpg',
    'https://generatvideo.com/image2.jpg',
    'https://generatvideo.com/image3.jpg',
    'https://generatvideo.com/image4.jpg',
    'https://generatvideo.com/image5.jpg'
  ];

  const response = await fetch('http://generatvideo.com/api/analysis/batch-analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageUrls: imageUrls,
      analysisType: 'general'
    })
  });

  const data = await response.json();
  console.log(`Successfully analyzed ${data.successCount} out of ${data.totalImages} images`);
  
  data.results.forEach(result => {
    console.log(`\n[${result.index}] ${result.imageUrl}`);
    console.log(result.analysis);
  });
  
  return data;
}

// Example 13: Quality Score
async function example_quality_score() {
  const response = await fetch('http://generatvideo.com/api/analysis/quality-score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageUrl: 'https://generatvideo.com/image.jpg'
    })
  });

  const data = await response.json();
  console.log('Quality Score:', data.qualityScore.overall);
  console.log('Resolution:', data.qualityScore.resolution);
  console.log('Color Balance:', data.qualityScore.colorBalance);
  console.log('Composition:', data.qualityScore.composition);
  console.log('Recommendations:', data.qualityScore.recommendations);
  
  return data;
}

// Example 14: Generate Prompt from Image
async function example_generate_prompt() {
  const response = await fetch('http://generatvideo.com/api/analysis/generate-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageUrl: 'https://generatvideo.com/image.jpg',
      promptType: 'comprehensive'
    })
  });

  const data = await response.json();
  console.log('Original Analysis:');
  console.log(data.originalAnalysis);
  console.log('\nGenerated Prompt:');
  console.log(data.generatedPrompt);
  
  return data;
}

// ============================================
// STATUS & MONITORING EXAMPLES
// ============================================

// Example 15: Check Model Status
async function example_model_status() {
  const response = await fetch('http://generatvideo.com/api/status/models');
  const data = await response.json();
  
  console.log('Service Status:');
  for (const [key, service] of Object.entries(data.services)) {
    console.log(`${service.name}: ${service.status}`);
    console.log(`  Models: ${service.models.join(', ')}`);
  }
  
  console.log(`\nConfigured Services: ${data.summary.configuredServices}/${data.summary.totalServices}`);
  return data;
}

// Example 16: System Health Check
async function example_health_check() {
  const response = await fetch('http://generatvideo.com/api/status/health');
  const data = await response.json();
  
  console.log('System Health:');
  console.log(`Status: ${data.status}`);
  console.log(`Uptime: ${Math.floor(data.uptime)} seconds`);
  console.log(`Memory: ${data.memory.used}MB / ${data.memory.total}MB`);
  console.log(`Node: ${data.system.nodeVersion}`);
  
  return data;
}

// Example 17: Get Usage Statistics
async function example_usage_stats() {
  const response = await fetch('http://generatvideo.com/api/status/usage');
  const data = await response.json();
  
  console.log('Monthly Statistics:');
  console.log(`Photos Generated: ${data.statistics.photosGenerated}`);
  console.log(`Videos Generated: ${data.statistics.videosGenerated}`);
  console.log(`Images Analyzed: ${data.statistics.imagesAnalyzed}`);
  console.log(`Total API Calls: ${data.statistics.totalApiCalls}`);
  console.log(`Average Latency: ${data.statistics.averageLatency}`);
  
  console.log('\nEstimated Costs:');
  console.log(`Total: ${data.costs.estimated}`);
  data.costs.breakdown && Object.entries(data.costs.breakdown).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  
  return data;
}

// Example 18: List Available Video Models
async function example_video_models() {
  const response = await fetch('http://generatvideo.com/api/video/models');
  const data = await response.json();
  
  console.log('Available Video Models:');
  data.available_models.forEach(model => {
    console.log(`\n${model.name}`);
    console.log(`Type: ${model.type}`);
    console.log(`Description: ${model.description}`);
    console.log(`Max Duration: ${model.maxDuration}s`);
    console.log(`Cost: ${model.costPerVideo}`);
  });
  
  return data;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Poll for video completion
function checkVideoCompletion(jobId, maxAttempts = 60) {
  let attempts = 0;
  
  const interval = setInterval(async () => {
    attempts++;
    const job = await example_video_status(jobId);
    
    if (job.status === 'completed') {
      console.log('✅ Video generation completed!');
      clearInterval(interval);
      return job;
    } else if (job.status === 'failed') {
      console.log('❌ Video generation failed!');
      clearInterval(interval);
      return null;
    } else if (attempts >= maxAttempts) {
      console.log('⏱️ Video generation timeout');
      clearInterval(interval);
      return null;
    }
  }, 5000); // Check every 5 seconds
}

// ============================================
// CURL COMMAND EXAMPLES
// ============================================

/*

// Generate Photo with DALL-E 3
curl -X POST http://generatvideo.com/api/photo/generate-dalle \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Beautiful sunset over mountains",
    "size": "1024x1024",
    "quality": "hd",
    "style": "vivid"
  }'

// Generate Photo with Stability AI
curl -X POST http://generatvideo.com/api/photo/generate-stability \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Futuristic robot",
    "width": 1024,
    "height": 1024,
    "steps": 50
  }'

// Generate Video
curl -X POST http://generatvideo.com/api/video/generate-text-to-video \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A serene forest",
    "duration": 10,
    "resolution": "1080p",
    "style": "cinematic"
  }'

// Analyze Image
curl -X POST http://generatvideo.com/api/analysis/image \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://generatvideo.com/image.jpg",
    "analysisType": "general"
  }'

// Check Service Status
curl http://generatvideo.com/api/status/models

// Health Check
curl http://generatvideo.com/api/status/health

*/

export {
  // Photo Examples
  example_dalle,
  example_stability,
  example_batch,
  example_photo_models,
  
  // Video Examples
  example_text_to_video,
  example_image_to_video,
  example_video_status,
  example_all_video_jobs,
  
  // Analysis Examples
  example_analyze_image,
  example_aesthetic_analysis,
  example_compare_images,
  example_batch_analysis,
  example_quality_score,
  example_generate_prompt,
  
  // Status Examples
  example_model_status,
  example_health_check,
  example_usage_stats,
  example_video_models,
  
  // Utilities
  checkVideoCompletion
};
