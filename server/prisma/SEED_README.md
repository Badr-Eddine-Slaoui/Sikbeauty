# Database Seeding Guide

This guide explains how to seed your database with sample data for development and testing.

## Prerequisites

- PostgreSQL database running and configured
- `DATABASE_URL` environment variable set in your `.env` file
- Database migrations applied (`npx prisma migrate dev`)

## Running the Seed Script

### Option 1: Using npm script
```bash
cd server
npm run seed
```

### Option 2: Using Prisma CLI
```bash
cd server
npx prisma db seed
```

### Option 3: Direct execution
```bash
cd server
npx ts-node prisma/seed.ts
```

## What Gets Seeded

The seed script creates:

1. **6 Categories:**
   - Cleansers
   - Toners & Essences
   - Serums & Ampoules
   - Moisturizers
   - Masks
   - Sunscreen

2. **8 Sample Products:**
   - Products across different categories
   - Various prices, discounts, and stock levels
   - Includes examples of low stock and out of stock items

3. **1 Test User:**
   - Email: `test@example.com`
   - Password: `password123`
   - Role: `Individual`

## Notes

- The seed script is **idempotent** - it won't create duplicates if data already exists
- Categories and products are checked before creation to avoid duplicates
- The test user is upserted (created or updated if exists)

## Frontend Mock Data

If you prefer not to seed the database, the frontend includes mock data that will be used automatically when:
- The API returns empty results
- API calls fail
- No authentication token is available

The mock data is located in `frontend/src/utils/mockData.js` and matches the seed data structure.

