# 🚀 StartupConnect

StartupConnect is a full-stack MERN platform where students, developers, founders, and startups can connect with each other.

Users can discover startups, explore job opportunities, apply for roles, and learn about innovative companies, while startup founders can showcase their startups and hire talented people.

---

## ✨ Features

### 👨‍💻 Authentication
- User Signup
- User Login
- JWT Authentication
- Protected Routes

### 🚀 Startup Module
- View all startups
- Startup Details Page
- Founder Information
- Tech Stack
- Open Positions
- Save Startup
- Apply to Startup

### 💼 Jobs Module
- Browse Startup Jobs
- Search Jobs
- Filter Jobs
- Job Details
- Apply Button

### 🎨 UI/UX
- Fully Responsive Design
- Modern Tailwind CSS UI
- Smooth Animations
- Clean Components
- Mobile Friendly

---

# 🛠 Tech Stack

## Frontend
- React.js
- React Router DOM
- Tailwind CSS
- Axios
- Lucide React

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv

---

# 📂 Project Structure

```
StartupConnect
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── seed
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone <repository-url>
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder.

```
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

Run Backend

```bash
npm run dev
```

---

## Seed Database

```bash
npm run seed
```

---

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

# 🌐 API Routes

## Authentication

```
POST /api/auth/register

POST /api/auth/login
```

## Startups

```
GET /api/startups

GET /api/startups/:id

POST /api/startups

PATCH /api/startups/:id/save

POST /api/startups/:id/apply
```

## Jobs

```
GET /api/jobs

GET /api/jobs/:id
```

---

# 📸 Screenshots

Add screenshots here after project completion.

```
Home Page

Startup Page

Startup Details

Jobs Page

Login

Signup
```

---

# 🚧 Upcoming Features

- Dashboard
- User Profile
- Founder Dashboard
- Startup Creation
- Job Posting
- Resume Upload
- Email Notifications
- Search & Filters
- Dark Mode

---

# 👩‍💻 Developer

**Chanchal Rathore**

GitHub: https://github.com/your-github-username

LinkedIn: https://linkedin.com/in/your-linkedin

---

## ⭐ If you like this project

Give this repository a ⭐ on GitHub.
