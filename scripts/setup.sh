#!/bin/bash
# First-time setup script for Subsidize
# Automates installation, env setup, and database initialization

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🚀 Subsidize First-Time Setup"
echo "============================="
echo ""

# Step 1: Install dependencies
echo -e "${BLUE}Step 1: Installing dependencies...${NC}"
if command -v pnpm &> /dev/null; then
    pnpm install
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${YELLOW}⚠${NC}  pnpm not found. Installing pnpm..."
    npm install -g pnpm@8
    pnpm install
    echo -e "${GREEN}✓${NC} Dependencies installed"
fi
echo ""

# Step 2: Setup environment files
echo -e "${BLUE}Step 2: Setting up environment files...${NC}"

# API environment
if [ ! -f "services/api/.env" ]; then
    echo "Creating services/api/.env..."
    cp services/api/.env.example services/api/.env
    echo -e "${GREEN}✓${NC} Created services/api/.env"
    echo -e "${YELLOW}  → Please edit services/api/.env with your database credentials${NC}"
else
    echo -e "${YELLOW}⚠${NC}  services/api/.env already exists, skipping"
fi

# Worker environment
if [ ! -f "services/worker/.env" ]; then
    echo "Creating services/worker/.env..."
    cp services/worker/.env.example services/worker/.env
    echo -e "${GREEN}✓${NC} Created services/worker/.env"
else
    echo -e "${YELLOW}⚠${NC}  services/worker/.env already exists, skipping"
fi

# Web environment
if [ ! -f "apps/web/.env.local" ]; then
    echo "Creating apps/web/.env.local..."
    cp apps/web/.env.local.example apps/web/.env.local 2>/dev/null || \
    cp apps/web/.env.example apps/web/.env.local 2>/dev/null || \
    echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > apps/web/.env.local
    echo -e "${GREEN}✓${NC} Created apps/web/.env.local"
else
    echo -e "${YELLOW}⚠${NC}  apps/web/.env.local already exists, skipping"
fi

# Mobile environment
if [ ! -f "apps/mobile/.env" ]; then
    echo "Creating apps/mobile/.env..."
    cp apps/mobile/.env.example apps/mobile/.env 2>/dev/null || \
    echo "EXPO_PUBLIC_API_URL=http://localhost:4000" > apps/mobile/.env
    echo -e "${GREEN}✓${NC} Created apps/mobile/.env"
else
    echo -e "${YELLOW}⚠${NC}  apps/mobile/.env already exists, skipping"
fi

echo ""

# Step 3: Build shared packages
echo -e "${BLUE}Step 3: Building shared packages...${NC}"
pnpm --filter @subsidize/shared build 2>/dev/null || echo "Shared package not found, skipping"
pnpm --filter @subsidize/ui build 2>/dev/null || echo "UI package not found, skipping"
echo -e "${GREEN}✓${NC} Shared packages built"
echo ""

# Step 4: Database setup
echo -e "${BLUE}Step 4: Database setup...${NC}"
echo "Checking if PostgreSQL is available..."

if command -v psql &> /dev/null; then
    if psql -h localhost -U postgres -c "SELECT 1" &> /dev/null || \
       psql -h localhost -U $USER -c "SELECT 1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} PostgreSQL is running"

        echo ""
        echo "Would you like to run database migrations now? (y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            echo "Generating Prisma Client..."
            cd services/api
            pnpm prisma generate

            echo "Running migrations..."
            pnpm prisma migrate dev

            echo ""
            echo "Would you like to seed the database with sample data? (y/n)"
            read -r seed_response
            if [[ "$seed_response" =~ ^[Yy]$ ]]; then
                pnpm prisma db seed
                echo -e "${GREEN}✓${NC} Database seeded with sample data"
            fi

            cd ../..
            echo -e "${GREEN}✓${NC} Database setup complete"
        else
            echo -e "${YELLOW}⚠${NC}  Skipping database setup. Run 'make db-setup' when ready."
        fi
    else
        echo -e "${YELLOW}⚠${NC}  PostgreSQL not running or credentials needed"
        echo -e "  Start with: brew services start postgresql (macOS)"
        echo -e "  Or use Docker: make docker-up"
        echo -e "  Then run: make db-setup"
    fi
else
    echo -e "${YELLOW}⚠${NC}  PostgreSQL not found"
    echo -e "  Install with: brew install postgresql (macOS)"
    echo -e "  Or use Docker: make docker-up"
    echo -e "  Then run: make db-setup"
fi

echo ""

# Summary
echo "============================="
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Edit environment files if needed:"
echo "     - services/api/.env (database credentials)"
echo "     - services/worker/.env (Redis, queue config)"
echo "     - apps/web/.env.local (API URL)"
echo ""
echo "  2. If you skipped database setup, run:"
echo "     make db-setup"
echo ""
echo "  3. Start development:"
echo "     make dev              (full stack)"
echo "     make dev-web          (web only)"
echo "     make dev-api          (API only)"
echo "     make dev-mobile       (mobile app)"
echo ""
echo "  4. Open in browser:"
echo "     http://localhost:3000  (web app)"
echo "     http://localhost:4000  (API)"
echo ""
echo "For more commands, run: make help"
echo ""
echo "Happy coding! 🚀"
