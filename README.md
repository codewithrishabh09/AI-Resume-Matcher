# 🤖 ResumeAI

# 🚀 AI-Powered Resume & Job Matching Platform

![ResumeAI Banner](https://img.shields.io/badge/ResumeAI-v1.0.0-violet?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Python-3.10-3776AB?style=for-the-badge&logo=python)
![ML](https://img.shields.io/badge/ML-XGBoost-FF6600?style=for-the-badge)

## Match the right talent with the right job using Machine Learning**

[Live Demo](https://resumeai-frontend.onrender.com) • [API Docs](https://resumeai-backend.onrender.com/docs) • [Report Bug](https://github.com/YOUR_USERNAME/ai-resume-matcher/issues)

</div>

---

## 📌 Table of Contents

✨ Overview
🔥 Core Capabilities
🏗️ System Architecture
🛠️ Technology Stack
🧠 ML Pipeline
🚀 Getting Started
⚙️ Environment Variables
📡 API Reference
🐳 Docker
☁️ Deployment
📁 Project Structure
🔐 Security & Reliability
🔄 Development Workflow
🤝 Contributing
📄 License
👨‍💻 Author

---

## ✨ Overview

ResumeAI helps connect job seekers and employers using Machine Learning.

The platform processes a resume, extracts relevant information, compares it against job requirements, and produces a compatibility score.

### Key Highlights

- **ML-Powered Matching** — XGBoost classifier + Sentence Transformers for semantic similarity
- **Real-time Analysis** — Match score, skill gap, and recommendations in under 2 seconds
- **Role-Based System** — Separate dashboards for Job Seekers and Employers
- **Background Processing** — Celery workers handle heavy ML tasks asynchronously
- **Production Ready** — Rate limiting, caching, JWT auth, and Docker support

---

## 👥 Two Main User Roles

### 🙋 Job Seekers

Upload resumes, discover relevant jobs, analyze compatibility, and track applications.

## 🏢 Employers

Create job listings, evaluate candidate matches, and manage applications.

## 🔥 Core Capabilities

### 🙋 For Job Seekers

- 📄 Upload resumes in PDF/DOCX format
- 🤖 Generate AI-powered 0–100% match scores
- 🔍 Browse active job listings
- 🔎 Search available jobs
- 📊 Analyze skill gaps
- 💡 Get learning recommendations
- 📨 Apply to jobs
- 📱 Track submitted applications

### 🏢 For Employers

- 💼 Create job listings
- 🧩 Define required skills
- 🏆 View ML-ranked candidate matches
- 👥 Manage applications
- 📊 Analyze candidate/job skill overlap
- 🔄 Update application statuses

### ⚡ Platform Capabilities

- 🔐 JWT authentication
- 👤 Role-based access control
- 🗄️ PostgreSQL persistence
- ⚡ Redis caching
- 🔄 Celery background processing
- 🛡️ API rate limiting
- 📡 RESTful API
- 📚 Swagger/OpenAPI documentation
- 🐳 Docker support
- ☁️ Render deployment

---

## 🛠️ Technology Stack

### ⚡ Backend

| Technology | Version | Purpose |
| ------------ | --------- | --------- |
| FastAPI | 0.109.0 | REST API framework |
| PostgreSQL | 15.x | Primary database |
| Redis | 7.x | Caching + message broker |
| Celery | 5.3.6 | Background task queue |
| SQLAlchemy | 2.0.25 | ORM |
| Alembic | 1.13.1 | Database migrations |
| JWT | 3.3.0 | Authentication |
| SlowAPI | 0.1.9 | Rate limiting |

### Machine Learning

| Technology | Version | Purpose |
| ------------ | --------- | --------- |
| XGBoost | 2.0.3 | Match classification |
| Sentence-Transformers | 2.3.1 | Semantic embeddings |
| Scikit-learn | 1.4.0 | ML utilities |
| NLTK | 3.8.1 | Text processing |
| Pandas | 2.2.0 | Data manipulation |
| NumPy | 1.26.3 | Numerical computing |

### Frontend

| Technology | Version | Purpose |
| ------------ | --------- | --------- |
| React | 18.2.0 | UI framework |
| Vite | 5.1.0 | Build tool |
| Tailwind CSS | 3.4.1 | Styling |
| Zustand | 4.5.0 | State management |
| Axios | 1.6.0 | HTTP client |
| React Router | 6.22.0 | Navigation |
| Lucide React | 0.383.0 | Icons |

---

## 🏗️ System Architecture

                    ┌──────────────────────┐
                    │      Frontend        │
                    │    React / Vite      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      FastAPI         │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌────────────┐   ┌─────────────┐
       │ PostgreSQL │   │   Redis    │   │ AI / ML     │
       │  Database  │   │   Cache    │   │  Pipeline   │
       └────────────┘   └────────────┘   └──────┬──────┘
                                                │
                                                ▼
                                      ┌──────────────────┐
                                      │ Resume + Job     │
                                      │ Semantic Matching│
                                      └──────────────────┘

---

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- 🐍 Python 3.10+
- 🟢 Node.js 18+
- 🐘 PostgreSQL 15+
- ⚡ Redis 7+
- 🐙 Git
- 🐳 Docker (optional)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-resume-matcher.git
cd ai-resume-matcher
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
Activate environment — Linux/macOS
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK resources
python -c "import nltk; nltk.download('stopwords'); nltk.download('punkt')"
```

### 4. 🗄️ Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE resumematcher;"

# Create tables
python -c "from app.core.database import create_tables; create_tables()"
```

### 5. Train ML Model

```bash
set -x PYTHONPATH (pwd)   # Fish shell
# export PYTHONPATH=$(pwd) # Bash

python -m ml.src.train
```

### 6. Start Services

**Terminal 1 — Backend:**

```bash
cd backend
set -x PYTHONPATH (pwd)
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Celery Worker:**

```bash
cd backend
set -x PYTHONPATH (pwd)
celery -A app.workers.celery_app worker --loglevel=info
```

**Terminal 3 — Frontend:**

```bash
cd frontend
npm install
npm run dev
```

### Complete Setup Guide - Run All Services

cd backend
pkill -f uvicorn
pkill -f celery

### Start PostgreSQL

sudo systemctl start postgresql

### Start Redis

sudo systemctl start redis

### Start Celery worker

celery -A app.workers.celery_app worker --loglevel=info &

### Start FastAPI

uvicorn app.main:app --reload &

### Start frontend

npm run dev

### 7. Open in Browser

| Service | URL |

|---------|-----|
<!-- | Frontend | http://localhost:5173 |
| API Docs | http://localhost:8000/docs |
| Flower Monitor | http://localhost:5555 | -->

---

## 📡 API Documentation

### Authentication

POST /auth/register Register new user
POST /auth/login Login and get JWT token
GET /auth/me Get current user

### Resumes

POST /resumes/upload Upload resume PDF/DOCX
GET /resumes/ List all resumes
GET /resumes/{id} Get resume by ID
DELETE /resumes/{id} Delete resume

### Jobs

POST /jobs/ Create job listing
GET /jobs/ List all jobs (paginated)
GET /jobs/{id} Get job by ID
PATCH /jobs/{id} Update job
DELETE /jobs/{id} Delete job

### Matching

POST /applications/{job_id} Apply for job
GET /applications/my My applications
GET /applications/job/{id} Job applications (employer)
PATCH /applications/{id}/status Update status

### 🧠 ML Pipeline

ResumeAI transforms an uploaded resume into a job compatibility score through multiple processing stages.

PDF/DOCX Upload
↓
Text Extraction (pdfplumber/mammoth)
↓
Text Cleaning & Preprocessing
↓
Skill Extraction (regex + skills DB)
↓
Semantic Embeddings (Sentence-Transformers)
↓
Feature Vector (7 features)
↓
XGBoost Classifier
↓
Match Score (0-100%) + Skill Gap

### Features used by ML model

1. **Semantic Similarity** — Cosine similarity of embeddings
2. **Skill Match %** — Matching skills / required skills
3. **Experience Score** — Years of experience normalized
4. **Word Overlap** — Common words between resume and job
5. **Resume Skill Count** — Total skills in resume
6. **Job Skill Count** — Total skills required
7. **Matched Skill Count** — Exact skill matches

---

## 🐳 Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Services:
# - FastAPI: http://localhost:8000
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
# - Celery Worker: background
```

## 📁 Project Structure

ai-resume-matcher/
├── backend/
│ ├── app/
│ │ ├── api/routes/ # FastAPI endpoints
│ │ ├── core/ # Config, DB, security
│ │ ├── models/ # SQLAlchemy models
│ │ ├── schemas/ # Pydantic schemas
│ │ ├── services/ # Business logic
│ │ ├── ml/ # ML pipeline
│ │ │ ├── preprocessing/ # Text cleaning
│ │ │ ├── features/ # Embeddings, TF-IDF
│ │ │ ├── models/ # ML models
│ │ │ ├── inference/ # Prediction
│ │ │ └── artifacts/ # Saved models
│ │ ├── workers/ # Celery tasks
│ │ └── utils/ # File parsers
│ ├── ml/
│ │ ├── notebooks/ # Jupyter notebooks
│ │ └── src/ # Training scripts
│ ├── requirements.txt
│ └── Dockerfile
│
├── frontend/
│ ├── src/
│ │ ├── api/ # Axios client
│ │ ├── components/ # Reusable components
│ │ ├── pages/
│ │ │ ├── seeker/ # Job seeker pages
│ │ │ └── employer/ # Employer pages
│ │ └── store/ # Zustand state
│ ├── package.json
│ └── vite.config.js
│
├── render.yaml # Render deployment config
├── .gitignore
└── README.md

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Rishabh** — AI Resume Matcher

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/codewithrishabh09)

---

## Built with ❤️ using FastAPI + React + Machine Learning**

⭐ Star this repo if you found it helpful!

## 📈 Future Improvements

The project is designed to evolve into a more advanced AI recruitment platform.

Planned improvements include:

🔹 LLM-powered resume analysis
🔹 RAG-based job recommendations
🔹 Candidate ranking system
🔹 Personalized resume improvement suggestions
🔹 AI-generated interview questions
🔹 Resume ATS optimization
🔹 Job recommendation engine
🔹 Candidate skill visualization
🔹 Advanced semantic search
🔹 Background processing with Celery
🔹 Kafka-based event processing
🔹 Kubernetes deployment
🔹 CI/CD pipeline
🔹 Automated testing with PyTest
