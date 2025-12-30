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

Create run configurations for quick access to common commands. These are optimized for IntelliJ IDEA's built-in npm runner.

#### 1. Full Stack Development (Web + API + Worker)
- **Name:** Dev - Full Stack
- **Type:** npm
- **Package.json:** `<project-root>/package.json`
- **Command:** run
- **Scripts:** dev
- **Description:** Runs web app, API server, and worker in parallel using Turbo

#### 2. Web App Only
- **Name:** Dev - Web
- **Type:** npm
- **Package.json:** `<project-root>/package.json`
- **Command:** run
- **Scripts:** dev:web
- **Description:** Runs Next.js web app on http://localhost:3000

#### 3. API Server Only
- **Name:** Dev - API
- **Type:** npm
- **Package.json:** `<project-root>/package.json`
- **Command:** run
- **Scripts:** dev:api
- **Description:** Runs Express API server on http://localhost:4000

#### 4. Worker Service Only
- **Name:** Dev - Worker
- **Type:** npm
- **Package.json:** `<project-root>/package.json`
- **Command:** run
- **Scripts:** dev:worker
- **Description:** Runs BullMQ worker for background jobs

#### 5. Mobile App (Expo Dev Server)
- **Name:** Dev - Mobile (Expo)
- **Type:** npm
- **Package.json:** `<project-root>/package.json`
- **Command:** run
- **Scripts:** dev:mobile
- **Description:** Starts Expo dev server with QR code for Expo Go app

#### 6. iOS Simulator (Native)
- **Name:** Dev - iOS
- **Type:** npm
- **Package.json:** `<project-root>/package.json`
- **Command:** run
- **Scripts:** dev:ios
- **Description:** Opens iOS Simulator and runs app natively
- **Prerequisites:** Xcode, CocoaPods, iOS Simulator

#### 7. Android Emulator (Native)
- **Name:** Dev - Android
- **Type:** npm
- **Package.json:** `<project-root>/package.json`
- **Command:** run
- **Scripts:** dev:android
- **Description:** Opens Android emulator and runs app natively
- **Prerequisites:** Android Studio, Android SDK, Emulator created

#### 8. Prisma Studio (Database GUI)
- **Name:** Prisma Studio
- **Type:** Shell Script
- **Execute:** `cd services/api && pnpm prisma studio`
- **Description:** Opens Prisma Studio GUI at http://localhost:5555 for database management

### Creating Run Configurations in IntelliJ

1. Click **Run → Edit Configurations**
2. Click **+** (Add New Configuration)
3. Select **npm** or **Shell Script**
4. Fill in the details from above
5. Click **OK**

You can now run these configurations from the top-right dropdown or assign keyboard shortcuts in **Settings → Keymap**.

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

### iOS Issues

#### 1. "Command PhaseScriptExecution failed with a nonzero exit code"

**Cause:** CocoaPods not installed or outdated

**Fix:**
```bash
# Install CocoaPods
sudo gem install cocoapods

# Navigate to iOS directory
cd apps/mobile/ios

# Remove existing Pods
rm -rf Pods Podfile.lock

# Reinstall
pod install

# Clean build folder in Xcode
# Product → Clean Build Folder (Cmd+Shift+K)
```

---

#### 2. "No signing certificate found"

**Cause:** Missing Apple Developer account or signing configuration

**Fix:**
1. Open Xcode
2. Go to **Xcode → Preferences → Accounts**
3. Add your Apple ID
4. In project settings: **Signing & Capabilities**
5. Select your **Team**
6. Enable **Automatically manage signing**

---

#### 3. "Metro bundler not starting" or "Cannot connect to Metro"

**Cause:** Port conflict or stale Metro process

**Fix:**
```bash
# Kill existing Metro processes
lsof -ti:8081 | xargs kill -9

# Clear Metro cache
cd apps/mobile
rm -rf .expo node_modules/.cache

# Restart
pnpm dev:ios
```

---

#### 4. "Could not find iPhone Simulator"

**Cause:** Xcode Command Line Tools not set

**Fix:**
```bash
# Set Command Line Tools
sudo xcode-select --switch /Applications/Xcode.app

# Verify
xcode-select -p
# Should output: /Applications/Xcode.app/Contents/Developer

# List available simulators
xcrun simctl list devices
```

---

#### 5. "Expo app not opening in Simulator"

**Cause:** Expo Go app not installed in simulator

**Fix:**
```bash
# Start simulator first
open -a Simulator

# Install Expo Go in simulator
# Let Expo CLI install it automatically when you run:
pnpm dev:ios
```

---

#### 6. "Pod install fails"

**Cause:** Ruby version incompatibility or gem issues

**Fix:**
```bash
# Update RubyGems
sudo gem update --system

# Update CocoaPods
sudo gem install cocoapods

# Clear CocoaPods cache
pod cache clean --all

# Reinstall
cd apps/mobile/ios
rm -rf Pods Podfile.lock ~/Library/Caches/CocoaPods
pod install
```

---

### Android Issues

#### 1. "SDK location not found"

**Cause:** Android SDK path not configured

**Fix:**

Create `apps/mobile/android/local.properties`:
```properties
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
```

Or set environment variable:
```bash
export ANDROID_HOME=/Users/YOUR_USERNAME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Add to `~/.zshrc` or `~/.bashrc` to persist.

---

#### 2. "No emulator found" or "Emulator offline"

**Cause:** No Android emulator created or emulator not running

**Fix:**
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_5_API_33

# Or create new emulator via Android Studio:
# Tools → Device Manager → Create Device
```

---

#### 3. "Gradle build failed"

**Cause:** Gradle cache corruption or version mismatch

**Fix:**
```bash
cd apps/mobile/android

# Clean Gradle cache
./gradlew clean

# Clear build folders
rm -rf build app/build

# Invalidate caches
rm -rf ~/.gradle/caches

# Rebuild
./gradlew assembleDebug

# Or from root:
pnpm dev:android
```

---

#### 4. "INSTALL_FAILED_INSUFFICIENT_STORAGE"

**Cause:** Emulator disk full

**Fix:**
1. Open **Android Studio**
2. Go to **Tools → Device Manager**
3. Click **⋮** on emulator → **Wipe Data**
4. Or increase emulator storage:
   - Edit emulator → **Show Advanced Settings**
   - Increase **Internal Storage** (e.g., 4GB → 8GB)

---

#### 5. "Metro bundler port 8081 already in use"

**Cause:** Another process using port 8081

**Fix:**
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Or use different port
cd apps/mobile
EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0:8082 pnpm dev
```

---

### Prisma Issues

#### 1. "Environment variable not found: DATABASE_URL"

**Cause:** Missing `.env` file in API service

**Fix:**
```bash
cd services/api

# Copy example env
cp .env.example .env

# Edit .env and set DATABASE_URL:
# DATABASE_URL="postgresql://user:password@localhost:5432/subsidize_dev"
```

---

#### 2. "Can't reach database server"

**Cause:** PostgreSQL not running or wrong credentials

**Fix:**
```bash
# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql@14

# Check if running
psql -h localhost -U postgres -c "SELECT version();"

# Create database
psql -h localhost -U postgres -c "CREATE DATABASE subsidize_dev;"

# Update DATABASE_URL in services/api/.env
```

---

#### 3. "Prisma schema outdated" or "Type errors after schema change"

**Cause:** Prisma Client not regenerated after schema change

**Fix:**
```bash
cd services/api

# Regenerate Prisma Client
pnpm prisma generate

# If schema changed, run migration
pnpm prisma migrate dev --name your_migration_name

# Restart API server
pnpm dev
```

---

#### 4. "Migration failed: relation already exists"

**Cause:** Database out of sync with migrations

**Fix:**

**Option 1:** Reset database (DEVELOPMENT ONLY - deletes all data):
```bash
cd services/api
pnpm prisma migrate reset
```

**Option 2:** Mark migration as applied:
```bash
cd services/api
pnpm prisma migrate resolve --applied MIGRATION_NAME
```

**Option 3:** Push schema without migration (quick dev fix):
```bash
cd services/api
pnpm prisma db push
```

---

#### 5. "Prisma Studio won't open"

**Cause:** Port 5555 already in use

**Fix:**
```bash
# Kill process on port 5555
lsof -ti:5555 | xargs kill -9

# Restart Prisma Studio
cd services/api
pnpm prisma studio
```

---

### General Issues

#### 1. "pnpm command not found"

**Fix:**
```bash
npm install -g pnpm@8
```

---

#### 2. "Turbo not found"

**Fix:**
```bash
# Reinstall dependencies from root
pnpm install
```

---

#### 3. "Port already in use"

**Fix:**
```bash
# Find process using port (e.g., 3000)
lsof -ti:3000

# Kill process
lsof -ti:3000 | xargs kill -9
```

---

#### 4. "TypeScript errors after pull"

**Fix:**
```bash
# Reinstall dependencies
pnpm install

# Regenerate Prisma Client
cd services/api && pnpm prisma generate

# Clear build caches
pnpm clean
pnpm install

# Rebuild
pnpm build
```

---

#### 5. "Out of memory" or "JavaScript heap out of memory"

**Fix:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Add to ~/.zshrc or ~/.bashrc to persist

# Or run specific command with more memory
NODE_OPTIONS="--max-old-space-size=4096" pnpm dev
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
