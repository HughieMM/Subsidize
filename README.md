# Subsidize

**Bermuda Grocery Price Comparison + Delivery Platform**

Subsidize helps Bermuda residents save money by comparing grocery prices across local stores and facilitating online ordering and delivery.

## Overview

Subsidize is a full-stack application built with modern web and mobile technologies, designed to scrape, aggregate, and present grocery prices from various Bermuda stores, allowing consumers to find the best deals and order groceries for delivery.

## Architecture

This project is a **Turborepo monorepo** containing:

### Applications

- **`apps/mobile`** - React Native mobile app built with Expo
  - iOS and Android support
  - Product browsing and price comparison
  - Order management
  - User profiles and delivery addresses

- **`apps/web`** - Next.js web application
  - Server-side rendered web interface
  - Same features as mobile app
  - Optimized for desktop browsing

### Services

- **`services/api`** - Express REST API
  - Product and price data management
  - Store information
  - User management
  - Order processing

- **`services/worker`** - Background job processor
  - Price scraping from store websites
  - Data aggregation and updates
  - Scheduled tasks using BullMQ

### Packages

- **`packages/shared`** - Shared TypeScript types and utilities
  - Zod schemas for validation
  - Common utility functions
  - Type definitions used across all apps

- **`packages/ui`** - Shared React Native UI components
  - Reusable components for mobile and web
  - Consistent design system

- **`packages/config`** - Shared configuration
  - TypeScript configurations
  - ESLint configurations
  - Prettier settings

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Native** - Mobile framework
- **Expo** - Mobile development platform
- **Next.js 14** - Web framework with App Router
- **TailwindCSS** - Utility-first CSS (web)
- **React Query** - Data fetching and caching

### Backend
- **Node.js** - Runtime
- **Express** - API framework
- **TypeScript** - Type safety
- **Zod** - Schema validation
- **PostgreSQL** - Primary database
- **Redis** - Caching and job queue
- **BullMQ** - Background job processing

### Development Tools
- **Turborepo** - Monorepo build system
- **pnpm** - Fast, disk-space efficient package manager
- **TypeScript** - Static typing
- **ESLint** - Code linting
- **Prettier** - Code formatting

### Mobile Development
- **Expo Router** - File-based routing for React Native
- **Expo CLI** - Development and build tools
- **Xcode** - iOS builds (macOS)
- **Android Studio** - Android builds

## Quick Start

### Prerequisites

- **Node.js 18+** (via nvm recommended)
- **pnpm 8+**
- **PostgreSQL 15+** or Docker
- **Redis 7+** or Docker
- **Xcode** (macOS, for iOS development)
- **Watchman** (macOS, for React Native)

### Automated Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd Subsidize

# Run health check to verify prerequisites
make health-check

# Automated first-time setup (installs deps, creates .env files, builds packages)
make setup

# Start PostgreSQL + Redis with Docker (if not installed locally)
make docker-up

# Setup database (run migrations + seed data)
make db-setup

# Start development
make dev
```

Visit:
- **Web App**: http://localhost:3000
- **API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api-docs

### Manual Setup

```bash
# Clone the repository
git clone <repository-url>
cd Subsidize

# Install dependencies
pnpm install

# Build shared packages
pnpm --filter @subsidize/shared build
pnpm --filter @subsidize/ui build

# Set up environment variables
cp services/api/.env.example services/api/.env
cp services/worker/.env.example services/worker/.env
cp apps/web/.env.local.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env

# Edit .env files with your configuration

# Setup database
cd services/api
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed
cd ../..
```

### Development

```bash
# Using Make (recommended)
make dev              # Run all apps in parallel
make dev-web          # Web app only
make dev-api          # API server only
make dev-worker       # Worker only
make dev-mobile       # Mobile app (Expo)
make dev-ios          # iOS Simulator
make dev-android      # Android Emulator

# Or using pnpm directly
pnpm dev              # Run all apps in parallel
pnpm dev:api          # API server (http://localhost:4000)
pnpm dev:web          # Web app (http://localhost:3000)
pnpm dev:mobile       # Mobile app (Expo)
pnpm dev:worker       # Background worker
pnpm dev:ios          # iOS Simulator
pnpm dev:android      # Android Emulator
```

### Database Management

```bash
make db-studio        # Open Prisma Studio (GUI)
make db-migrate       # Run migrations
make db-reset         # Reset database (WARNING: deletes all data)
```

### Docker Commands

```bash
make docker-up        # Start PostgreSQL + Redis containers
make docker-down      # Stop containers
```

### Code Quality

```bash
make format           # Format code with Prettier
make lint             # Run ESLint
make type-check       # Run TypeScript checks
make test             # Run tests
```

### Building

```bash
# Build all apps
make build
# or
pnpm build

# Build specific apps
pnpm build:api
pnpm build:web
pnpm build:mobile
```

## Project Structure

```
Subsidize/
├── apps/
│   ├── mobile/              # Expo React Native app
│   └── web/                 # Next.js web app
├── services/
│   ├── api/                 # Express REST API
│   └── worker/              # Background job processor
├── packages/
│   ├── config/              # Shared configs (TS, ESLint)
│   ├── shared/              # Shared types and utilities
│   └── ui/                  # Shared UI components
├── scripts/
│   ├── setup.sh             # Automated first-time setup
│   └── health-check.sh      # Prerequisites verification
├── .github/
│   └── workflows/           # GitHub Actions CI/CD
├── .gitignore
├── DATA_SOURCES_AND_COMPLIANCE.md  # Compliance documentation
├── DEVELOPER_SETUP.md       # Developer setup guide
├── docker-compose.yml       # Docker services (PostgreSQL, Redis)
├── Makefile                 # Convenient development commands
├── package.json             # Root package configuration
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── turbo.json               # Turborepo configuration
```

## Environment Variables

Each app requires specific environment variables. See the `.env.example` files in each directory:

- `services/api/.env.example` - API server configuration
- `services/worker/.env.example` - Worker configuration
- `apps/web/.env.example` - Web app configuration
- `apps/mobile/.env.example` - Mobile app configuration

**Important:** Never commit `.env` files containing secrets to version control.

## Available Scripts

### Using Make (Recommended)

The project includes a **Makefile** for convenient development:

```bash
make help             # Show all available commands
make install          # Install dependencies
make setup            # First-time setup
make health-check     # Verify prerequisites

make dev              # Run full stack
make dev-web          # Web app only
make dev-api          # API server only
make dev-worker       # Worker only
make dev-mobile       # Mobile (Expo)
make dev-ios          # iOS Simulator
make dev-android      # Android Emulator

make db-setup         # Setup database
make db-migrate       # Run migrations
make db-studio        # Open Prisma Studio
make db-reset         # Reset database

make docker-up        # Start Docker containers
make docker-down      # Stop Docker containers

make format           # Format code
make lint             # Run linter
make type-check       # Type check
make test             # Run tests
make build            # Build all apps
make clean            # Clean artifacts
```

### Using pnpm Directly

From the root directory:

```bash
pnpm dev              # Run all apps in development mode
pnpm dev:web          # Web app
pnpm dev:api          # API server
pnpm dev:worker       # Worker service
pnpm dev:mobile       # Mobile (Expo)
pnpm dev:ios          # iOS Simulator
pnpm dev:android      # Android Emulator

pnpm build            # Build all apps
pnpm lint             # Lint all apps
pnpm type-check       # Type check all apps
pnpm test             # Run all tests
pnpm format           # Format code with Prettier
pnpm clean            # Clean build artifacts
```

### Helper Scripts

```bash
./scripts/setup.sh        # Automated first-time setup
./scripts/health-check.sh # Verify prerequisites
```

## CI/CD

This project uses **GitHub Actions** for continuous integration. On every pull request, the following checks run automatically:

1. **Install** - Install dependencies with pnpm
2. **Lint** - ESLint checks across all packages
3. **Type Check** - TypeScript compilation checks
4. **Test** - Run all unit and integration tests
5. **Build** - Build all apps and packages

The CI workflow is defined in `.github/workflows/ci.yml`.

## IDE Setup

This project is optimized for **IntelliJ IDEA** and **Xcode**.

### IntelliJ IDEA

Recommended for web, API, and worker development. See [DEVELOPER_SETUP.md](./DEVELOPER_SETUP.md) for:
- Recommended plugins
- Run configurations
- Code formatting setup
- TypeScript configuration

### Xcode

Required for iOS development. See [DEVELOPER_SETUP.md](./DEVELOPER_SETUP.md) for:
- iOS build setup
- Running on simulator
- Native debugging

## Features

### Current (v1.0)
- Product catalog browsing
- Price comparison across stores
- Store directory
- User profiles
- Delivery address management
- Order tracking
- Background price scraping

### Planned
- Real-time price alerts
- Shopping lists
- Price history charts
- Barcode scanning
- Store inventory tracking
- Push notifications
- Payment processing
- Driver app for deliveries

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `pnpm type-check` and `pnpm lint`
4. Commit with clear messages
5. Push and create a pull request

### Commit Guidelines

- Use clear, descriptive commit messages
- Group related changes together
- Reference issue numbers when applicable
- Keep commits atomic and focused

## Documentation

- **[DEVELOPER_SETUP.md](./DEVELOPER_SETUP.md)** - Complete development environment setup
- **[.github/INTELLIJ_RUN_CONFIGS.md](./.github/INTELLIJ_RUN_CONFIGS.md)** - IntelliJ run configuration guide

## Database Schema

The application uses PostgreSQL with the following main tables:

- `products` - Product information
- `prices` - Product prices at stores (with history)
- `stores` - Store information
- `store_locations` - Physical store locations
- `users` - User accounts
- `addresses` - User delivery addresses
- `orders` - Customer orders
- `order_items` - Items in orders

Schema migrations are managed in `apps/api/src/migrations/` (when implemented).

## API Documentation

REST API endpoints:

- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `GET /api/stores` - List stores
- `GET /api/stores/:id` - Get store details
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details

Full API documentation available at `/api/docs` when running the API server (when implemented).

## License

[To be determined]

## Contact

For questions or support, please contact [team contact information].

---

**Made with ❤️ for Bermuda**
