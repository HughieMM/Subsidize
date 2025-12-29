# IntelliJ IDEA Run Configurations for Subsidize

This guide shows you how to set up run configurations in IntelliJ IDEA for quickly starting and managing the Subsidize applications.

## Table of Contents

- [Creating Run Configurations](#creating-run-configurations)
- [Recommended Configurations](#recommended-configurations)
- [Compound Configurations](#compound-configurations)
- [Debugging](#debugging)
- [Tips and Tricks](#tips-and-tricks)

## Creating Run Configurations

### Method 1: Using the UI

1. Go to **Run > Edit Configurations...**
2. Click the **+** button in the top-left
3. Select **npm** from the list
4. Fill in the configuration details
5. Click **OK** to save

### Method 2: Manual .idea/runConfigurations (Advanced)

You can create XML files in `.idea/runConfigurations/` (note: this directory is gitignored).

## Recommended Configurations

### 1. API Development Server

**Configuration Type:** npm

- **Name:** `API Dev`
- **Package.json:** `<project-root>/apps/api/package.json`
- **Command:** `run`
- **Scripts:** `dev`
- **Node interpreter:** Project default
- **Working directory:** `<project-root>/apps/api`

**What it does:** Starts the Express API server on port 3001 with hot reloading via tsx watch.

**Usage:** Click the green play button or press `Ctrl+Shift+F10` (Windows/Linux) or `Cmd+Shift+R` (macOS)

---

### 2. Web Development Server

**Configuration Type:** npm

- **Name:** `Web Dev`
- **Package.json:** `<project-root>/apps/web/package.json`
- **Command:** `run`
- **Scripts:** `dev`
- **Node interpreter:** Project default
- **Working directory:** `<project-root>/apps/web`

**What it does:** Starts the Next.js development server on port 3000 with hot reloading.

**Usage:** Run to open http://localhost:3000 in your browser

---

### 3. Mobile Development (Expo)

**Configuration Type:** npm

- **Name:** `Mobile Dev (Expo)`
- **Package.json:** `<project-root>/apps/mobile/package.json`
- **Command:** `run`
- **Scripts:** `dev`
- **Node interpreter:** Project default
- **Working directory:** `<project-root>/apps/mobile`

**What it does:** Starts the Expo development server. Opens a QR code that you can scan with Expo Go app, or press 'i' for iOS simulator, 'a' for Android emulator.

**Usage:** After starting, press:
- `i` - Open iOS simulator
- `a` - Open Android emulator
- `w` - Open web browser
- `r` - Reload app
- `m` - Toggle menu

---

### 4. Mobile iOS Build

**Configuration Type:** npm

- **Name:** `Mobile iOS`
- **Package.json:** `<project-root>/apps/mobile/package.json`
- **Command:** `run`
- **Scripts:** `ios`
- **Node interpreter:** Project default
- **Working directory:** `<project-root>/apps/mobile`

**What it does:** Builds and runs the native iOS app in the iOS Simulator.

**Note:** First build will take several minutes as it installs CocoaPods dependencies.

---

### 5. Worker Development Server

**Configuration Type:** npm

- **Name:** `Worker Dev`
- **Package.json:** `<project-root>/apps/worker/package.json`
- **Command:** `run`
- **Scripts:** `dev`
- **Node interpreter:** Project default
- **Working directory:** `<project-root>/apps/worker`

**What it does:** Starts the background worker that processes jobs like price scraping.

---

### 6. All Apps (Turbo)

**Configuration Type:** npm

- **Name:** `Dev - All Apps`
- **Package.json:** `<project-root>/package.json`
- **Command:** `run`
- **Scripts:** `dev`
- **Node interpreter:** Project default
- **Working directory:** `<project-root>`

**What it does:** Runs all development servers in parallel using Turborepo.

**Note:** This will start:
- API on port 3001
- Web on port 3000
- Mobile Expo server on port 19000
- Worker

**Output:** All apps' logs will be multiplexed in a single terminal. Look for the app name prefix (e.g., `[api]`, `[web]`) in each log line.

---

### 7. Build All

**Configuration Type:** npm

- **Name:** `Build All`
- **Package.json:** `<project-root>/package.json`
- **Command:** `run`
- **Scripts:** `build`
- **Node interpreter:** Project default
- **Working directory:** `<project-root>`

**What it does:** Builds all apps and packages for production.

---

### 8. Type Check All

**Configuration Type:** npm

- **Name:** `Type Check`
- **Package.json:** `<project-root>/package.json`
- **Command:** `run`
- **Scripts:** `type-check`
- **Node interpreter:** Project default
- **Working directory:** `<project-root>`

**What it does:** Runs TypeScript type checking across all packages.

---

### 9. Lint All

**Configuration Type:** npm

- **Name:** `Lint`
- **Package.json:** `<project-root>/package.json`
- **Command:** `run`
- **Scripts:** `lint`
- **Node interpreter:** Project default
- **Working directory:** `<project-root>`

**What it does:** Runs ESLint across all packages.

---

## Compound Configurations

Compound configurations let you run multiple configurations at once.

### Backend Stack (API + Worker)

**Configuration Type:** Compound

- **Name:** `Backend Stack`
- **Configurations to run:**
  - API Dev
  - Worker Dev

**What it does:** Starts both the API and Worker together.

**Usage:** Perfect for backend-only development.

---

### Full Stack (API + Worker + Web)

**Configuration Type:** Compound

- **Name:** `Full Stack`
- **Configurations to run:**
  - API Dev
  - Worker Dev
  - Web Dev

**What it does:** Starts the full stack for web development.

---

## Debugging

### Debugging the API

1. Create a new **Node.js** (not npm) configuration:
   - **Name:** `Debug API`
   - **Node interpreter:** Project default
   - **Working directory:** `<project-root>/apps/api`
   - **JavaScript file:** `node_modules/tsx/dist/cli.mjs`
   - **Application parameters:** `watch src/index.ts`

2. Set breakpoints in your TypeScript code

3. Click the debug button (🐛) or press `Shift+F9`

4. Make a request to the API, and execution will pause at your breakpoints

### Debugging the Web App

Next.js has built-in debugging support:

1. Start the web dev server
2. Open Chrome DevTools
3. Click "Open dedicated DevTools for Node"
4. Set breakpoints in your server-side code

For client-side debugging, use browser DevTools as normal.

## Tips and Tricks

### Environment Variables

To set environment variables for a run configuration:

1. Open the configuration
2. Expand **Environment variables**
3. Add variables or point to an `.env` file

**Example:**
```
NODE_ENV=development;PORT=3001
```

### Before Launch Tasks

You can run tasks before launching a configuration:

1. Open the configuration
2. Click **+** in the **Before launch** section
3. Add tasks like:
   - **Run npm script** - Build shared packages
   - **Run another configuration** - Start dependencies

**Example:** Before running the API, build shared packages:
- Add **Run npm script**
- Choose `@subsidize/shared` package
- Select `build` script

### Keyboard Shortcuts

- **Run current configuration:** `Shift+F10` (Windows/Linux), `Ctrl+R` (macOS)
- **Debug current configuration:** `Shift+F9` (Windows/Linux), `Ctrl+D` (macOS)
- **Stop running process:** `Ctrl+F2` (Windows/Linux), `Cmd+F2` (macOS)
- **Rerun last configuration:** `Ctrl+Shift+F10` (Windows/Linux), `Ctrl+Shift+R` (macOS)

### Quick Run Menu

The dropdown next to the Run button shows your recent configurations. Pin frequently-used ones by clicking the star icon.

### Logs and Output

- **View all running processes:** Click the **Services** tool window
- **Filter output:** Use the filter box in the Run tool window
- **Search logs:** `Ctrl+F` in the Run tool window

### Sharing Configurations

By default, run configurations are stored in `.idea/workspace.xml` (gitignored).

To share configurations with your team:

1. Open **Run > Edit Configurations...**
2. Check **Store as project file** for the configuration
3. This creates a file in `.idea/runConfigurations/` that can be committed

**Note:** Our `.gitignore` excludes `.idea/`, so you'd need to modify it to commit these.

### Recommended Workflow

**For Full-Stack Development:**
1. Start "Backend Stack" (API + Worker)
2. Start "Web Dev" or "Mobile Dev (Expo)"

**For API-Only Development:**
1. Start "API Dev"
2. Use a REST client (Postman, Insomnia, or IntelliJ HTTP Client)

**For Frontend-Only Development:**
1. Ensure API is running (or use a staging API)
2. Start "Web Dev" or "Mobile Dev (Expo)"

### Monitoring Multiple Services

When running the compound "Dev - All Apps" configuration:

- Use the **Services** tool window to see all running processes
- Each service has its own console tab
- Stop individual services or all at once
- Restart individual services without affecting others

### IntelliJ HTTP Client (API Testing)

Instead of Postman, use IntelliJ's built-in HTTP Client:

1. Create a file: `api-tests.http`
2. Write requests:
   ```http
   ### Get all products
   GET http://localhost:3001/api/products

   ### Get product by ID
   GET http://localhost:3001/api/products/123

   ### Create order
   POST http://localhost:3001/api/orders
   Content-Type: application/json

   {
     "userId": "user123",
     "items": []
   }
   ```
3. Click the green ▶️ arrow next to each request to run it

### Performance Profiling

To profile Node.js apps:

1. Start the app with debugging
2. Go to **Run > Attach to Node.js/Chrome**
3. Use the profiler in the Debug tool window

## Advanced: Custom npm Scripts in Run Configs

You can create custom combinations:

**Example: Build and Start API**
- Create an npm configuration
- Package.json: `<project-root>/apps/api/package.json`
- Scripts: `build && start`

**Example: Clean and Rebuild**
- Create an npm configuration
- Package.json: `<project-root>/package.json`
- Scripts: `clean && build`

---

## Summary

The most commonly used configurations:

1. **Dev - All Apps** - Start everything at once
2. **API Dev** - Backend development
3. **Web Dev** - Web frontend development
4. **Mobile Dev (Expo)** - Mobile development
5. **Debug API** - Backend debugging

Set up these configurations first, and add others as needed for your workflow!

---

**Happy developing! 🚀**
