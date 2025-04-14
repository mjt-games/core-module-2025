#!/usr/bin/env bash

set -euo pipefail
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

BUILD_DIR="${1:-dist}"
BRANCH_NAME="${2:-build}"

# Abort if working directory is dirty
if [[ -n "$(git status --porcelain)" ]]; then
  echo "❌ You have uncommitted changes. Please commit or stash them first."
  git status
  exit 1
fi

# Save the current branch name and set up trap to return on exit
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
trap "git checkout $CURRENT_BRANCH" EXIT

pnpm run changelog
git add CHANGELOG.md
git commit -m "Update changelog"
git remote | xargs -I {} git push {} --all

echo "🌿 Creating branch '$BRANCH_NAME' at HEAD..."
git checkout -B "$BRANCH_NAME"

echo "🚧 Running build..."
pnpm run build

# Ensure build directory exists
if [[ ! -d "$BUILD_DIR" ]]; then
  echo "❌ Build directory does not exist. Is '${BUILD_DIR}' correct for build artifacts?"
  exit 1
fi

echo "📚 Running docs..."
pnpm run docs

echo "📦 Committing build and doc artifacts..."
git add -f "$BUILD_DIR"/. "$BUILD_DIR"/*
git add -A docs
git commit -m "Added build artifacts"

"${SCRIPT_DIR}/version.sh"