# E-Commerce Full Stack App

This repository contains a learning-focused full-stack e-commerce application.

## Backend Setup (Node.js + Express + MongoDB)

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### Backend Request Flow

1. **Request** hits a route (e.g., `/api/products`).
2. **Middleware** runs (JWT auth for protected routes).
3. **Controller** handles business logic.
4. **Database** performs queries through Mongoose models.
5. **Response** returns standardized JSON with `success`, `message`, and `data`.

## Frontend Setup (React + Vite + Tailwind)

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the frontend:
   ```bash
   npm run dev
   ```

## Environment Variables

Backend requires the following env vars (see `backend/.env.example`):
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
