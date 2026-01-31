#!/bin/bash
# Quick deployment script for GoDaddy servers
# Usage: bash deploy.sh

set -e

echo "================================"
echo "Exphouz Deployment Script"
echo "================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Pull latest code
echo -e "${YELLOW}Step 1: Pulling latest code...${NC}"
git pull origin main

# Step 2: Install dependencies
echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
npm install

# Step 3: Run migrations
echo -e "${YELLOW}Step 3: Running database migrations...${NC}"
npx prisma migrate deploy

# Step 4: Build
echo -e "${YELLOW}Step 4: Building application...${NC}"
npm run build

# Step 5: Restart PM2
echo -e "${YELLOW}Step 5: Restarting application...${NC}"
pm2 restart exphouz || pm2 start npm --name "exphouz" -- start

# Success
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}================================${NC}"

echo -e "${YELLOW}App Status:${NC}"
pm2 status

echo -e "${YELLOW}Recent Logs:${NC}"
pm2 logs exphouz --lines 20
