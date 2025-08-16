#!/bin/bash

# Auto-push script for SanMargam website
# This script automatically commits and pushes changes to GitHub

echo "🚀 Starting automated push process..."

# Check if there are any changes to commit
if [[ -z $(git status --porcelain) ]]; then
    echo "✅ No changes to commit. Working tree is clean."
    exit 0
fi

# Add all changes
echo "📁 Adding all changes..."
git add .

# Get current timestamp for commit message
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Commit with timestamp
echo "💾 Committing changes..."
git commit -m "Auto-update: $TIMESTAMP"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

# Check if push was successful
if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 Your changes are now live at: https://harikun77.github.io/SanMargam/"
else
    echo "❌ Push failed. Please check your git status and try again."
    exit 1
fi
