# 🚀 Insta Booking Backend (Node.js + Express + MongoDB)

A modular, scalable, and production-ready backend boilerplate built using **Node.js**, **Express**, and **MongoDB (Mongoose)**.  
Includes support for JWT authentication, RBAC authorization, rate limiting, trace logging, email service, and built-in request validation.

---

## 📁 Folder Structure

```
src
│ app.js
│ server.js
│
├───config
│ dbConfig.js
│ env.schema.js
│ index.js
│
├───constant
│ constant.js
│
├───controllers
│ auth.controller.js
│ userData.js
│
├───middlewares
│ auth.middleware.js
│ rateLimiter.js
│ rbac.middleware.js
│ trace.middleware.js
│ validate.middleware.js
│
├───models
│ Asset.js
│ RefreshToken.js
│ Role.js
│ User.js
│
├───routes
│ auth.routes.js
│ index.js
│
├───services
│ auth.service.js
│ mail.service.js
│
└───utils
apiHelper.js
generateId.js
logger.js
response.js
```


---

## ⚙️ **Tech Stack**

- **Node.js** (Express.js)
- **MongoDB** with **Mongoose**
- **JWT Authentication**
- **RBAC Authorization**
- **Winston Logger**
- **Rate Limiting**
- **Zod/Joi Validation**
- **Nodemailer / Email Service**

---

## 🔐 Authentication Flow

- **Access Token** (short-lived)
- **Refresh Token** (stored in DB)
- **Reset Password Token** (expires in minutes)
- **Role-based access** using `allowRoles()` middleware

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone <repo-url>
cd insta-booking-backend
```
### 2. Install dependencies
```
npm install
```
### 3. Create .env file
```
PORT=5000
MONGO_URI=<your-mongo-uri>

JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_RESET_SECRET=your-reset-secret

JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d
JWT_RESET_TTL=15m

RATE_LIMIT_MAX=5
RATE_WINDOW_MS=300000

```
### 4. Start server
``` bash
npm run dev         # for development
npm start           # for production
```

## 📡 API Routes
### Auth Routes
``` bash
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/profile
```
### User Routes
```
GET /api/users
GET /api/users/:id
````

## 🧱 Middlewares Included

| Middleware               | Purpose                                   |
|-------------------------|-------------------------------------------|
| `auth.middleware.js`    | Verifies JWT access token & attaches user to `req.user` |
| `rbac.middleware.js`    | Handles role-based access using `allowRoles()` |
| `rateLimiter.js`        | Limits repeated requests to protect from brute-force attacks |
| `trace.middleware.js`   | Adds unique `X-Request-Id` to each request for debugging/tracing |
| `validate.middleware.js`| Validates request body, params, and query using schema validators |

---

## 🛠 Utilities

| Utility File       | Description |
|--------------------|-------------|
| `apiHelper.js`     | Contains `asyncHandler`, `ApiError`, `ApiResponse` for clean controller code |
| `logger.js`        | Winston logger for request/response/error logging |
| `generateId.js`    | Generates UUIDs or custom IDs |
| `response.js`      | Central response formatter |

---

## 🧪 Future Enhancements
- Add unit tests using **Jest**
- Add API documentation via **Swagger**
- Add **Docker** support
- Implement CI/CD pipeline

---

## 🤝 Contributing
Contributions are welcome!  
Open an issue before submitting major changes.

---

## 📄 License
This project is licensed under the **MIT License**.

---

## ✨ Author
**Insta Boking Team**  
MERN Stack Developers
