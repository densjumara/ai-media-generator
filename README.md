# AI Media Generator - Aplikasi Pembuat Video & Foto dengan AI Terbaru

## 📋 Daftar Isi
1. [Gambaran Umum](#gambaran-umum)
2. [Teknologi & API](#teknologi--api)
3. [Instalasi & Setup](#instalasi--setup)
4. [Cara Penggunaan](#cara-penggunaan)
5. [API Documentation](#api-documentation)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Gambaran Umum

**AI Media Generator** adalah aplikasi web full-stack untuk membuat **video** dan **foto berkualitas tinggi** menggunakan teknologi AI terbaru dan tercanggih di dunia.

### ✨ Fitur Utama

#### 📸 Pembuat Foto (Photo Generation)
- **DALL-E 3** (OpenAI) - Foto ultra-realistis dengan understanding bahasa natural
- **Stable Diffusion XL** (Stability AI) - Cepat, efisien, dan hemat biaya
- **Replicate** - Model fleksibel dengan pilihan multiple model
- **Batch Generation** - Generate multiple images sekaligus
- **Image Analysis** - Analisis dan deskripsi otomatis gambar

#### 🎬 Pembuat Video (Video Generation)
- **Text-to-Video** - Ubah deskripsi teks menjadi video
- **Runway Gen-3** - Video generation dengan physics realistis
- **Image-to-Video** - Deretan gambar menjadi video smooth
- **Video Analysis** - Ekstrak dan analisis frame video

#### 🔍 AI Analysis
- Analisis estetika gambar
- Analisis teknis (resolusi, warna, komposisi)
- Kategorisasi otomatis konten
- Generate prompt dari gambar
- Batch analysis hingga 50 gambar

---

## 🚀 Teknologi & API

### Backend Stack
- **Framework**: Node.js + Express.js
- **Runtime**: ES6+ Modules
- **API Clients**: Axios
- **Image Processing**: Sharp
- **Video Processing**: FFmpeg + Fluent-FFmpeg
- **File Upload**: Multer

### Supported AI Services

| Service | Teknologi | Best For | Cost | Latency |
|---------|-----------|----------|------|---------|
| **DALL-E 3** | OpenAI | Photo ultra-realistic | $0.04-0.20/image | 15-60 sec |
| **Stable Diffusion XL** | Stability AI | Fast generation | $0.01-0.03/image | 5-30 sec |
| **Replicate** | Community Models | Fleksibel | $0.005-0.02/image | 10-45 sec |
| **Runway Gen-3** | Runway ML | Video generation | $0.10-0.20/video | 1-3 min |
| **GPT-4V** | OpenAI | Image analysis | $0.01-0.03/image | 5-15 sec |

---

## 💾 Instalasi & Setup

### 1. Prerequisites
```bash
# Node.js v18+ dan npm
node --version  # v18.0.0 atau lebih
npm --version   # v9.0.0 atau lebih

# Optional: FFmpeg untuk video processing
ffmpeg --version
```

### 2. Clone & Install
```bash
# Navigate ke project directory
cd "Aplikasi VIDEO AI"

# Install dependencies
npm install
```

### 3. Setup API Keys
```bash
# Copy template env file
cp .env.example .env

# Edit .env dan isi API keys:
```

**`.env` Configuration:**
```env
# OpenAI (untuk DALL-E 3 & GPT-4V)
OPENAI_API_KEY=sk-...

# Stability AI (untuk Stable Diffusion XL)
STABILITY_API_KEY=sk-...

# Replicate (untuk multiple models)
REPLICATE_API_TOKEN=r8_...

# Runway ML (untuk video generation)
RUNWAY_API_KEY=api_...

# Hugging Face (optional)
HUGGINGFACE_API_KEY=hf_...

# Server config
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### 4. Cara Mendapatkan API Keys

#### OpenAI (DALL-E 3 & GPT-4V)
1. Buka https://platform.openai.com
2. Login atau daftar akun
3. Pergi ke [API Keys](https://platform.openai.com/api-keys)
4. Klik "Create new secret key"
5. Copy key dan simpan di `.env`

#### Stability AI (Stable Diffusion XL)
1. Buka https://platform.stability.ai
2. Login atau daftar
3. Pergi ke API Keys
4. Generate API key baru
5. Copy dan simpan di `.env`

#### Replicate
1. Buka https://replicate.com
2. Login atau daftar
3. Pergi ke [API Tokens](https://replicate.com/account/api-tokens)
4. Copy API token
5. Simpan di `.env`

#### Runway ML
1. Buka https://runwayml.com
2. Login atau daftar
3. Pergi ke API settings
4. Generate API key
5. Simpan di `.env`

### 5. Run Application
```bash
# Development mode (dengan hot reload)
npm run dev

# Production mode
npm start

# Buka di browser
http://localhost:5000
```

---

## 📖 Cara Penggunaan

### 1. Membuat Foto dengan DALL-E 3

**Langkah:**
1. Pilih tab "📸 Foto"
2. Di card "Generate dengan DALL-E 3", masukkan deskripsi
3. Pilih ukuran gambar (1024x1024, landscape, atau portrait)
4. Pilih kualitas (Standard atau HD)
5. Klik "✨ Generate Gambar"
6. Tunggu proses (15-60 detik)
7. Gambar muncul di bawah
8. Klik untuk preview, download, atau share

**Contoh Prompt yang Baik:**
```
Luxury yacht sailing in Mediterranean Sea at sunset, 
photorealistic, 4K, professional photography, 
golden hour lighting, calm waters, detailed
```

### 2. Membuat Foto dengan Stability AI

**Langkah:**
1. Pilih tab "📸 Foto"
2. Di card "Generate dengan Stability AI", masukkan deskripsi
3. Adjust "Steps" slider (20-100, semakin tinggi semakin detail)
4. Pilih ukuran (512-1024px)
5. Klik "✨ Generate Gambar"
6. Tunggu (5-30 detik tergantung steps)

**Tips:**
- Untuk hasil cepat: gunakan 30-40 steps
- Untuk detail tinggi: gunakan 70-100 steps
- Cost lebih murah dari DALL-E 3

### 3. Batch Generation (Multiple Prompts)

**Langkah:**
1. Tab "📸 Foto" → Card "Batch Generation"
2. Masukkan prompts, satu per baris:
```
Sunset over mountains
Futuristic city skyline
Ocean waves at night
```
3. Pilih service (DALL-E, Stability, atau Replicate)
4. Klik "🚀 Generate Batch"
5. System generate semua sekaligus

### 4. Membuat Video dari Text

**Langkah:**
1. Pilih tab "🎥 Video"
2. Di card "Text-to-Video", masukkan deskripsi detail
3. Atur durasi (1-60 detik)
4. Pilih resolusi (720p, 1080p, 4K)
5. Pilih gaya (Cinematic, Documentary, Animation, Realistic)
6. Klik "🎥 Generate Video"
7. Tunggu (sistem akan notify ketika selesai)

**Contoh Video Prompt:**
```
A serene forest with rays of sunlight breaking through trees, 
birds flying peacefully, gentle breeze moving leaves, 
cinematic camera movement, ultra HD quality
```

### 5. Membuat Video dari Image Sequence

**Langkah:**
1. Tab "🎥 Video"
2. Di card "Image to Video":
   - Upload beberapa gambar (click atau drag-drop)
   - Atur durasi total video
   - Pilih tipe transisi (Fade, Slide, Dissolve, Wipe)
3. Klik "🎞️ Generate Video"

### 6. Analisis Gambar Otomatis

**Langkah:**
1. Tab "📸 Foto" → Card "Analisis Gambar"
2. Masukkan URL gambar
3. Pilih tipe analisis:
   - **General** - Deskripsi umum lengkap
   - **Aesthetic** - Analisis seni & estetika
   - **Technical** - Resolusi, warna, komposisi
   - **Content** - Objek & scene yang ada
4. Klik "🔬 Analisis"
5. Baca hasil analisis

### 7. Galeri & Download

**Fitur:**
- Semua hasil generate tersimpan di Galeri
- Preview dengan satu klik
- Download langsung sebagai file
- Share ke media sosial
- Search hasil berdasarkan keyword

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Photo Endpoints

#### 1. Generate dengan DALL-E 3
```http
POST /photo/generate-dalle
Content-Type: application/json

{
  "prompt": "A beautiful sunset over mountains",
  "size": "1024x1024",      // 1024x1024, 1792x1024, 1024x1792
  "quality": "hd",          // standard, hd
  "style": "vivid"          // natural, vivid
}
```

**Response:**
```json
{
  "success": true,
  "jobId": "abc123",
  "data": {
    "images": [
      {
        "url": "https://oaidalleapiprodpch.blob.core.windows.net/...",
        "model": "DALL-E 3",
        "revised_prompt": "..."
      }
    ],
    "usage": {
      "prompt_tokens": 0
    }
  }
}
```

#### 2. Generate dengan Stability AI
```http
POST /photo/generate-stability
Content-Type: application/json

{
  "prompt": "A futuristic robot",
  "width": 1024,
  "height": 1024,
  "steps": 50
}
```

#### 3. Batch Generation
```http
POST /photo/batch-generate
Content-Type: application/json

{
  "prompts": [
    "Prompt 1",
    "Prompt 2",
    "Prompt 3"
  ],
  "service": "dalle",  // dalle, stability, replicate
  "options": {}
}
```

#### 4. Image Analysis
```http
POST /photo/analyze
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg",
  "analysisType": "general"  // general, aesthetic, technical, content
}
```

#### 5. Get Job Status
```http
GET /photo/job/{jobId}
```

#### 6. List Available Models
```http
GET /photo/models
```

### Video Endpoints

#### 1. Text-to-Video
```http
POST /video/generate-text-to-video
Content-Type: application/json

{
  "prompt": "A beautiful forest",
  "duration": 10,
  "fps": 30,
  "resolution": "1080p",
  "style": "cinematic"
}
```

#### 2. Image to Video
```http
POST /video/generate-from-images
Content-Type: application/json

{
  "imageUrls": ["url1", "url2", "url3"],
  "duration": 5,
  "fps": 30,
  "transitionType": "fade"  // fade, slide, dissolve, wipe
}
```

#### 3. Get Video Job Status
```http
GET /video/job/{jobId}
```

#### 4. Get All Video Jobs
```http
GET /video/jobs
```

### Analysis Endpoints

#### 1. Analyze Image
```http
POST /analysis/image
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg",
  "analysisType": "general"
}
```

#### 2. Compare Images
```http
POST /analysis/compare-images
Content-Type: application/json

{
  "imageUrl1": "https://example.com/image1.jpg",
  "imageUrl2": "https://example.com/image2.jpg"
}
```

#### 3. Batch Analyze
```http
POST /analysis/batch-analyze
Content-Type: application/json

{
  "imageUrls": ["url1", "url2", ..., "url50"],
  "analysisType": "general"
}
```

### Status Endpoints

#### 1. Check Service Status
```http
GET /status/models
```

#### 2. Health Check
```http
GET /status/health
```

#### 3. Get Usage Statistics
```http
GET /status/usage
```

---

## 🎨 Frontend Features

### Dashboard Sections

1. **📸 Photo Generation**
   - DALL-E 3 generator
   - Stability AI generator
   - Batch generation
   - Image analyzer
   - Live results display

2. **🎥 Video Generation**
   - Text-to-video creator
   - Image-to-video converter
   - Video parameter settings
   - Status tracking

3. **🖼️ Gallery**
   - Browse semua hasil generate
   - Search functionality
   - Filter by type (photo/video)
   - Download & share

4. **⚙️ Settings**
   - API status monitor
   - Model preferences
   - System information
   - Usage statistics

---

## 📊 Performance & Optimization

### Best Practices

1. **Prompt Engineering**
   ```
   ❌ Bad: "a photo"
   ✅ Good: "Professional photography of a mountain sunset, 
             golden hour lighting, 4K, cinematic, detailed"
   ```

2. **Batch Processing**
   - Gunakan batch untuk multiple images sekaligus
   - Hemat waktu vs. generate satu-satu
   - Max 50 images per batch

3. **Model Selection**
   - DALL-E: Kualitas tertinggi, lebih mahal
   - Stability: Balance antara speed & cost
   - Replicate: Fleksibel, multiple models

4. **Video Generation**
   - Durasi lebih singkat = lebih cepat
   - Resolution lebih tinggi = lebih mahal
   - Gunakan descriptions detail untuk hasil baik

### Estimated Costs (Per Month)

| Usage | DALL-E | Stability | Replicate | Runway |
|-------|--------|-----------|-----------|--------|
| 100 photos | $8 | $2 | $1 | - |
| 50 videos | - | - | - | $5-10 |
| 100 analysis | $3 | - | - | - |

---

## 🐛 Troubleshooting

### Issue 1: "API Key not found"
**Solution:**
```bash
# 1. Check .env file exists
cat .env

# 2. Verify all required keys are present
# 3. Restart server: npm run dev
```

### Issue 2: "Service not configured"
**Solution:**
```bash
# Periksa API key di .env
# Pastikan format key benar
# Cek di /api/status/models untuk melihat service mana yang available
```

### Issue 3: Slow generation
**Solution:**
- DALL-E: Normal, latency 15-60 detik
- Stability: Kurangi steps untuk lebih cepat
- Check network connection
- Cek API rate limits

### Issue 4: CORS errors
**Solution:**
```bash
# Update .env
CORS_ORIGIN=your-frontend-url
```

### Issue 5: Video generation fails
**Solution:**
- Check FFmpeg installation
- Verify Runway API key
- Use Text-to-Video endpoint sebagai fallback

---

## 📚 Additional Resources

### Documentation
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Stability AI Docs](https://platform.stability.ai/docs)
- [Replicate Docs](https://replicate.com/docs)
- [Runway ML Docs](https://runway.com/docs)

### Prompt Engineering Guides
- [OpenAI Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- [Stable Diffusion Prompt Guide](https://huggingface.co/blog/stable_diffusion)

### Community
- OpenAI Community Forum
- Stability AI Discord
- Replicate Community

---

## 📝 License
MIT License - Bebas untuk commercial dan non-commercial use

## 👨‍💻 Development
Created: 2024
Last Updated: January 2026
Version: 1.0.0

---

**Happy Creating! 🚀✨**
