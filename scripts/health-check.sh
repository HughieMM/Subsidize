#!/bin/bash
# Health check script - verifies all prerequisites are installed
# Run this before starting development to catch issues early

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🏥 Subsidize Health Check"
echo "========================="
echo ""

# Track overall status
ALL_GOOD=true

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    REQUIRED_VERSION="18.0.0"
    CURRENT_VERSION=$(echo $NODE_VERSION | sed 's/v//')

    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$CURRENT_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
        echo -e "${GREEN}✓${NC} $NODE_VERSION"
    else
        echo -e "${RED}✗${NC} Version $NODE_VERSION found, but >= 18.0.0 required"
        ALL_GOOD=false
    fi
else
    echo -e "${RED}✗${NC} Not installed"
    echo -e "  ${YELLOW}Install with: https://nodejs.org/ or use nvm${NC}"
    ALL_GOOD=false
fi

# Check pnpm
echo -n "Checking pnpm... "
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo -e "${GREEN}✓${NC} $PNPM_VERSION"
else
    echo -e "${RED}✗${NC} Not installed"
    echo -e "  ${YELLOW}Install with: npm install -g pnpm@8${NC}"
    ALL_GOOD=false
fi

# Check PostgreSQL
echo -n "Checking PostgreSQL... "
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version | awk '{print $3}')
    echo -e "${GREEN}✓${NC} $PSQL_VERSION"

    # Check if PostgreSQL is running
    echo -n "  Checking if PostgreSQL is running... "
    if psql -h localhost -U postgres -c "SELECT 1" &> /dev/null || \
       psql -h localhost -U $USER -c "SELECT 1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} Running"
    else
        echo -e "${YELLOW}⚠${NC}  Not running or credentials needed"
        echo -e "  ${YELLOW}Start with: brew services start postgresql (macOS)${NC}"
    fi
else
    echo -e "${RED}✗${NC} Not installed"
    echo -e "  ${YELLOW}Install with: brew install postgresql (macOS)${NC}"
    ALL_GOOD=false
fi

# Check Redis
echo -n "Checking Redis... "
if command -v redis-cli &> /dev/null; then
    REDIS_VERSION=$(redis-cli --version | awk '{print $2}')
    echo -e "${GREEN}✓${NC} $REDIS_VERSION"

    # Check if Redis is running
    echo -n "  Checking if Redis is running... "
    if redis-cli ping &> /dev/null; then
        echo -e "${GREEN}✓${NC} Running"
    else
        echo -e "${YELLOW}⚠${NC}  Not running"
        echo -e "  ${YELLOW}Start with: brew services start redis (macOS)${NC}"
    fi
else
    echo -e "${RED}✗${NC} Not installed"
    echo -e "  ${YELLOW}Install with: brew install redis (macOS)${NC}"
    ALL_GOOD=false
fi

# Check Git
echo -n "Checking Git... "
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | awk '{print $3}')
    echo -e "${GREEN}✓${NC} $GIT_VERSION"
else
    echo -e "${RED}✗${NC} Not installed"
    ALL_GOOD=false
fi

# Check for mobile development tools (optional)
echo ""
echo "Mobile Development (Optional):"

# Check Xcode (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -n "  Checking Xcode... "
    if command -v xcodebuild &> /dev/null; then
        XCODE_VERSION=$(xcodebuild -version | head -n1 | awk '{print $2}')
        echo -e "${GREEN}✓${NC} $XCODE_VERSION"

        # Check Command Line Tools
        echo -n "  Checking Xcode Command Line Tools... "
        if xcode-select -p &> /dev/null; then
            echo -e "${GREEN}✓${NC}"
        else
            echo -e "${YELLOW}⚠${NC}  Not installed"
            echo -e "    ${YELLOW}Install with: xcode-select --install${NC}"
        fi

        # Check CocoaPods
        echo -n "  Checking CocoaPods... "
        if command -v pod &> /dev/null; then
            POD_VERSION=$(pod --version)
            echo -e "${GREEN}✓${NC} $POD_VERSION"
        else
            echo -e "${YELLOW}⚠${NC}  Not installed (needed for iOS)"
            echo -e "    ${YELLOW}Install with: sudo gem install cocoapods${NC}"
        fi
    else
        echo -e "${YELLOW}⚠${NC}  Not installed (needed for iOS development)"
    fi

    # Check Watchman
    echo -n "  Checking Watchman... "
    if command -v watchman &> /dev/null; then
        WATCHMAN_VERSION=$(watchman --version)
        echo -e "${GREEN}✓${NC} $WATCHMAN_VERSION"
    else
        echo -e "${YELLOW}⚠${NC}  Not installed (recommended for React Native)"
        echo -e "    ${YELLOW}Install with: brew install watchman${NC}"
    fi
fi

# Check Android SDK (optional)
echo -n "  Checking Android SDK... "
if [ -d "$ANDROID_HOME" ] || [ -d "$HOME/Library/Android/sdk" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠${NC}  Not found (needed for Android development)"
    echo -e "    ${YELLOW}Install Android Studio from: https://developer.android.com/studio${NC}"
fi

# Check Docker (optional)
echo ""
echo "Docker (Optional, for easy PostgreSQL + Redis):"
echo -n "  Checking Docker... "
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | awk '{print $3}' | sed 's/,//')
    echo -e "${GREEN}✓${NC} $DOCKER_VERSION"

    # Check if Docker is running
    echo -n "  Checking if Docker daemon is running... "
    if docker info &> /dev/null; then
        echo -e "${GREEN}✓${NC} Running"
    else
        echo -e "${YELLOW}⚠${NC}  Not running"
        echo -e "    ${YELLOW}Start Docker Desktop${NC}"
    fi
else
    echo -e "${YELLOW}⚠${NC}  Not installed"
    echo -e "    ${YELLOW}Install from: https://www.docker.com/products/docker-desktop${NC}"
fi

# Summary
echo ""
echo "========================="
if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}✓ All core prerequisites are installed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run: make setup (or pnpm install)"
    echo "  2. Configure .env files in services/api and apps/web"
    echo "  3. Run: make db-setup"
    echo "  4. Run: make dev"
else
    echo -e "${RED}✗ Some core prerequisites are missing${NC}"
    echo ""
    echo "Please install the missing requirements above, then run this check again."
    exit 1
fi
