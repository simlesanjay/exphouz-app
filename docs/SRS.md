# 📘 SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

## Product Name

**Exphouz**
*(aka DesignPro Connect)*

## Version

v1.0 (MVP → Scale-ready)

## Document Type

Production SRS – Real-Life SaaS Platform

---

## 1. INTRODUCTION

### 1.1 Purpose

This document defines the **functional, non-functional, technical, and architectural requirements** of **Exphouz**, a premium marketplace platform connecting **users (homeowners)** with **verified professionals (architects, interior designers, contractors)**.

This SRS is intended for:

* Product Managers
* Frontend & Backend Engineers
* DevOps / Cloud Architects
* UI/UX Designers
* Business & Operations Teams

---

### 1.2 Scope of the Product

Exphouz is a **two-sided marketplace SaaS platform** that provides:

* Professional discovery
* Verified portfolios
* User requirements posting
* Paid premium visibility for professionals
* Subscription-based access control
* Secure authentication
* Admin moderation

The system is **mobile-first**, **SEO-optimized**, and **scalable for AWS deployment**.

---

### 1.3 Target Users

| Role                   | Description                                   |
| ---------------------- | --------------------------------------------- |
| **Guest**              | Can browse limited professionals              |
| **User**               | Can post requirements & contact professionals |
| **Professional (PRO)** | Can upload projects & receive leads           |
| **Admin**              | Platform moderation & approvals               |

---

## 2. OVERALL SYSTEM DESCRIPTION

### 2.1 System Architecture (High Level)

```
Client (Web / Mobile)
   ↓
Next.js / Vite React Frontend
   ↓
API Layer (Next.js API / Server Actions)
   ↓
Prisma ORM
   ↓
PostgreSQL (RDS)
   ↓
S3 (Images) + CDN (CloudFront)
```

---

### 2.2 Tech Stack

| Layer    | Technology               |
| -------- | ------------------------ |
| Frontend | React + Vite / Next.js   |
| UI       | Tailwind CSS + shadcn/ui |
| Backend  | Next.js API Routes       |
| ORM      | Prisma                   |
| Database | PostgreSQL               |
| Auth     | Email + Social (Google)  |
| Hosting  | AWS                      |
| Storage  | AWS S3                   |
| CI/CD    | GitHub Actions           |

---

## 3. FOLDER STRUCTURE (AS IMPLEMENTED)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── admin/
│   │   └── upload/
│   │
│   ├── (public)/
│   │   └── experts/
│   │
│   ├── professionals/
│   ├── profile/[id]/
│   ├── projects/
│   ├── requirements/
│   │   ├── post/
│   │   └── [id]/
│   ├── subscription/
│   ├── about/
│   ├── api/
│   │   └── v1/
│   │       ├── auth/
│   │       ├── projects/
│   │       ├── requirements/
│   │       ├── pros/
│   │       └── admin/
│   └── layout.tsx
│
├── components/
├── lib/
├── prisma/
└── public/
```

---

## 4. FUNCTIONAL REQUIREMENTS (PAGE-WISE)

---

## 4.1 Authentication Module

### Pages

* `/login`
* `/register`

### Features

* Email + password authentication
* Role selection (USER / PRO)
* City selection
* Password hashing (bcrypt)
* Session storage (JWT / cookies – future)

### API

```
POST /api/v1/auth/login
POST /api/v1/auth/register
```

---

## 4.2 Professionals Directory (`/professionals`)

### Purpose

Public marketplace to discover professionals.

### Features

* Premium professionals shown first
* City & category filtering
* Profile card grid
* Premium badge
* Skeleton loading

### Premium Logic

| Type        | Behavior            |
| ----------- | ------------------- |
| Free PRO    | Lower visibility    |
| Premium PRO | Top ranking + badge |

---

## 4.3 Professional Profile (`/profile/[id]`)

### Features

* Hero section
* Bio & city
* Portfolio preview
* Contact buttons
* Paywall for guests (after X views)

### Access Rules

* Guest → Limited
* User → Full
* Premium PRO → Highlighted

---

## 4.4 Projects Module

### Pages

* `/projects`
* `/projects/[id]`

### Features

* Image gallery
* City & category tags
* Sorted by PRO priority
* SEO optimized

---

## 4.5 Requirements Module

### Pages

* `/requirements`
* `/requirements/post`
* `/requirements/[id]`

### Flow

1. User posts requirement
2. PROs can respond
3. Admin monitors misuse

### Permissions

| Role  | Permission   |
| ----- | ------------ |
| Guest | ❌            |
| User  | ✅            |
| PRO   | Respond only |
| Admin | Moderate     |

---

## 4.6 Dashboard (PRO)

### Pages

* `/dashboard`
* `/dashboard/upload`

### Features

* Project upload
* Portfolio management
* Lead visibility
* Verification status

---

## 4.7 Admin Dashboard

### Pages

* `/dashboard/admin`

### Features

* User moderation
* PRO approval
* Premium assignment
* Content removal

---

## 4.8 Subscription & Paywall

### Page

* `/subscription`

### Plans

| Plan         | Access         |
| ------------ | -------------- |
| Free User    | Limited views  |
| Premium User | Unlimited      |
| Free PRO     | Low visibility |
| Premium PRO  | Featured       |

---

## 5. DATABASE DESIGN (ER OVERVIEW)

### Core Tables

* User
* ProProfile
* Project
* Image
* Category
* Requirement
* RequirementResponse
* ContactEvent
* Subscription

*(Already implemented via Prisma)*

---

## 6. NON-FUNCTIONAL REQUIREMENTS

### 6.1 Performance

* Page load < 2s
* API response < 300ms

### 6.2 Security

* Password hashing
* Role-based access
* Input validation
* Rate limiting (future)

### 6.3 Scalability

* Stateless backend
* Horizontal scaling
* CDN for assets

---

## 7. DEPLOYMENT (AWS READY)

### Infrastructure

| Component | Service          |
| --------- | ---------------- |
| Frontend  | EC2 / Amplify    |
| Backend   | EC2 / Lambda     |
| DB        | RDS PostgreSQL   |
| Storage   | S3               |
| CDN       | CloudFront       |
| Auth      | Cognito (future) |

---

## 8. PREMIUM LOGIC (BUSINESS CRITICAL)

### Premium PRO

* Featured placement
* PriorityScore++
* Badge
* Analytics access

### Premium USER

* Unlimited profile views
* Direct contact
* Save professionals

---

## 9. FUTURE ROADMAP

* Mobile app (React Native)
* AI recommendation engine
* Payment gateway
* Chat system
* Review & ratings
* Analytics dashboard

---

## 10. APPROVAL

This SRS represents a **real-world production platform** designed for:

* Hosting on AWS
* Monetization
* Growth to 100k+ users
