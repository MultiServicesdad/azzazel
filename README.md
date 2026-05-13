# Azazel OSINT — Institutional Intelligence Platform

Azazel OSINT is a venture-grade cybersecurity SaaS platform built for professional intelligence gathering, digital footprinting, and breach detection.

## 🚀 Technology Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS 4, Framer Motion, shadcn/ui.
- **Backend**: Node.js, Next.js API Routes, PostgreSQL, Redis.
- **Auth**: Custom "Azazel ID" system, JWT, HttpOnly Cookies, Session Rotation.
- **Data**: Prisma ORM, OSINT Provider Aggregation (Snusbase, LeakCheck, LeakOSINT).

## 🛠️ Features

- **Multi-Source Aggregation**: Unified interface for Snusbase, LeakCheck, and LeakOSINT.
- **Censorship Pipeline**: Intelligent PII masking based on subscription clearance.
- **Azazel ID**: Unique cryptographic hex identifiers for every intelligence asset (user).
- **Institutional API**: REST platform with documentation for Python, Node.js, and cURL.
- **Admin Command Center**: Real-time system monitoring, user management, and audit logs.
- **Premium UI**: Glassmorphism, animated transitions, and dark intelligence aesthetics.

## 📦 Installation

### 1. Requirements
- Node.js 20+
- Docker & Docker Compose
- NPM

### 2. Setup Environment
```bash
cp .env.example .env.local
```
Fill in your OSINT provider keys and database credentials.

### 3. Start Infrastructure
```bash
docker-compose -f docker/docker-compose.yml up -d
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Database Initialization
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 6. Run Development Server
```bash
npm run dev
```

## 🔐 Initial Admin Credentials
- **Email**: `admin@azazel-osint.com`
- **Password**: `AzazelAdminPassword123!`

## 📁 Project Structure

- `src/app`: Next.js App Router (Pages & API)
- `src/components`: UI components (shadcn/ui, Layouts, Dashboard)
- `src/services`: Business logic (Auth, Search, Censorship)
- `src/providers`: OSINT provider adapters (Snusbase, LeakCheck, etc.)
- `src/lib`: Core utilities (Prisma, Redis, Constants, Validations)
- `prisma`: Database schema and seed scripts
- `docker`: Production Docker and infrastructure config

## 📜 License
Institutional Clearance Required.
