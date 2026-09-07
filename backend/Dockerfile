FROM python:3.11-slim

WORKDIR /app

RUN pip install --upgrade pip setuptools wheel

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN mkdir -p models

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]