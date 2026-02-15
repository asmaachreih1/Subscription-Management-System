# Subscription Management Dashboard

A modern, responsive Admin Dashboard built with React, Vite, and Tailwind CSS. This frontend connects to the Subscription Management System REST API to provide a comprehensive management interface.

## Features
- **Authentication**: Secure Login and Registration pages.
- **Protected Routing**: Dashboard access is restricted to authenticated users.
- **Resource Management**: Complete UI for managing Users, Plans, and Subscriptions.
- **Relational Data Handling**: Create subscriptions by selecting users and plans from dropdowns.
- **Real-time Data Interaction**:
    - **Pagination**: Navigate through large datasets.
    - **Sorting**: Order resources by various fields.
    - **Filtering**: Search by name or filter by roles/status.
- **State Feedback**: Loading indicators and error messaging from the backend.
- **Premium Design**: Dark-themed, sleek UI with smooth transitions and Lucide icons.

## Tech Stack
- **React + TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **React Router** (Navigation)
- **Axios** (API requests with JWT interceptors)
- **Lucide React** (Icons)

## How to Run

### Prerequisites
- Node.js (v20+)
- The Backend API must be running (default: `http://localhost:5000`)

### Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
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

## Screenshots
> [!TIP]
> Use the sidebar to navigate between different management sections. All changes are reflected in real-time.
