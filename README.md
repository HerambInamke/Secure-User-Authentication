# Secure User Authentication System

A comprehensive user authentication system with secure login, registration functionality, and role-based access control.

## 🚀 Features

- 🔐 Secure user registration with email verification
- 🛡️ JWT-based authentication with password hashing
- 👥 Role-based access control (User, HR, Admin)
- 🎨 Modern, responsive UI with rich color scheme
- 🔒 Protected routes and proper authorization
- 🧮 Password hashing and JWT implementation
- ✅ Input validation and security measures

## 🛠️ Tech Stack

### Frontend
- React 18+
- Tailwind CSS
- Redux Toolkit
- React Router v6
- Axios
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcrypt
- Express Validator

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd secure-user-authentication
   ```

2. Install dependencies
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables
   ```bash
   # In server directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development servers
   ```bash
   # Start backend server (from server directory)
   npm run dev

   # Start frontend server (from client directory)
   npm run dev
   ```

## 📁 Project Structure

```
project-root/
├── client/          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
├── server/          # Node.js/Express Backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   └── server.js
└── README.md
```

## 👤 Default Accounts

### Admin
- **Email:** `admin@email.com`
- **Password:** `admin@123`

### HR
- **Email:** `hr@email.com`
- **Password:** `hr@123`

## 📄 License

This project is licensed under the [MIT License](LICENSE).
