# Subsidize API

REST API for the Subsidize grocery price comparison and delivery platform.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Documentation**: OpenAPI/Swagger

## Getting Started

### Prerequisites

- Node.js 18+ (managed via nvm)
- PostgreSQL 14+
- pnpm 8.15.1+

### Installation

From the repository root:

```bash
pnpm install
```

### Environment Setup

1. Copy the example environment file:

```bash
cp services/api/.env.example services/api/.env
```

2. Update `services/api/.env` with your local database credentials:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/subsidize?schema=public"
```

### Database Setup

1. **Generate Prisma Client**:

```bash
cd services/api
pnpm db:generate
```

2. **Run migrations** (creates database schema):

```bash
pnpm db:migrate
```

3. **Seed the database** with sample data:

```bash
pnpm db:seed
```

This will create:
- 3 Bermuda stores (MarketPlace, Lindo's, Supermart)
- 10 sample products
- Price observations for each product at each store

### Development

Start the development server:

```bash
# From repository root
pnpm dev

# Or specifically for API
cd services/api
pnpm dev
```

The API will be available at:
- **Server**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Docs**: http://localhost:3001/api-docs

### Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build production bundle
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run tests

#### Database Scripts

- `pnpm db:generate` - Generate Prisma Client from schema
- `pnpm db:migrate` - Run database migrations
- `pnpm db:push` - Push schema changes to database (dev only)
- `pnpm db:seed` - Seed database with sample data
- `pnpm db:studio` - Open Prisma Studio (database GUI)

## API Endpoints

### Stores

- `GET /api/stores` - List all stores
- `GET /api/stores/:id` - Get store details
- `GET /api/stores/:id/products` - Get products available at a store

### Products

- `GET /api/products` - List products (paginated)
  - Query params: `page`, `limit`, `brand`
- `GET /api/products/search?q=query` - Search products by name/brand
- `GET /api/products/:id` - Get product with price comparison
- `GET /api/products/:id/prices` - Get price history
  - Query params: `days` (default: 30)

### Baskets

- `POST /api/baskets` - Create a new basket
- `GET /api/baskets/:id` - Get basket with items
- `POST /api/baskets/:id/items` - Add item to basket
- `PATCH /api/baskets/:id/items/:productId` - Update item quantity
- `DELETE /api/baskets/:id/items/:productId` - Remove item from basket
- `GET /api/baskets/:id/compare` - Compare basket prices across stores

### Watchlist

- `POST /api/watchlist` - Add product to watchlist
- `GET /api/watchlist/user/:userId` - Get user's watchlist
- `DELETE /api/watchlist/:id` - Remove from watchlist
- `PATCH /api/watchlist/:id/target-price` - Update price alert threshold

### Orders

- `POST /api/orders` - Create delivery order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/user/:userId` - Get user's orders

## Database Schema

### Core Models

- **Store** - Grocery stores in Bermuda
- **Product** - Canonical product definitions
- **StoreProduct** - Store-specific product listings
- **PriceObservation** - Time-series price data
- **User** - Platform users
- **Basket** - Shopping baskets
- **BasketItem** - Items in baskets
- **Watchlist** - Price watch items
- **DeliveryOrder** - Delivery orders

See `prisma/schema.prisma` for full schema definition.

## Architecture

### Controllers

Controllers handle HTTP request/response logic and orchestrate business operations:

- `StoreController` - Store operations
- `ProductController` - Product search and price comparison
- `BasketController` - Basket management and price comparison
- `WatchlistController` - Watchlist and price alerts

### Data Flow

1. Request → Route → Controller
2. Controller validates input with Zod schemas
3. Controller queries database via Prisma Client
4. Response formatted and returned

### Error Handling

All errors are caught by the global error handler middleware:
- Zod validation errors → 400 Bad Request
- Not found errors → 404 Not Found
- Server errors → 500 Internal Server Error

## Development Tips

### Prisma Studio

Open Prisma Studio to browse and edit database data:

```bash
pnpm db:studio
```

### Reset Database

To reset your development database:

```bash
pnpm db:push --force-reset
pnpm db:seed
```

### Generate Migration

After changing `schema.prisma`:

```bash
pnpm db:migrate
```

This creates a new migration file and applies it.

## Production Deployment

1. Set environment variables (especially `DATABASE_URL`)
2. Run migrations: `pnpm db:migrate deploy`
3. Build: `pnpm build`
4. Start: `node dist/index.js`

## API Documentation

Interactive API documentation is available via Swagger UI at:

http://localhost:3001/api-docs

The documentation includes:
- All available endpoints
- Request/response schemas
- Example requests
- Try-it-out functionality
