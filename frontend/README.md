# 🤖 AI Resume Matcher

> Intelligent resume-to-job matching using machine learning and semantic analysis. Match candidates with jobs based on skills, experience, education, and more.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)

---

## ✨ Features

### 🎯 Core Matching
- **Multi-Factor Matching** - Not just skills! Matches based on:
  - Skills (35% weight)
  - Years of Experience (25% weight)
  - Education (15% weight)
  - Technologies (15% weight)
  - Certifications (5% weight)
  - Job Titles (5% weight)

### 🤖 Machine Learning
- **Trained ML Models** - RandomForest & GradientBoosting classifiers
- **Feature Extraction** - Intelligent parsing of resumes and job descriptions
- **Confidence Scoring** - 0-100% match score with confidence metrics
- **Semantic Analysis** - TF-IDF text similarity between resume and job

### 📊 Advanced Features
- **Skill Gap Analysis** - Shows missing and extra skills
- **Batch Matching** - Match multiple resumes against one job
- **Top Job Recommendations** - Find best matching jobs for a resume
- **Resume Ranking** - Rank resumes by match score for employers

### 🔐 Security & Scale
- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Prevent API abuse
- **Caching** - Redis for fast responses
- **Database** - PostgreSQL for persistent storage

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React/Vite)           │
│       https://vercel-deployed.com       │
└──────────────────┬──────────────────────┘
                   │ API Calls
                   ↓
┌─────────────────────────────────────────┐
│       Backend (FastAPI) - Port 8000     │
│   • Resume Matching API                 │
│   • User Authentication                 │
│   • ML Model Inference                  │
│   • Job & Resume Management             │
└──────┬───────────────┬──────────────────┘
       │               │
       ↓               ↓
┌─────────────┐  ┌──────────────┐
│ PostgreSQL  │  │ Redis Cache  │
│  Port 5432  │  │  Port 6379   │
└─────────────┘  └──────────────┘
```

---

## 📋 Tech Stack

### Backend
- **Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ML**: scikit-learn, NumPy, Pandas
- **Auth**: JWT, Python-Jose
- **Server**: Uvicorn 0.24.0

### Frontend
- **Framework**: React 18 / Vite
- **State**: Axios for API calls
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

### Deployment
- **Backend**: Render.com or Railway.app
- **Frontend**: Vercel
- **Database**: Render PostgreSQL
- **Cache**: Render Redis

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for frontend dev)
- Python 3.11+ (optional, for local backend)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/codewithrisha bh09/AI-Resume-Matcher.git
cd AI-Resume-Matcher
```

### 2️⃣ Start All Services with Docker Compose

```bash
# Start all services (PostgreSQL, Redis, Backend, Frontend)
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
```

### 3️⃣ Test Services

```bash
# Backend health check
curl http://localhost:8000/health
# Expected: {"status": "Healthy"}

# Frontend
open http://localhost:3000

# API Docs
open http://localhost:8000/docs
```

### 4️⃣ Stop Services

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (delete data)
docker-compose down -v
```

---

## 📁 Project Structure

```
AI-Resume-Matcher/
├── backend/                          # FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/              # API endpoints
│   │   │       ├── auth.py
│   │   │       ├── resumes.py
│   │   │       ├── jobs.py
│   │   │       ├── matching.py
│   │   │       └── users.py
│   │   ├── core/
│   │   │   ├── config.py            # Configuration
│   │   │   ├── security.py          # JWT & Auth
│   │   │   └── database.py          # DB Connection
│   │   ├── ml/
│   │   │   ├── models/              # ML Models
│   │   │   │   ├── resume_matcher_model.py
│   │   │   │   └── similarity.py
│   │   │   ├── inference/           # Model Inference
│   │   │   │   ├── matcher.py
│   │   │   │   └── predictor.py
│   │   │   ├── training/            # Training Pipeline
│   │   │   │   ├── train.py
│   │   │   │   └── training_data.py
│   │   │   └── features/            # Feature Extraction
│   │   ├── preprocessing/
│   │   │   └── skill_extractor.py   # Extract skills & features
│   │   ├── services/
│   │   │   ├── matching_service.py
│   │   │   ├── resume_service.py
│   │   │   └── job_service.py
│   │   ├── models/                  # Database Models (SQLAlchemy)
│   │   ├── schemas/                 # Pydantic Schemas
│   │   └── main.py                  # FastAPI App Entry
│   ├── models/                       # Saved ML Models (.pkl)
│   ├── data/                         # Training Data
│   ├── uploads/                      # User Resume Uploads
│   ├── requirements.txt              # Python Dependencies
│   ├── Dockerfile                    # Docker Configuration
│   └── .env                          # Environment Variables
│
├── frontend/                         # React/Vite Frontend
│   ├── src/
│   │   ├── components/               # React Components
│   │   ├── pages/                    # Page Components
│   │   ├── services/                 # API Services
│   │   ├── hooks/                    # Custom Hooks
│   │   ├── context/                  # React Context
│   │   └── App.jsx
│   ├── package.json
│   ├── Dockerfile
│   ├── vite.config.js
│   └── .env                          # Frontend Config
│
├── docker-compose.yml                # Docker Compose Config
└── README.md                          # This File
```


## 📚 API Endpoints

POST   /api/auth/register              # Register new user
POST   /api/auth/login                 # Login
POST   /api/auth/refresh               # Refresh token

### Resumes

GET    /api/resumes                    # List user resumes
POST   /api/resumes/upload             # Upload resume
GET    /api/resumes/{resume_id}        # Get resume details
DELETE /api/resumes/{resume_id}        # Delete resume

### Jobs

GET    /api/jobs                       # List all jobs
POST   /api/jobs                       # Create new job
GET    /api/jobs/{job_id}              # Get job details
PUT    /api/jobs/{job_id}              # Update job
DELETE /api/jobs/{job_id}              # Delete job

### Matching

POST   /api/matching/match             # Match resume to job
POST   /api/matching/match-batch       # Match multiple resumes
GET    /api/matching/top-jobs/{resume_id}     # Get top jobs for resume
GET    /api/matching/top-resumes/{job_id}     # Get top resumes for job

### Health

GET    /health                         # Health check
GET    /                                # Root endpoint
GET    /docs                            # Swagger API Docs
GET    /redoc                           # ReDoc API Docs

## 🤖 ML Model Training

### Train Model Locally

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Train model
python app/ml/training/train.py
```

This creates:
- `models/resume_matcher_rf.pkl` - Trained RandomForest model
- `models/resume_matcher_rf_scaler.pkl` - Feature scaler

### Expected Output

```
🚀 Training model...
✅ Model trained and saved to models/resume_matcher_rf.pkl

✅ Model Performance:
   Accuracy:  0.8500
   Precision: 0.8333
   Recall:    0.8333
   F1:        0.8333
```

---

## 📊 Matching Algorithm

### Scoring System

```
Match Score = (Skill Match × 0.35) + 
              (Experience Match × 0.25) + 
              (Education Match × 0.15) + 
              (Technology Match × 0.15) + 
              (Certification Match × 0.05) + 
              (Job Title Match × 0.05)
```

### Interpretation

| Score | Interpretation |
|-------|-----------------|
| 85-100% | 🟢 Excellent Match |
| 70-84% | 🟡 Good Match |
| 50-69% | 🟠 Moderate Match |
| < 50% | 🔴 Poor Match |

### Example

```json
{
  "match_score": 87.5,
  "confidence": 0.92,
  "semantic_similarity": 78.2,
  "skill_match_percentage": 90.0,
  "matching_skills": ["python", "django", "postgresql"],
  "missing_skills": ["kubernetes"],
  "experience_years": 5,
  "recommendation": "HIGHLY RECOMMENDED",
  "summary": "HIGHLY RECOMMENDED — Skill match: 90.0%, Confidence: 92.0%"
}
```

---

## 🐳 Docker Commands

### Build & Run

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove everything (including data)
docker-compose down -v
```

### Individual Services

```bash
# Start only backend
docker-compose up -d backend

# Start only database
docker-compose up -d postgres

# Restart service
docker-compose restart backend

# Execute command in container
docker-compose exec backend python -m pytest
```

---

## 🚀 Deployment

### Deploy Backend to Render.com

1. Push code to GitHub
2. Go to https://dashboard.render.com
3. Create new Web Service
4. Connect GitHub repo
5. Configure:
   ```
   Root Directory: backend
   Build Command: Leave empty (uses Dockerfile)
   Start Command: Leave empty (uses Dockerfile)
   ```
6. Add Environment Variables:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/db
   REDIS_URL=redis://user:pass@host:port
   SECRET_KEY=your-key
   ```
7. Deploy

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Import project
4. Configure:
   ```
   Root Directory: frontend
   ```
5. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com
   ```
6. Deploy

### Update CORS

After deployment, update backend CORS in `app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-vercel-app.vercel.app",
        "https://your-backend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🧪 Testing

### Local Testing

```bash
# Run backend tests
cd backend
python -m pytest

# Run specific test
python -m pytest tests/test_matching.py -v

# With coverage
python -m pytest --cov=app
```

### API Testing

```bash
# Health check
curl http://localhost:8000/health

# Create job (requires auth)
curl -X POST http://localhost:8000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Senior Developer", "description": "5+ years", "required_skills": ["python", "django"]}'

# Match resume
curl -X POST http://localhost:8000/api/matching/match \
  -F "resume_file=@resume.pdf" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 Database Schema

### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50),  -- 'job_seeker', 'employer', 'admin'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Resumes
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  file_name VARCHAR(255),
  raw_text TEXT,
  extracted_skills TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Jobs
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  employer_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  required_skills TEXT[],
  experience_required INTEGER,
  status VARCHAR(50),  -- 'active', 'closed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Analyses
```sql
CREATE TABLE analyses (
  id UUID PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id),
  job_id UUID REFERENCES jobs(id),
  match_score FLOAT,
  matching_skills TEXT[],
  missing_skills TEXT[],
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🛠️ Development Guide

### Add New Endpoint

1. Create route file in `backend/app/api/routes/`
2. Define Pydantic schema in `backend/app/schemas/`
3. Implement service in `backend/app/services/`
4. Import router in `backend/app/api/__init__.py`
5. Add route to `app.main`

### Add New ML Feature

1. Add extraction logic to `backend/app/preprocessing/skill_extractor.py`
2. Update feature preparation in `backend/app/ml/models/resume_matcher_model.py`
3. Retrain model: `python app/ml/training/train.py`
4. Test predictions

### Update Frontend

1. Modify components in `frontend/src/components/`
2. Update API calls in `frontend/src/services/api.js`
3. Test locally: `npm start`
4. Push to GitHub → Auto-deploy on Vercel

---

## 📦 Dependencies

### Backend
- fastapi==0.104.1
- uvicorn==0.24.0
- sqlalchemy==2.0.23
- psycopg2-binary==2.9.9
- redis==5.0.1
- scikit-learn==1.3.2
- pandas==2.0.3
- numpy==1.24.3

### Frontend
- react==18.2.0
- axios==1.6.0
- react-router-dom==6.0.0
- tailwindcss==3.0.0

---

## 🔐 Security Best Practices

- ✅ Use `.env` for secrets (never commit)
- ✅ Enable HTTPS in production
- ✅ Validate & sanitize all inputs
- ✅ Use JWT for authentication
- ✅ Rate limit API endpoints
- ✅ Keep dependencies updated
- ✅ Use strong SECRET_KEY in production
- ✅ Enable CORS for specific origins only

---

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Check database connection
docker-compose logs postgres

# Check Redis connection
docker-compose logs redis

# View backend errors
docker-compose logs backend -f

# Restart services
docker-compose restart
```

### Frontend Can't Reach Backend

```bash
# Check API URL in .env
cat frontend/.env

# Test backend is running
curl http://localhost:8000/

# Check CORS settings in app/main.py
```

### Database Connection Error

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check credentials in docker-compose.yml
# Recreate database
docker-compose down -v
docker-compose up -d postgres
```

---

## 📞 Support & Contact

- **Issues**: Open GitHub issue
- **Discussions**: GitHub discussions
- **Email**: contact@example.com

---

## 📄 License

MIT License - See LICENSE file

---

## 🎉 Getting Started Checklist

- [ ] Clone repository
- [ ] Create `.env` files
- [ ] Run `docker-compose up -d`
- [ ] Test API at `http://localhost:8000/health`
- [ ] Open frontend at `http://localhost:3000`
- [ ] Train ML model (optional)
- [ ] Test resume matching
- [ ] Deploy to production

---

## 📈 Roadmap

- [ ] Advanced filtering & sorting
- [ ] Email notifications
- [ ] Resume templates
- [ ] Job recommendations via email
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app
- [ ] BERT embeddings for better matching
- [ ] Real-time notifications

---

**Happy Matching! 🚀**

Built with ❤️ by Rishabh