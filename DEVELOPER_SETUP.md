# Subsidize Developer Setup Guide

This guide will walk you through setting up the Subsidize development environment on your machine. The project is a Turborepo monorepo containing mobile (Expo), web (Next.js), API (Express), and worker apps.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Running Applications](#running-applications)
- [IntelliJ IDEA Setup](#intellij-idea-setup)
- [Xcode Setup (macOS only)](#xcode-setup-macos-only)
- [Database Setup](#database-setup)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### 1. Install Node.js via nvm

We recommend using nvm (Node Version Manager) to manage Node.js versions.

**macOS/Linux:**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload your shell configuration
source ~/.bashrc  # or ~/.zshrc for zsh

# Install Node.js 18 or later
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node --version  # Should be v18.x.x or later
npm --version
```

### 2. Install pnpm

```bash
npm install -g pnpm@8.15.1

# Verify installation
pnpm --version  # Should be 8.15.1 or compatible
```

### 3. Install Turbo (Optional - it's also installed locally)

```bash
npm install -g turbo

# Verify installation
turbo --version
```

### 4. Install Watchman (macOS - Required for React Native)

Watchman improves performance for React Native development.

```bash
# Using Homebrew
brew install watchman

# Verify installation
watchman --version
```

### 5. Install Xcode (macOS only - for iOS development)

1. Install Xcode from the Mac App Store (14.0 or later)
2. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```
3. Accept Xcode license:
   ```bash
   sudo xcodebuild -license accept
   ```

### 6. Install CocoaPods (macOS only - for iOS dependencies)

```bash
# Install CocoaPods via Homebrew
brew install cocoapods

# Or install via gem
sudo gem install cocoapods

# Verify installation
pod --version
```

### 7. Install PostgreSQL

**macOS:**
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb subsidize
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb subsidize
```

### 8. Install Redis

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis-server
```

## Initial Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Subsidize
```

### 2. Install dependencies

From the root of the monorepo:

```bash
pnpm install
```

This will install dependencies for all apps and packages in the monorepo.

### 3. Set up environment variables

Each app has an `.env.example` file. Copy these to create your `.env` files:

```bash
# API
cp services/api/.env.example services/api/.env

# Worker
cp services/worker/.env.example services/worker/.env

# Web
cp apps/web/.env.example apps/web/.env

# Mobile
cp apps/mobile/.env.example apps/mobile/.env
```

Edit each `.env` file with your local configuration (database URLs, ports, etc.).

### 4. Build shared packages

Before running any apps, build the shared packages:

```bash
pnpm --filter @subsidize/shared build
pnpm --filter @subsidize/ui build
```

Or use turbo to build everything:

```bash
turbo build --filter=@subsidize/shared --filter=@subsidize/ui
```

## Running Applications

### Running the Full Stack (Recommended)

To run the complete Subsidize platform with API, database, and frontend:

#### 1. Set up the database

First, ensure PostgreSQL is running and set up the database:

```bash
# From repository root
cd services/api

# Copy environment file if you haven't already
cp .env.example .env

# Generate Prisma Client
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Seed with sample data (3 stores, 10 products, prices)
pnpm db:seed
```

You should see output confirming:
- 3 stores created (MarketPlace, Lindo's, Supermart)
- 10 products created
- Store products and price observations created

#### 2. Start the API server

```bash
# From services/api directory
pnpm dev

# Or from repository root
pnpm --filter api dev
```

The API will start at `http://localhost:3001`. You should see:
```
🚀 API server running on http://localhost:3001
📊 Health check available at http://localhost:3001/health
📚 API Documentation: http://localhost:3001/api-docs
```

Visit `http://localhost:3001/api-docs` to explore the API documentation.

#### 3. Start the web application

In a new terminal:

```bash
# From repository root
cd apps/web

# Copy environment file if you haven't already
cp .env.local.example .env.local

# Edit .env.local to configure API connection (defaults should work)
# NEXT_PUBLIC_API_URL=http://localhost:3001
# NEXT_PUBLIC_USE_MOCKS=false

# Start the web app
pnpm dev
```

The web app will be available at `http://localhost:3000`.

Visit `http://localhost:3000/demo` to see the price comparison demo with real API data!

#### 4. Enable Mock Mode (Optional)

If you want to run the frontend without the API:

```bash
# In apps/web/.env.local
NEXT_PUBLIC_USE_MOCKS=true
```

This will use mock data instead of calling the real API. Useful for:
- Frontend development without backend
- Demos without database setup
- Testing UI changes quickly

### Run all apps in development mode (parallel)

```bash
pnpm dev
```

This runs all apps simultaneously using Turbo's parallel execution.

### Run individual apps

**API Server:**
```bash
pnpm dev:api
# Or from services/api directory
cd services/api && pnpm dev
```
The API will be available at `http://localhost:3001`

**Worker:**
```bash
pnpm dev:worker
# Or from services/worker directory
cd services/worker && pnpm dev
```

**Web App:**
```bash
pnpm dev:web
# Or from apps/web directory
cd apps/web && pnpm dev
```
The web app will be available at `http://localhost:3000`

**Mobile App (Expo):**
```bash
pnpm dev:mobile
# Or from apps/mobile directory
cd apps/mobile && pnpm dev
```

### Running Mobile on iOS Simulator

**Option 1: Using Expo Go**
```bash
cd apps/mobile
pnpm dev
# Press 'i' to open iOS simulator with Expo Go
```

**Option 2: Native iOS Build**
```bash
cd apps/mobile
pnpm ios
```

This will build the native iOS app and launch it in the simulator. The first build will take several minutes as it installs CocoaPods dependencies.

**Option 3: Open in Xcode**
```bash
cd apps/mobile
pnpm ios
# After the first build, you can open the project in Xcode:
open ios/mobile.xcworkspace
```

### Running Mobile on Android

```bash
cd apps/mobile
pnpm android
```

## IntelliJ IDEA Setup

### Recommended Plugins

Install these plugins from **Settings > Plugins**:

1. **TypeScript** (usually included)
2. **JavaScript and TypeScript** (usually included)
3. **Prettier** - For code formatting
4. **ESLint** - For linting
5. **.env files support** - For environment variable files
6. **Tailwind CSS** - For Tailwind autocomplete (web app)

### Enable Prettier

1. Go to **Settings > Languages & Frameworks > JavaScript > Prettier**
2. Set Prettier package: `<project-root>/node_modules/prettier`
3. Check "On save" and "On code reformat"
4. Set "Run for files": `{**/*,*}.{js,ts,jsx,tsx,json,css,md}`

### Enable ESLint

1. Go to **Settings > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint**
2. Select "Automatic ESLint configuration"
3. Check "Run eslint --fix on save"

### TypeScript Configuration

1. Go to **Settings > Languages & Frameworks > TypeScript**
2. Set TypeScript version to project version
3. Enable "TypeScript Language Service"

### Run Configurations

Create run configurations for quick access to common commands:

#### API Dev Server
- **Name:** API Dev
- **Type:** npm
- **Package.json:** `<project-root>/services/api/package.json`
- **Command:** run
- **Scripts:** dev

#### Web Dev Server
- **Name:** Web Dev
- **Type:** npm
- **Package.json:** `<project-root>/apps/web/package.json`
- **Command:** run
- **Scripts:** dev

#### Mobile (Expo)
- **Name:** Mobile Dev
- **Type:** npm
- **Package.json:** `<project-root>/apps/mobile/package.json`
- **Command:** run
- **Scripts:** dev

#### Worker Dev
- **Name:** Worker Dev
- **Type:** npm
- **Package.json:** `<project-root>/services/worker/package.json`
- **Command:** run
- **Scripts:** dev

#### All Apps (Turbo)
- **Name:** Dev - All Apps
- **Type:** npm
- **Package.json:** `<project-root>/package.json`
- **Command:** run
- **Scripts:** dev

### IntelliJ Terminal Setup

Configure your terminal to use the correct Node version:

1. Go to **Settings > Tools > Terminal**
2. Set shell path to your default shell (bash/zsh)
3. Add to "Shell integration":
   ```bash
   source ~/.nvm/nvm.sh
   ```

## Xcode Setup (macOS only)

### First Time Setup

1. After running `pnpm ios` in the mobile directory, the Xcode workspace will be created
2. Open the workspace (not the .xcodeproj):
   ```bash
   cd apps/mobile
   open ios/mobile.xcworkspace
   ```

### Running from Xcode

1. Select a simulator from the device dropdown (e.g., iPhone 15)
2. Click the Run button (▶️) or press Cmd+R
3. The app will build and launch in the simulator

### Debugging in Xcode

- Set breakpoints in Swift/Objective-C code
- View logs in the Console (Cmd+Shift+Y)
- Use the LLDB debugger for native code

### Switching between Expo CLI and Xcode

You can use both:
- **Expo CLI** (`pnpm dev`) for JavaScript hot reloading
- **Xcode** for native debugging and building

When making native changes (like adding native modules), rebuild in Xcode or run `pnpm ios`.

## Database Setup

### PostgreSQL Setup

1. Create the database:
   ```bash
   createdb subsidize
   ```

2. Set the `DATABASE_URL` in your `.env` files:
   ```
   DATABASE_URL=postgresql://localhost/subsidize
   ```

3. (Optional) Run migrations when implemented:
   ```bash
   cd services/api
   pnpm migrate
   ```

### Redis Setup

Redis should be running on default port 6379. Verify:

```bash
redis-cli ping
# Should return: PONG
```

Set the `REDIS_URL` in your `.env` files:
```
REDIS_URL=redis://localhost:6379
```

## Troubleshooting

### Port already in use

If you get port conflicts:

```bash
# Find process on port (e.g., 3001)
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### pnpm install fails

Try cleaning and reinstalling:

```bash
# Remove all node_modules
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Remove pnpm lock
rm pnpm-lock.yaml

# Reinstall
pnpm install
```

### Expo/React Native issues

```bash
# Clear Expo cache
cd apps/mobile
pnpm start --clear

# Reset Metro bundler
rm -rf node_modules/.cache
```

### iOS build fails

```bash
# Reinstall pods
cd apps/mobile/ios
pod deintegrate
pod install

# Clean Xcode build
cd ..
xcodebuild clean -workspace ios/mobile.xcworkspace -scheme mobile
```

### TypeScript errors in IDE

```bash
# Restart TypeScript server in IntelliJ
# Or rebuild shared packages
pnpm --filter @subsidize/shared build
pnpm --filter @subsidize/ui build
```

## Development Workflow

1. **Start the API and Worker:**
   ```bash
   pnpm dev:api
   pnpm dev:worker
   ```

2. **Start your frontend (web or mobile):**
   ```bash
   # For web development
   pnpm dev:web

   # For mobile development
   pnpm dev:mobile
   ```

3. **Make changes** in your editor (IntelliJ IDEA recommended)

4. **Hot reload** will automatically refresh your apps

5. **Run type checking and linting:**
   ```bash
   pnpm type-check
   pnpm lint
   ```

6. **Build for production:**
   ```bash
   pnpm build
   ```

## Additional Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [pnpm Documentation](https://pnpm.io/)
- [React Native Documentation](https://reactnative.dev/)

## Getting Help

If you encounter issues not covered in this guide:

1. Check the project README.md
2. Review error logs carefully
3. Check package-specific documentation
4. Ask the team for help

---

**Happy coding! 🚀**
