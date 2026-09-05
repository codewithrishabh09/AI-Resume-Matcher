#!/usr/bin/env bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
mkdir -p models
echo "Build completed successfully!"
