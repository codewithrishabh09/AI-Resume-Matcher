FROM python:3.11-slim

WORKDIR /app

# Upgrade pip, setuptools, wheel first
RUN pip install --upgrade pip setuptools wheel

# Copy requirements
COPY requirements.txt .

# Install dependencies with --no-build-isolation
RUN pip install --no-build-isolation -r requirements.txt

# Copy app
COPY . .

# Create models directory
RUN mkdir -p models

# Run app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]