# TaskFlow — Full-Stack MERN Todo App with JWT Authentication

A production-ready todo application built with MongoDB, Express, React, and Node.js featuring JWT authentication, bcrypt password hashing, and a responsive Tailwind CSS UI.

---

## Features

### Frontend
- Responsive UI with Tailwind CSS
- Sign Up / Login pages with form validation
- Protected Dashboard (React Router v6 guards)
- Create, Edit, Delete todos via modal
- Toggle complete / pending
- Filter: All / Pending / Completed
- Real-time search with debounce
- Priority levels: Low / Medium / High
- Stats sidebar with progress bar
- Toast notifications (react-hot-toast)
- Loading skeletons + empty state UI
- JWT stored in localStorage, attached via Axios interceptor
- Auto-redirect on 401 (token expired)

### Backend
- REST API with Express.js
- MongoDB + Mongoose (User & Todo models)
- JWT authentication middleware
- bcryptjs password hashing (12 salt rounds)
- Input validation with express-validator
- User-scoped todos (userId foreign key)
- Search + filter query support
- Proper HTTP status codes and error handling

---

## Tech Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Frontend   | React 18, Tailwind CSS, Axios, React Router v6 |
| Backend    | Node.js, Express.js           |
| Database   | MongoDB Atlas + Mongoose      |
| Auth       | JWT + bcryptjs                |
| State      | React Context API + useReducer |
| Toasts     | react-hot-toast               |
| Dev Tools  | nodemon, concurrently         |

---

## Folder Structure

```
mern-todo/
├── package.json              # Root (concurrent dev scripts)
├── .gitignore
│
├── server/
│   ├── index.js              # Express entry point
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   └── Todo.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── todoController.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── todos.js
│   └── middleware/
│       └── auth.js           # JWT protect middleware
│
└── client/
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css          # Tailwind + custom layers
        ├── App.js             # Router setup
        ├── context/
        │   └── AuthContext.js # Auth state + actions
        ├── services/
        │   └── api.js         # Axios instance + interceptors
        ├── routes/
        │   └── ProtectedRoute.js
        ├── pages/
        │   ├── Login.js
        │   ├── Register.js
        │   └── Dashboard.js
        └── components/
            ├── Navbar.js
            ├── Sidebar.js
            ├── TodoCard.js
            ├── TodoModal.js
            └── EmptyState.js
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/yourusername/mern-todo.git
cd mern-todo
npm run install-all
```

### 2. Configure environment variables

**Server** — copy and edit `server/.env.example`:
```bash
cp server/.env.example server/.env
```
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/mern-todo
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Client** — copy and edit `client/.env.example`:
```bash
cp client/.env.example client/.env
```
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Get MongoDB URI
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. Database Access → Add a user with read/write access
3. Network Access → Allow `0.0.0.0/0` (or your IP)
4. Connect → Drivers → Copy URI, replace `<password>`

### 4. Run development servers

```bash
npm run dev
```

This starts both servers concurrently:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

---

## API Reference

### Auth Routes

#### POST `/api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```
Response: `{ success, message, token, user }`

#### POST `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```
Response: `{ success, message, token, user }`

#### GET `/api/auth/profile`
Headers: `Authorization: Bearer <token>`
Response: `{ success, user }`

---

### Todo Routes
All require: `Authorization: Bearer <token>`

#### GET `/api/todos`
Query params: `filter=all|completed|pending`, `search=text`, `page=1`
Response: `{ success, todos, stats, pagination }`

#### POST `/api/todos`
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "medium"
}
```

#### PUT `/api/todos/:id`
```json
{
  "title": "Updated title",
  "completed": true,
  "priority": "high"
}
```

#### DELETE `/api/todos/:id`
Response: `{ success, message }`

---

## API Testing (curl examples)

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"pass123"}'

# Create todo (replace TOKEN)
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"Learn MERN","priority":"high"}'

# Get todos
curl http://localhost:5000/api/todos \
  -H "Authorization: Bearer TOKEN"

# Toggle complete
curl -X PUT http://localhost:5000/api/todos/TODO_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"completed":true}'

# Delete todo
curl -X DELETE http://localhost:5000/api/todos/TODO_ID \
  -H "Authorization: Bearer TOKEN"
```

---

## Required npm Packages

### Backend (`server/`)
```
express          - Web framework
mongoose         - MongoDB ODM
bcryptjs         - Password hashing
jsonwebtoken     - JWT creation/verification
express-validator- Input validation
cors             - Cross-Origin Resource Sharing
dotenv           - Environment variables
nodemon          - Dev auto-reload
```

### Frontend (`client/`)
```
react-router-dom - Client-side routing
axios            - HTTP client
react-hot-toast  - Toast notifications
tailwindcss      - Utility CSS framework
autoprefixer     - CSS vendor prefixes
postcss          - CSS processing
```

---

## Deployment

### Backend → Render.com

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo, set root directory to `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (same as `.env` but with production values):
   - `MONGODB_URI` — Atlas URI
   - `JWT_SECRET` — strong random string
   - `NODE_ENV=production`
   - `CLIENT_URL` — your Vercel frontend URL

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → Import Project
2. Connect repo, set root directory to `client`
3. Framework preset: Create React App
4. Add environment variable:
   - `REACT_APP_API_URL=https://your-render-app.onrender.com/api`
5. Deploy

### Database → MongoDB Atlas
Already configured. Make sure Network Access allows `0.0.0.0/0` for Render's dynamic IPs.

---

## Security Notes

- Passwords hashed with bcrypt (12 rounds) — never stored in plaintext
- JWT signed with HS256 and a secret key — validated on every protected request
- Input sanitized and validated server-side with express-validator
- CORS restricted to frontend origin via `CLIENT_URL` env var
- Todos are user-scoped — users can only access their own data
- Express body size limited to 10kb to prevent payload attacks

---

## License

MIT
