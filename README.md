# Nexus CRM - Client Lead Management System

A high-performance, visually stunning Client Lead Management System built for the Future Interns Task 2 (2026). This system is designed to help businesses ingest, track, and convert leads with a cinematic user interface and robust backend logic.

## 🚀 Key Features

- **Cosmic Parallax Interface**: A premium, interactive landing experience that sets a professional tone.
- **Lead Ecosystem Dashboard**:
  - **Lead Listing**: Comprehensive view of name, email, source, and status.
  - **3D Pipeline Visualization**: A scroll-based card reveal for system metrics.
  - **Lead Management**: Update status (New → Contacted → Converted) and add intelligence notes.
- **Search & Intelligent Filtering**: Instantly find leads by identity or current status sector.
- **Real-time Analytics**: Dynamic tracking of total leads, conversion rates, and pipeline distribution.
- **Secure Admin Access**: Protected dashboard with JWT-based authentication.
- **Persistent Storage**: MongoDB integration ensures no lead data is ever lost.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js, Mongoose.
- **Database**: MongoDB.
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt for secure access.

## 📦 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or on Atlas)

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/nexus_crm
   JWT_SECRET=your_secret_key
   ADMIN_EMAIL=admin@nexus.com
   ADMIN_PASSWORD=admin123
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 💼 Business Rationale
This CRM solves critical business questions:
- **Speed to Lead**: Quick ingestion and clear visibility of new opportunities.
- **Follow-up Consistency**: Dedicated notes section for tracking interaction history.
- **Conversion Tracking**: Visual metrics to understand business growth.

---
Built with ⚡ by Vineet Dwd & Team for Future Interns.
