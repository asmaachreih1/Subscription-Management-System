# 🌊 SubFlow: Subscription Management System

**SubFlow** is a premium, high-performance administrative dashboard designed to orchestrate users, provision resource tiers, and maintain global subscription lifecycles. Built with a modern "Glassmorphism" aesthetic and robust security protocols.

---

## ✨ Core Features

### 🛡️ Security & Identity
- **Unified Auth Flow**: Seamless sliding transition between Login and Registration.
- **Strong Password Defense**: Real-time frontend validation checklist + backend Mongoose enforcement.
- **JWT Protection**: Secure, token-based session management with automatic expiry handling.

### 📊 Admin Command Center
- **User Directory**: Full CRUD for identity management with search and role-based filtering.
- **Service Architect (Plans)**: Dynamic provisioning of subscription tiers with pricing orchestration.
- **Allocations (Subscriptions)**: Lifecycle tracking (Active, Expired, Void) linking users to service tiers.

### ⚡ Technical Excellence
- **Advanced Data Controls**: High-speed pagination, sorting (e.g., sort by Cost), and real-time filtering.
- **Glassmorphism UI**: A breathable, "Alive" interface with micro-animations and smooth transitions.
- **Fully Responsive**: Optimized for both high-density monitors and mobile coordination.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB (Atlas) |
| **Auth** | JSON Web Tokens (JWT), Bcrypt |

---

## ⚙️ Initial Setup

### 1. Clone & Install
```bash
git clone <repository-url>
cd "Subscription Management System"

# Install Backend Dependencies
cd backend && npm install

# Install Frontend Dependencies
cd ../frontend && npm install
```

### 2. Environment Configuration

#### Backend (`/backend/.env`)
```env
PORT=5001
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_hyper_secure_secret
JWT_EXPIRES_IN=1d
```

#### Frontend (`/frontend/.env`)
```env
VITE_API_URL=http://localhost:5001/api/v1
```

---

## 🚀 Execution

### Start Backend
```bash
cd backend
npm run dev
```

### Start Frontend
```bash
cd frontend
npm run dev
```

