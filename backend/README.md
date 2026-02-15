# Subscription Management System API

A production-ready RESTful API built with Node.js, Express, TypeScript, and MongoDB for managing admin-led systems. This system allows admins to manage users, subscription plans, and user subscriptions.

## Features
- **Full CRUD Operations**: Manage Users, Plans, and Subscriptions.
- **Relational Modeling**: Subscriptions link Users to specific Plans using MongoDB ObjectIds.
- **Advanced Query Handling**: Built-in support for filtering, sorting, and pagination.
- **Authentication & RBAC**: JWT-based authentication with role-based access control (Admin vs User).
- **Request Validation**: Schema-based validation using Zod.
- **Centralized Error Handling**: Uniform error responses with proper HTTP status codes.

---

## Data Models

### User
- `name`: string
- `email`: string (unique)
- `password`: string (hashed, hidden in responses)
- `role`: 'admin' | 'user' (default: 'user')

### Plan
- `name`: string
- `price`: number
- `duration`: number (months)

### Subscription
- `user`: ObjectId (ref: User)
- `plan`: ObjectId (ref: Plan)
- `status`: 'active' | 'cancelled' | 'expired'
- `startDate`: Date
- `endDate`: Date (auto-calculated based on Plan duration)

---

## API Endpoints

### Auth
- `POST /api/v1/auth/register`: Register a new user
- `POST /api/v1/auth/login`: Login and receive JWT token

### Users
- `GET /api/v1/users`: Get all users (Protected)
- `GET /api/v1/users/:id`: Get user by ID (Protected)
- `POST /api/v1/users`: Create user (Admin Only)
- `PATCH /api/v1/users/:id`: Update user (Admin Only)
- `DELETE /api/v1/users/:id`: Delete user (Admin Only)

### Plans
- `GET /api/v1/plans`: Get all plans (Protected)
- `GET /api/v1/plans/:id`: Get plan by ID (Protected)
- `POST /api/v1/plans`: Create plan (Admin Only)
- `PATCH /api/v1/plans/:id`: Update plan (Admin Only)
- `DELETE /api/v1/plans/:id`: Delete plan (Admin Only)

### Subscriptions
- `GET /api/v1/subscriptions`: Get all subscriptions (Protected)
- `GET /api/v1/subscriptions/:id`: Get subscription by ID (Protected)
- `POST /api/v1/subscriptions`: Create subscription (Admin Only)
- `PATCH /api/v1/subscriptions/:id`: Update subscription (Admin Only)
- `DELETE /api/v1/subscriptions/:id`: Delete subscription (Admin Only)

---

## Query Examples

All `GET` collection endpoints support advanced queries:

### Filtering
`GET /api/v1/subscriptions?status=active`
`GET /api/v1/plans?price[gte]=50`

### Sorting
`GET /api/v1/users?sort=name&order=asc`
`GET /api/v1/subscriptions?sort=createdAt&order=desc`

### Pagination
`GET /api/v1/plans?page=2&limit=5`

---

## How to Run

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or a URI)

### Setup
1. Clone the repository and navigate to the project root.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/subscription-system
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   ```

### Execution
- **Development**:
  ```bash
  npm run dev
  ```
- **Build**:
  ```bash
  npm run build
  ```
- **Production**:
  ```bash
  npm start
  ```
