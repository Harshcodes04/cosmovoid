<div align="center">

```
 ██████╗ ██████╗ ███████╗███╗   ███╗ ██████╗ ██╗   ██╗ ██████╗ ██╗██████╗ 
██╔════╝██╔═══██╗██╔════╝████╗ ████║██╔═══██╗██║   ██║██╔═══██╗██║██╔══██╗
██║     ██║   ██║███████╗██╔████╔██║██║   ██║██║   ██║██║   ██║██║██║  ██║
██║     ██║   ██║╚════██║██║╚██╔╝██║██║   ██║╚██╗ ██╔╝██║   ██║██║██║  ██║
╚██████╗╚██████╔╝███████║██║ ╚═╝ ██║╚██████╔╝ ╚████╔╝ ╚██████╔╝██║██████╔╝
 ╚═════╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝ ╚═════╝   ╚═══╝   ╚═════╝ ╚═╝╚═════╝ 
```

**Your private observatory for everything beyond Earth.**

![Node](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)

</div>

---

> *Space is vast. Information about it shouldn't be.* Cosmovoid pulls live launches, NASA imagery, asteroid alerts, space news, and your personal mission log into one dark, focused interface.

---

## ✦ What It Does

| | Feature | |
|---|---|---|
| 🚀 | **Launch Tracking** | Global upcoming & past launches from every major agency — SpaceX, NASA, ESA, Roscosmos, ISRO and more — with full mission detail pages. |
| 🌌 | **NASA APOD** | Today's Astronomy Picture of the Day, delivered fresh every 24 hours. Galaxies, nebulae, solar flares — whatever the universe served up today. |
| ☄️ | **Asteroid Watch** | Near-Earth objects making close approaches today, with size, miss distance, and hazard status. |
| 📡 | **Space News** | Headlines from across the industry, aggregated and linked back to source. |
| 👨‍🚀 | **Crew Explorer** | Active astronauts ranked by time in space, with detailed bios and mission histories. |
| 🛸 | **Rocket Library** | Rocket configurations from multiple agencies, with specs and context. |
| 🗒️ | **Mission Journal** | A private, auth-gated journal for logging your observations — with mood tags, custom labels, and full edit/delete support. |
| 🖥️ | **Mission Control** | Your personalized command deck. All live feeds, one screen. |

---

## ⚙️ Under the Hood

**Stale-While-Revalidate Cache** — External API responses live in MongoDB with two expiry windows: a *fresh* window where cached data is served as-is, and a *stale* window where old data is returned instantly while a background refresh runs silently. An in-memory layer sits in front of MongoDB to cut round-trips further, and duplicate in-flight fetches for the same key are collapsed into one request.

**JWT Auth via HttpOnly Cookies** — Sessions are signed tokens stored in `HttpOnly` cookies, keeping them out of JavaScript's reach. Login accepts email or username. Protected routes (Dashboard, Journal) redirect unauthenticated visitors automatically.

**Rate Limiting & Input Validation** — The `/login` endpoint is rate-limited to 20 requests per 10 minutes. All auth fields are validated server-side via `express-validator` before touching the database.

---

## 🛠 Tech Stack

```
Frontend  →  React 19  ·  React Router 7  ·  Tailwind CSS 4  ·  Framer Motion  ·  Vite
Backend   →  Node.js  ·  Express 5
Database  →  MongoDB  ·  Mongoose 9
Auth      →  JWT  ·  bcryptjs  ·  HttpOnly Cookies
Security  →  Helmet  ·  CORS  ·  express-rate-limit  ·  express-validator
APIs      →  Launch Library 2  ·  NASA APOD  ·  NASA NeoWs  ·  Spaceflight News
```

---

## 📁 Project Structure

```
cosmovoid/
├── backend/
│   ├── app.js                  ← Express setup, middleware, routers
│   ├── server.js               ← Entry point
│   └── src/
│       ├── controller/         ← auth · journal · space
│       ├── middleware/         ← JWT verification
│       ├── models/             ← User · JournalEntry · ApiCache
│       ├── routes/             ← authRouter · journalRouter · spaceRouter
│       ├── services/           ← launchLibrary · nasa · news · spacex
│       └── utils/              ← staleCache · asyncHandler
└── frontend/
    └── src/
        ├── api/                ← Axios wrappers
        ├── components/         ← NavBar · Footer · ProtectedRoute
        ├── context/            ← Auth context + useAuth hook
        ├── layouts/            ← ExploreLayout
        ├── pages/              ← All views
        └── routes/             ← AppRouter
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally or a connection string (Atlas works fine)
- A free [NASA API key](https://api.nasa.gov/) *(optional — falls back to `DEMO_KEY` with lower rate limits)*

### 1 · Clone & enter
```bash
git clone <repo-url>
cd cosmovoid
```

### 2 · Set up the backend
```bash
cd backend
cp .env.example .env
```

```env
PORT=5000
FRONTEND_PORT=5173
MONGO_URI=mongodb://127.0.0.1:27017/cosmovoid
JWT_SECRET=replace-with-something-strong
NASA_API_KEY=your-key-here
```

### 3 · Start the backend
```bash
npm install && npm start
```

### 4 · Start the frontend
```bash
cd ../frontend
npm install && npm run dev
```

Open `http://localhost:5173` — you're in orbit. 🛰️

---

## 🌐 API Reference

<details>
<summary><strong>Auth</strong> — <code>/api/auth</code></summary>

| Method | Route | Description |
|---|---|---|
| `POST` | `/signup` | Create an account |
| `POST` | `/login` | Log in *(rate-limited)* |
| `POST` | `/logout` | Clear session cookie |
| `GET` | `/me` | Get the current user |

</details>

<details>
<summary><strong>Space</strong> — <code>/api/space</code></summary>

| Method | Route | Description |
|---|---|---|
| `GET` | `/apod` | Today's NASA APOD |
| `GET` | `/asteroids` | Near-Earth objects |
| `GET` | `/launches/upcoming` | Upcoming global launches |
| `GET` | `/launches/previous` | Past global launches |
| `GET` | `/launches/:id` | Launch detail |
| `GET` | `/astronauts` | Astronaut list |
| `GET` | `/astronauts/:id` | Astronaut detail |
| `GET` | `/news` | Space news feed |
| `GET` | `/rockets` | Rocket list |
| `GET` | `/rockets/:id` | Rocket detail |

</details>

<details>
<summary><strong>Journal</strong> — <code>/api/journal</code> &nbsp;🔒 auth required</summary>

| Method | Route | Description |
|---|---|---|
| `GET` | `/` | All entries for current user |
| `POST` | `/` | Create a new entry |
| `GET` | `/:id` | Single entry |
| `PUT` | `/:id` | Edit an entry |
| `DELETE` | `/:id` | Delete an entry |

</details>

---

## 🔑 Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `PORT` | ✅ | Backend port (default `5000`) |
| `FRONTEND_PORT` | ✅ | Vite port for CORS allow-list |
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Should be long and random |
| `NASA_API_KEY` | ➖ | `DEMO_KEY` used if omitted |


---

## 🛰️ Upcoming Features

- [ ] **Live Launch Countdown** — Real-time countdown timer on individual launch pages with auto-refresh.
- [ ] **APOD Gallery Archive** — Browse and search past NASA APOD entries by date or keyword.
- [ ] **Earth Events Map** — Interactive map powered by NASA EONET showing active wildfires, storms, and volcanic activity.
- [ ] **ISS Live Tracker** — Real-time position of the International Space Station on a world map.
- [ ] **Notification System** — Email or in-app alerts for upcoming launches the user bookmarks.
- [ ] **Dark/Light Theme Toggle** — User-selectable theme preference, saved to account.
- [ ] **Journal Export** — Download all journal entries as a formatted PDF or markdown file.

---

<div align="center">

*Built in the dark. Pointed at the stars.*

</div>
