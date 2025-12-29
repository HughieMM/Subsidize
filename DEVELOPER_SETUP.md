# Developer Setup Guide

Complete setup guide for developing Subsidize - Bermuda's grocery price comparison and delivery platform.

## Prerequisites

### 1. Install Node.js via nvm

**macOS/Linux:**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Restart your terminal or run:
source ~/.bashrc  # or ~/.zshrc for zsh

# Install Node.js 20 (LTS)
nvm install 20
nvm use 20
nvm alias default 20

# Verify installation
node --version  # Should show v20.x.x
```

### 2. Install pnpm

```bash
# Install pnpm globally
npm install -g pnpm@8.15.0

# Verify installation
pnpm --version  # Should show 8.15.0
```

### 3. Install Turbo

```bash
# Install Turbo globally
pnpm install -g turbo

# Verify installation
turbo --version
```

### 4. macOS-Specific Requirements (for mobile development)

#### Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Install Watchman
```bash
brew install watchman
```

#### Install Xcode

1. Download Xcode from the Mac App Store (latest version)
2. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```
3. Accept Xcode license:
   ```bash
   sudo xcodebuild -license accept
   ```

#### Install CocoaPods
```bash
sudo gem install cocoapods

# Verify installation
pod --version
```

## Project Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd Subsidize

# Install all dependencies
pnpm install
```

### 2. Environment Configuration

Copy the example environment files and configure them:

```bash
# API service
cp apps/api/.env.example apps/api/.env

# Worker service
cp apps/worker/.env.example apps/worker/.env

# Web app
cp apps/web/.env.example apps/web/.env

# Mobile app
cp apps/mobile/.env.example apps/mobile/.env
```

**Important:** Edit each `.env` file with your local configuration.

## Running the Applications

### Running All Services (Development)

```bash
# Run all services in development mode
pnpm dev
```

### Running Individual Services

#### Mobile App (Expo)

**Option 1: Expo Go (Recommended for quick testing)**
```bash
# Start Expo dev server
pnpm mobile

# Or from the mobile directory
cd apps/mobile
pnpm dev
```

Then:
- Scan QR code with Expo Go app on your phone (iOS/Android)
- Press `i` for iOS simulator (macOS only)
- Press `a` for Android emulator

**Option 2: Native iOS Build (macOS only)**
```bash
# First time only: Install iOS dependencies
cd apps/mobile/ios
pod install
cd ../../..

# Run on iOS simulator
cd apps/mobile
pnpm run:ios

# Or specify a device
pnpm run:ios -- --device "iPhone 15 Pro"
```

**Option 3: Native Android Build**
```bash
cd apps/mobile
pnpm run:android
```

#### API Service

```bash
# Run API server (port 3001)
pnpm api

# Or from the api directory
cd apps/api
pnpm dev
```

API will be available at: `http://localhost:3001`

#### Worker Service

```bash
# Run background worker
pnpm worker

# Or from the worker directory
cd apps/worker
pnpm dev
```

#### Web App

```bash
# Run Next.js web app (port 3000)
pnpm web

# Or from the web directory
cd apps/web
pnpm dev
```

Web app will be available at: `http://localhost:3000`

## IntelliJ IDEA Setup

### Recommended Plugins

Install these plugins via `Settings → Plugins`:

1. **JavaScript and TypeScript** (built-in, ensure enabled)
2. **Node.js** (built-in, ensure enabled)
3. **ESLint** - For code linting
4. **Prettier** - For code formatting
5. **ENV File Support** - For .env file syntax highlighting
6. **Markdown** - For documentation editing

### IntelliJ Run Configurations

Create run configurations for each service:

#### 1. API Server Configuration

1. Go to `Run → Edit Configurations`
2. Click `+` → `npm`
3. Configure:
   - **Name:** `API Server`
   - **package.json:** `apps/api/package.json`
   - **Command:** `run`
   - **Scripts:** `dev`
   - **Environment:** Add env vars from `apps/api/.env`

#### 2. Worker Configuration

1. Go to `Run → Edit Configurations`
2. Click `+` → `npm`
3. Configure:
   - **Name:** `Worker`
   - **package.json:** `apps/worker/package.json`
   - **Command:** `run`
   - **Scripts:** `dev`
   - **Environment:** Add env vars from `apps/worker/.env`

#### 3. Web App Configuration

1. Go to `Run → Edit Configurations`
2. Click `+` → `npm`
3. Configure:
   - **Name:** `Web App`
   - **package.json:** `apps/web/package.json`
   - **Command:** `run`
   - **Scripts:** `dev`
   - **Environment:** Add env vars from `apps/web/.env`

#### 4. Mobile App Configuration

1. Go to `Run → Edit Configurations`
2. Click `+` → `npm`
3. Configure:
   - **Name:** `Mobile (Expo)`
   - **package.json:** `apps/mobile/package.json`
   - **Command:** `run`
   - **Scripts:** `dev`

#### 5. Compound Configuration (Run All)

1. Go to `Run → Edit Configurations`
2. Click `+` → `Compound`
3. Configure:
   - **Name:** `All Services`
   - Add all the above configurations
   - Check "Run in parallel"

### IntelliJ Settings Recommendations

#### TypeScript Configuration
1. Go to `Settings → Languages & Frameworks → TypeScript`
2. Enable TypeScript Language Service
3. Set Node interpreter to your nvm Node.js 20 installation

#### Code Style
1. Go to `Settings → Editor → Code Style → TypeScript`
2. Import code style from `.editorconfig` if present
3. Or configure:
   - Indent: 2 spaces
   - Continuation indent: 2 spaces

#### ESLint
1. Go to `Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint`
2. Select "Automatic ESLint configuration"
3. Check "Run eslint --fix on save"

#### Prettier
1. Go to `Settings → Languages & Frameworks → JavaScript → Prettier`
2. Set Prettier package path
3. Check "On save" and "On code reformat"

## Opening iOS Project in Xcode

When you need to work with native iOS code:

```bash
cd apps/mobile/ios
open Subsidize.xcworkspace
```

**Note:** Always open the `.xcworkspace` file, not the `.xcodeproj` file, when using CocoaPods.

## Common Development Commands

```bash
# Install dependencies
pnpm install

# Run all services in dev mode
pnpm dev

# Build all apps
pnpm build

# Run linters
pnpm lint

# Format code
pnpm format

# Type check all TypeScript
turbo run type-check

# Clean all build artifacts and node_modules
pnpm clean

# Run specific app
pnpm --filter @subsidize/api dev
pnpm --filter @subsidize/web dev
pnpm --filter @subsidize/mobile dev
pnpm --filter @subsidize/worker dev
```

## Monorepo Structure

```
Subsidize/
├── apps/
│   ├── mobile/          # Expo React Native app
│   ├── web/             # Next.js web app
│   ├── api/             # Express API server
│   └── worker/          # Background job worker
├── packages/
│   └── typescript-config/  # Shared TypeScript configs
├── turbo.json           # Turborepo configuration
├── pnpm-workspace.yaml  # pnpm workspace config
└── package.json         # Root package.json
```

## Troubleshooting

### pnpm install fails
- Ensure you're using pnpm 8.15.0 or higher
- Delete `node_modules` and `pnpm-lock.yaml`, then retry

### iOS build fails
- Run `cd apps/mobile/ios && pod install`
- Clean build folder in Xcode: `Product → Clean Build Folder`
- Delete `ios/build` and `ios/Pods`, then reinstall pods

### Metro bundler cache issues
```bash
cd apps/mobile
pnpm start -- --clear
```

### Watchman issues (macOS)
```bash
watchman watch-del-all
```

### Port already in use
- API: Change `PORT` in `apps/api/.env`
- Web: Change port in `apps/web/package.json` dev script: `next dev -p 3001`

### TypeScript errors in IntelliJ
- Restart TypeScript service: Right-click on `tsconfig.json` → `TypeScript → Restart TypeScript Service`
- Invalidate caches: `File → Invalidate Caches / Restart`

## Additional Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Documentation](https://pnpm.io/)
- [Expo Documentation](https://docs.expo.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)

## Getting Help

If you encounter issues:

1. Check this documentation
2. Search existing issues in the repository
3. Ask in the team chat
4. Create a new issue with detailed information
