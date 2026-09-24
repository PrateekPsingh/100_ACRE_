# 100 ACRE

A MERN stack property listing application for buying and renting properties, with real-time messaging.

![100ACRE](https://github.com/PrateekPsingh/100_ACRE_/assets/97173401/07a0f9b6-1c7c-432a-95e1-91ea502133a0)

**Live demo:** https://100-acre-z5d7.vercel.app

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Zustand, Socket.IO Client |
| Backend | Node.js, Express |
| Database | MongoDB Atlas via Prisma ORM |
| Real-time | Socket.IO |
| Image upload | Cloudinary Upload Widget |
| Styling | SCSS |
| Map | Leaflet / React-Leaflet |

---

## Features

- User registration and login (JWT, HTTP-only cookies)
- Profile management with avatar upload
- Create, view, and delete property listings
- Search and filter properties (location, type, price, bedrooms)
- Save/unsave properties
- Real-time messaging between users via Socket.IO
- Interactive map with property pins

---

## Project Structure

```
100_ACRE_/
├── api/          # Express REST API (port 8800)
├── client/       # React frontend (port 5174)
└── socket/       # Socket.IO server (port 4000)
```

---

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

---

## Environment Variables

### `api/.env`
Copy `api/.env.example` and fill in your values:
```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/100acre?appName=Cluster0
JWT_SECRET_KEY=your_strong_random_secret_here
CLIENT_URL=http://localhost:5174
PORT=8800
NODE_ENV=development
```

### `socket/.env`
Copy `socket/.env.example`:
```env
PORT=4000
CLIENT_URL=http://localhost:5174
```

### `client/.env`
Copy `client/.env.example` (optional for local dev — Vite proxy handles routing):
```env
VITE_API_URL=http://localhost:8800/api
VITE_SOCKET_URL=http://localhost:4000
```

> **Never commit `.env` files.** They are in `.gitignore`. Only `.env.example` files are committed.

---

## Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/PrateekPsingh/100_ACRE_.git
cd 100_ACRE_
```

### 2. API server
```bash
cd api
cp .env.example .env        # fill in your values
npm install
npm run dev
# → http://localhost:8800
```

### 3. Socket.IO server
```bash
cd socket
cp .env.example .env
npm install
npm run dev
# → http://localhost:4000
```

### 4. React client
```bash
cd client
npm install
npm run dev
# → http://localhost:5174
```

Open http://localhost:5174 in your browser.

The Vite dev server proxies `/api/*` to port 8800 and `/socket.io` to port 4000 automatically — no CORS configuration needed for local development.

---

## Database Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user and get your connection string
3. Add the connection string to `api/.env` as `DATABASE_URL` — include the database name:
   ```
   mongodb+srv://user:pass@cluster.mongodb.net/100acre?appName=Cluster0
   ```
4. Run the Prisma migration:
   ```bash
   cd api
   npx prisma db push
   ```

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login |
| POST | /api/auth/logout | No | Logout |
| GET | /api/posts | No | Get posts (with filters) |
| GET | /api/posts/:id | No | Get single post |
| POST | /api/posts | Yes | Create post |
| PUT | /api/posts/:id | Yes | Update post (owner only) |
| DELETE | /api/posts/:id | Yes | Delete post (owner only) |
| PUT | /api/users/:id | Yes | Update profile |
| DELETE | /api/users/:id | Yes | Delete account |
| POST | /api/users/save | Yes | Save/unsave post |
| GET | /api/users/profilePosts | Yes | Get own posts + saved posts |
| GET | /api/users/notification | Yes | Get unread chat count |
| GET | /api/chats | Yes | Get all chats |
| GET | /api/chats/:id | Yes | Get chat with messages |
| POST | /api/chats/chat | Yes | Initiate chat from a post |
| PUT | /api/chats/read/:id | Yes | Mark chat as read |
| POST | /api/messages/:chatId | Yes | Send message |

Query params for `GET /api/posts`: `city`, `type` (buy/rent), `property` (apartment/house/condo/land), `bedroom`, `minPrice`, `maxPrice`

---

## Production / Deployment Notes

- Set `NODE_ENV=production` in the API environment
- Cookies are set with `secure: true` and `sameSite: none` in production
- Set `CLIENT_URL` in both `api/.env` and `socket/.env` to your frontend's deployed URL
- Set `VITE_API_URL` and `VITE_SOCKET_URL` in `client/.env` to your deployed API/socket URLs before building
- Run `npm run build` in the client directory for production static files

---

## Demo Accounts

| Username | Password | Role |
|----------|----------|------|
| admin | 123 | Admin |
| user | 123 | User |

### Sample search queries
- Location: **Lucknow**, price range 0–1000
- Location: **Jabalpur**, price range 0–1000
