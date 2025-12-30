# Subsidize Development Makefile
# Provides convenient shortcuts for common development tasks
# Compatible with IntelliJ IDEA's Makefile plugin

.PHONY: help install dev dev-web dev-api dev-worker dev-mobile dev-ios dev-android build clean db-setup db-migrate db-reset db-studio docker-up docker-down health-check format lint type-check test

# Default target - show help
help:
	@echo "Subsidize Development Commands"
	@echo "=============================="
	@echo ""
	@echo "Setup:"
	@echo "  make install       - Install all dependencies"
	@echo "  make setup         - First-time setup (env, deps, db)"
	@echo "  make health-check  - Verify prerequisites are installed"
	@echo ""
	@echo "Development:"
	@echo "  make dev           - Run full stack (web + API + worker)"
	@echo "  make dev-web       - Run web app only"
	@echo "  make dev-api       - Run API server only"
	@echo "  make dev-worker    - Run worker service only"
	@echo "  make dev-mobile    - Run mobile app (Expo)"
	@echo "  make dev-ios       - Run iOS simulator"
	@echo "  make dev-android   - Run Android emulator"
	@echo ""
	@echo "Database:"
	@echo "  make db-setup      - Setup database (migrate + seed)"
	@echo "  make db-migrate    - Run Prisma migrations"
	@echo "  make db-reset      - Reset database (WARNING: deletes data)"
	@echo "  make db-studio     - Open Prisma Studio GUI"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up     - Start PostgreSQL + Redis containers"
	@echo "  make docker-down   - Stop Docker containers"
	@echo ""
	@echo "Code Quality:"
	@echo "  make format        - Format code with Prettier"
	@echo "  make lint          - Run ESLint"
	@echo "  make type-check    - Run TypeScript type checking"
	@echo "  make test          - Run tests"
	@echo ""
	@echo "Build & Clean:"
	@echo "  make build         - Build all apps"
	@echo "  make clean         - Clean build artifacts and node_modules"

# Installation
install:
	@echo "📦 Installing dependencies..."
	pnpm install

# First-time setup
setup:
	@echo "🚀 Running first-time setup..."
	@./scripts/setup.sh

# Health check
health-check:
	@echo "🏥 Running health check..."
	@./scripts/health-check.sh

# Development commands
dev:
	@echo "🚀 Starting full stack development..."
	pnpm dev

dev-web:
	@echo "🌐 Starting web app..."
	pnpm dev:web

dev-api:
	@echo "⚡ Starting API server..."
	pnpm dev:api

dev-worker:
	@echo "⚙️  Starting worker service..."
	pnpm dev:worker

dev-mobile:
	@echo "📱 Starting mobile app (Expo)..."
	pnpm dev:mobile

dev-ios:
	@echo "🍎 Starting iOS simulator..."
	pnpm dev:ios

dev-android:
	@echo "🤖 Starting Android emulator..."
	pnpm dev:android

# Database commands
db-setup:
	@echo "🗄️  Setting up database..."
	@cd services/api && pnpm prisma generate && pnpm prisma migrate dev && pnpm prisma db seed

db-migrate:
	@echo "🗄️  Running database migrations..."
	@cd services/api && pnpm prisma migrate dev

db-reset:
	@echo "⚠️  Resetting database (this will delete all data)..."
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		cd services/api && pnpm prisma migrate reset; \
	fi

db-studio:
	@echo "🎨 Opening Prisma Studio..."
	@cd services/api && pnpm prisma studio

# Docker commands
docker-up:
	@echo "🐳 Starting Docker containers..."
	docker-compose up -d

docker-down:
	@echo "🐳 Stopping Docker containers..."
	docker-compose down

# Code quality
format:
	@echo "✨ Formatting code..."
	pnpm format

lint:
	@echo "🔍 Running linter..."
	pnpm lint

type-check:
	@echo "📘 Running type checks..."
	pnpm type-check

test:
	@echo "🧪 Running tests..."
	pnpm test

# Build
build:
	@echo "🏗️  Building all apps..."
	pnpm build

# Clean
clean:
	@echo "🧹 Cleaning build artifacts..."
	pnpm clean
	@echo "✅ Clean complete"
