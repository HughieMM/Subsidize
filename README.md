# Subsidize

Bermuda's premier grocery price comparison and delivery platform. Compare prices across all major Bermuda grocery stores and get your groceries delivered to your door.

## Features

- **Price Comparison**: Real-time price comparisons across multiple Bermuda grocery stores
- **Smart Search**: Find the best deals on your favorite products
- **Delivery Service**: Order groceries from multiple stores with unified delivery
- **Price Alerts**: Get notified when products go on sale
- **Shopping Lists**: Create and share shopping lists with family
- **Weekly Deals**: Browse current promotions and special offers

## Tech Stack

### Monorepo
- **Package Manager**: pnpm
- **Build System**: Turborepo
- **Language**: TypeScript

### Applications

#### Mobile App (`apps/mobile`)
- **Framework**: Expo (React Native)
- **Router**: Expo Router
- **Platforms**: iOS, Android
- **Development**: Expo Go for quick testing, native builds for production

#### Web App (`apps/web`)
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18
- **Styling**: CSS Modules

#### API Server (`apps/api`)
- **Runtime**: Node.js
- **Framework**: Express
- **Type Safety**: Zod for validation

#### Worker Service (`apps/worker`)
- **Runtime**: Node.js
- **Scheduler**: node-cron
- **Jobs**: Price scraping, notifications, data processing

## Quick Start

### Prerequisites

- Node.js 20+ (via nvm)
- pnpm 8.15.0+
- Turbo
- macOS (for iOS development)
- Xcode (for iOS builds)
- Watchman (for React Native)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Subsidize

# Install dependencies
pnpm install

# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/worker/.env.example apps/worker/.env
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env

# Configure your .env files
```

### Development

```bash
# Run all services
pnpm dev

# Or run individual services
pnpm mobile    # Expo mobile app
pnpm web       # Next.js web app
pnpm api       # Express API server
pnpm worker    # Background worker
```

## Documentation

- [Developer Setup Guide](./DEVELOPER_SETUP.md) - Complete setup instructions
- [API Documentation](./apps/api/README.md) - API endpoints and usage (coming soon)
- [Mobile App Guide](./apps/mobile/README.md) - Mobile development guide (coming soon)

## Project Structure

```
Subsidize/
├── apps/
│   ├── mobile/          # Expo mobile app
│   │   ├── app/         # Expo Router pages
│   │   ├── assets/      # Images, fonts, etc.
│   │   └── package.json
│   ├── web/             # Next.js web app
│   │   ├── src/
│   │   │   └── app/     # App Router pages
│   │   └── package.json
│   ├── api/             # Express API server
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json
│   └── worker/          # Background jobs
│       ├── src/
│       │   └── index.ts
│       └── package.json
├── packages/
│   └── typescript-config/  # Shared TS configs
├── .idea/
│   └── runConfigurations/  # IntelliJ run configs
├── DEVELOPER_SETUP.md      # Setup guide
├── turbo.json              # Turborepo config
├── pnpm-workspace.yaml     # Workspace config
└── package.json            # Root package
```

## Development Workflow

### Using IntelliJ IDEA

The repository includes pre-configured IntelliJ IDEA run configurations:

1. **API Server** - Run the API service
2. **Worker** - Run background jobs
3. **Web App** - Run the Next.js web app
4. **Mobile (Expo)** - Run the Expo dev server
5. **All Services** - Run everything in parallel

Simply open the project in IntelliJ and select a configuration from the run dropdown.

### Using Command Line

```bash
# Development
turbo run dev                # Run all in dev mode
turbo run build              # Build all apps
turbo run lint               # Lint all code
turbo run type-check         # Type check all TypeScript

# Individual apps
pnpm --filter @subsidize/mobile dev
pnpm --filter @subsidize/web dev
pnpm --filter @subsidize/api dev
pnpm --filter @subsidize/worker dev

# Clean
pnpm clean                   # Remove all node_modules and build artifacts
```

## Environment Variables

Each service requires environment variables. Example files are provided:

- `apps/api/.env.example` - API configuration
- `apps/worker/.env.example` - Worker configuration
- `apps/web/.env.example` - Web app configuration
- `apps/mobile/.env.example` - Mobile app configuration

**Important**: Never commit `.env` files to version control.

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure all tests pass and code is linted
4. Create a pull request
5. Wait for review and approval

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all services in development mode |
| `pnpm build` | Build all applications |
| `pnpm lint` | Lint all code |
| `pnpm format` | Format code with Prettier |
| `pnpm clean` | Remove build artifacts and dependencies |
| `pnpm mobile` | Run mobile app |
| `pnpm web` | Run web app |
| `pnpm api` | Run API server |
| `pnpm worker` | Run worker service |

## License

Proprietary - All rights reserved

## Support

For issues and questions, please contact the development team or create an issue in the repository.
