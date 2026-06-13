# Job Application Tracking Dashboard

A full-stack application for tracking job applications built with React, Vite, Tailwind CSS v4, Node.js, Express, TypeScript, and PostgreSQL.

## Prerequisites

- Node.js (v18+)
- Docker (for running PostgreSQL easily) OR a local PostgreSQL instance

## Quick Start

### 1. Database

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

### 2. Backend

The backend is built with Express and TypeScript. The initial schema will be automatically created on startup.

```bash
cd backend
npm install
npm run dev
```

The backend server will run on `http://localhost:3000`.

### 3. Frontend

The frontend is a React application built with Vite and Tailwind CSS v4.

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Features

- **Dashboard**: View all applications, see total counts by status.
- **Add Application**: Add a new job application with company and role.
- **Application Details**: View specific application details, edit the current status, and add notes.
- **Delete**: Remove an application completely.
