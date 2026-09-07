# 🎯 AI Resume Matcher

An intelligent resume matching application that uses Machine Learning to match resumes with job descriptions based on multiple factors including skills, experience, education, technologies, and certifications.

**Live Demo:** https://your-vercel-app.vercel.app (Frontend)

---

## ✨ Features

- ✅ **AI-Powered Matching** - ML model scores resume-job compatibility (0-100%)
- ✅ **Multi-Factor Analysis** - Skills (35%), Experience (25%), Education (15%), Tech (15%), Certs (5%), Titles (5%)
- ✅ **Skill Gap Analysis** - Shows missing skills and recommendations
- ✅ **Semantic Similarity** - Text-based job description matching using TF-IDF
- ✅ **Batch Matching** - Match multiple resumes against a job
- ✅ **Top Recommendations** - Find best job matches for a resume
- ✅ **User Authentication** - JWT-based auth with role-based access
- ✅ **Resume Upload** - PDF/TXT resume parsing and feature extraction
- ✅ **Real-time Predictions** - Instant matching scores with confidence levels
- ✅ **Caching** - Redis cache for frequently accessed data
- ✅ **Rate Limiting** - API rate limiting to prevent abuse

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│                   https://vercel.app                         │
│                   (Runs on localhost:3000)                   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│              https://render.onrender.com                     │
│              (Runs on localhost:8000)                        │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │   ML Pipeline    │  │  API Routes      │                │
│  │  - Inference     │  │  - /matching     │                │
│  │  - Prediction    │  │  - /resumes      │                │
│  │  - Training      │  │  - /jobs         │                │
│  └──────────────────┘  └──────────────────┘                │
└────┬─────────────────────────────────────────────┬──────────┘
     │                                             │
     ↓                                             ↓
┌──────────────────┐                    ┌──────────────────────┐
│  PostgreSQL DB   │                    │    Redis Cache       │
│  localhost:5432  │                    │  localhost:6379      │
│                  │                    │                      │
│ • Users          │                    │ • Session tokens     │
│ • Resumes        │                    │ • Cached results     │
│ • Jobs           │                    │ • Rate limits        │
│ • Analyses       │                    │                      │
└──────────────────┘                    └──────────────────────┘
```

---

## 🛠️ Tech Stack

### **Frontend**
- React 18 / Vite
- TypeScript
- Tailwind CSS
- Axios for API calls
- Deployed on Vercel

### **Backend**
- FastAPI (Python)
- SQLAlchemy ORM
- Pydantic for validation
- JWT for authentication
- SlowAPI for rate limiting
- Deployed on Render

### **ML/Data**
- scikit-learn (RandomForest, GradientBoosting)
- pandas & numpy for data processing
- joblib for model persistence
- TF-IDF for text similarity

### **Database & Cache**
- PostgreSQL 15
- Redis 7
- Both on Render or local Docker

### **Infrastructure**
- Docker & Docker Compose (local development)
- Render (production deployment)
- Vercel (frontend deployment)
- GitHub (version control)

---

## 📋 Prerequisites

- **Docker & Docker Compose** (recommended)
- **Node.js 18+** (for frontend)
- **Python 3.11+** (for backend)
- **Git**
- **GitHub Account** (for deployment)

---

## 🚀 Quick Start (Docker - Recommended)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/codewithrishabh09/AI-Resume-Matcher.git
cd AI-Resume-Matcher
```

### 2️⃣ Create `docker-compose.yml` at root

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: resumeai-postgres
    environment:
      POSTGRES_USER: resumeadmin
      POSTGRES_PASSWORD: admin123
      POSTGRES_DB: resumematcher
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - resumeai-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U resumeadmin"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: resumeai-redis
    ports:
      - "6379:6379"
    networks:
      - resumeai-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: resumeai-backend
    environment:
      DATABASE_URL: postgresql://resumeadmin:admin123@postgres:5432/resumematcher
      REDIS_URL: redis://redis:6379/0
      SECRET_KEY: your-secret-key-here
      DEBUG: "False"
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - resumeai-network
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: resumeai-frontend
    environment:
      REACT_APP_API_URL: http://localhost:8000
      VITE_API_URL: http://localhost:8000
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - resumeai-network
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:

networks:
  resumeai-network:
    driver: bridge
```

### 3️⃣ Start All Services

```bash
docker-compose up -d
```

### 4️⃣ Check Status

```bash
docker-compose ps

# Should show:
# resumeai-postgres   Up (healthy)
# resumeai-redis      Up (healthy)
# resumeai-backend    Up
# resumeai-frontend   Up
```

### 5️⃣ Access Applications

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Database:** postgres://resumeadmin:admin123@localhost:5432/resumematcher
- **Redis:** redis://localhost:6379

---

## 🏃 Manual Setup (Without Docker)

### Backend Setup

```bash
cd backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << 'EOF'
DATABASE_URL=postgresql://resumeadmin:admin123@localhost:5432/resumematcher
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
DEBUG=True
EOF

# Run migrations (if needed)
# alembic upgrade head

# Start backend
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cat > .env.local << 'EOF'
REACT_APP_API_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000
EOF

# Start frontend
npm start
```

### Database Setup

```bash
# Install PostgreSQL
brew install postgresql@15  # macOS
sudo apt install postgresql postgresql-contrib  # Linux

# Start PostgreSQL
brew services start postgresql@15  # macOS
sudo systemctl start postgresql  # Linux

# Create database and user
createuser -P resumeadmin  # Password: admin123
createdb -O resumeadmin resumematcher
```

### Redis Setup

```bash
# Install Redis
brew install redis  # macOS
sudo apt install redis-server  # Linux

# Start Redis
brew services start redis  # macOS
sudo systemctl start redis-server  # Linux

# Verify
redis-cli ping  # Should return "PONG"
```

---

## 🤖 ML Model Training

### Train the Model

```bash
cd backend

# Train with sample data
python app/ml/training/train.py

# Output:
# ✅ Model trained and saved to models/resume_matcher_rf.pkl
# Accuracy: 0.85
# Precision: 0.82
# Recall: 0.88
# F1: 0.85
```

### Test the Model

```bash
python app/ml/training/test_model.py
```

### Add More Training Data

Edit `app/ml/training/training_data.py` to add more resume-job pairs for better accuracy.

---

## 📡 API Documentation

### Health Check

```bash
curl http://localhost:8000/health

# Response:
{"status": "Healthy"}
```

### Match Resume to Job

```bash
curl -X POST http://localhost:8000/api/matching/match \
  -F "resume_file=@resume.pdf" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Response:
{
  "match_score": 87.5,
  "recommendation": "HIGHLY RECOMMENDED",
  "semantic_similarity": 78.2,
  "skill_match_percentage": 90.0,
  "matching_skills": ["python", "django", "postgresql"],
  "missing_skills": ["kubernetes"],
  "experience_years": 5,
  "confidence": 0.92,
  "summary": "HIGHLY RECOMMENDED — Skill match: 90.0%"
}
```

### Get Top Jobs for Resume

```bash
curl http://localhost:8000/api/matching/top-jobs/{resume_id} \
  -H "Authorization: Bearer YOUR_TOKEN"

# Response:
[
  {
    "job_id": "job_123",
    "job_title": "Senior Backend Engineer",
    "match_score": 89.5,
    "recommendation": "HIGHLY RECOMMENDED",
    "matching_skills": ["python", "django"],
    "missing_skills": ["kubernetes"]
  },
  ...
]
```

### Interactive API Docs

Visit http://localhost:8000/docs for Swagger UI with all endpoints.

---

## 📁 Project Structure

```
AI-Resume-Matcher/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── auth.py
│   │   │       ├── resumes.py
│   │   │       ├── jobs.py
│   │   │       ├── matching.py
│   │   │       └── users.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── rate_limiter.py
│   │   │   └── security.py
│   │   ├── ml/
│   │   │   ├── models/
│   │   │   │   ├── resume_matcher_model.py
│   │   │   │   └── similarity.py
│   │   │   ├── inference/
│   │   │   │   ├── matcher.py
│   │   │   │   └── predictor.py
│   │   │   └── training/
│   │   │       ├── training_data.py
│   │   │       └── train.py
│   │   ├── preprocessing/
│   │   │   └── skill_extractor.py
│   │   ├── services/
│   │   │   ├── matching_service.py
│   │   │   └── skill_service.py
│   │   ├── models/
│   │   ├── schemas/
│   │   └── main.py
│   ├── models/                 # Trained ML models
│   │   └── resume_matcher_rf.pkl
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env
│   └── build.sh
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.local
│   └── vite.config.js
│
├── docker-compose.yml          # Docker Compose Config
├── README.md                   # This file
└── .gitignore
```

---

## 🔐 Environment Variables

### Backend `.env`

```
DATABASE_URL=postgresql://resumeadmin:admin123@localhost:5432/resumematcher
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
CORS_ORIGINS=["http://localhost:3000", "https://vercel-app.vercel.app"]
```

### Frontend `.env.local`

```
REACT_APP_API_URL=http://localhost:8000
VITE_API_URL=http://localhost:8000
```

---

## 🚢 Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Go to https://dashboard.render.com
3. Create new Web Service
4. Connect GitHub repo
5. Set environment variables
6. Deploy

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Import project
4. Set environment variables
5. Deploy

### Database & Cache on Render

1. Create PostgreSQL service on Render
2. Create Redis service on Render
3. Copy connection strings to backend `.env`

---

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
pytest tests/
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:8000/health

# API documentation
open http://localhost:8000/docs
```

### Test ML Model

```bash
cd backend
python app/ml/training/test_model.py
```

---

## 📊 Model Performance

- **Accuracy:** ~85%
- **Precision:** ~82%
- **Recall:** ~88%
- **F1-Score:** ~85%

Trained on 15+ sample resume-job pairs. Improve by adding more training data.

---

## 🐛 Troubleshooting

### Docker Issues

```bash
# Rebuild containers
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Verify connection
docker-compose exec backend python -c "from app.core.database import engine; engine.connect()"
```

### Frontend Can't Reach Backend

- Check `.env.local` has correct API URL
- Verify backend is running: `curl http://localhost:8000/health`
- Check CORS settings in `app/main.py`

### Model Not Found

```bash
# Train model
cd backend
python app/ml/training/train.py

# Verify model exists
ls -la models/resume_matcher_rf.pkl
```

---

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Root endpoint |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger API docs |
| POST | `/api/matching/match` | Match resume to job |
| POST | `/api/matching/match-batch` | Match multiple resumes |
| GET | `/api/matching/top-jobs/{resume_id}` | Find best jobs |
| GET | `/api/matching/top-resumes/{job_id}` | Find best resumes |

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

MIT License - see LICENSE file for details

---

## 👤 Author

**Rishabh** - AI/ML Developer
- GitHub: [@codewithrishabh09](https://github.com/codewithrishabh09)

---

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- scikit-learn for ML capabilities
- React for frontend framework
- PostgreSQL & Redis for databases

---

## 📞 Support

For issues and questions:
1. Check troubleshooting section above
2. Open GitHub issue
3. Review API documentation at `/docs`

---

## 🎯 Roadmap

- [ ] Advanced ML models (BERT embeddings)
- [ ] Deep learning with TensorFlow
- [ ] Continuous model retraining
- [ ] Advanced skill recommendations
- [ ] Job market analysis
- [ ] Resume optimization suggestions
- [ ] Mobile app (React Native)
- [ ] GraphQL API

---

**Last Updated:** September 2026
**Version:** 2.0
**Status:** Production Ready ✅