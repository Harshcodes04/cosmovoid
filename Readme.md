<div align="center">

<br/>

#  COSMOVOID

**Your private observatory for everything beyond Earth.**

<br/>

[![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

<br/>

> *Space is vast. Information about it shouldn't be.*
> Cosmovoid pulls live launches, NASA imagery, asteroid alerts,
> space news, and your personal mission log into one dark, focused interface.

<br/>

</div>

---

<br/>

## ✦ Features

<br/>

<table>
  <tr>
    <td width="50%">
      <h3>🚀 Launch Tracking</h3>
      <p>Upcoming &amp; past launches from every major agency — SpaceX, NASA, ESA, Roscosmos, ISRO — with full mission detail pages.</p>
    </td>
    <td width="50%">
      <h3>🌌 NASA APOD</h3>
      <p>Today's Astronomy Picture of the Day, delivered fresh every 24 hours. Galaxies, nebulae, solar flares — whatever the universe served up.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>☄️ Asteroid Watch</h3>
      <p>Near-Earth objects making close approaches today, with size, miss distance, and hazard status.</p>
    </td>
    <td>
      <h3>📡 Space News</h3>
      <p>Headlines from across the industry, aggregated and linked back to primary sources.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>👨‍🚀 Crew Explorer</h3>
      <p>Active astronauts ranked by time in space, with detailed bios and mission histories.</p>
    </td>
    <td>
      <h3>🛸 Rocket Library</h3>
      <p>Rocket configurations from multiple agencies with full specs and mission context.</p>
    </td>
  </tr>
  <tr>
    <td>
      <h3>🗒️ Mission Journal</h3>
      <p>Private, auth-gated journal for logging observations — mood tags, custom labels, full edit/delete support.</p>
    </td>
    <td>
      <h3>🖥️ Mission Control</h3>
      <p>Your personalized command deck. All live feeds, one screen.</p>
    </td>
  </tr>
</table>

<br/>

---

<br/>

## ⚙️ Architecture

<br/>

<details>
<summary><b>🗄️ &nbsp;Stale-While-Revalidate Cache</b></summary>
<br/>

External API responses live in MongoDB with two expiry windows:

- **Fresh window** — cached data is served as-is, no upstream call made
- **Stale window** — old data is returned instantly while a background refresh runs silently

An **in-memory layer** sits in front of MongoDB to cut round-trips further. Duplicate in-flight fetches for the same key are collapsed into a single request.

<br/>
</details>

<details>
<summary><b>🔐 &nbsp;JWT Auth via HttpOnly Cookies</b></summary>
<br/>

Sessions are signed tokens stored in `HttpOnly` cookies, keeping them out of JavaScript's reach entirely.

- Login accepts either **email** or **username**
- Protected routes (Dashboard, Journal) redirect unauthenticated visitors automatically

<br/>
</details>

<details>
<summary><b>🛡️ &nbsp;Rate Limiting & Input Validation</b></summary>
<br/>

- `/login` is rate-limited to **20 requests / 10 minutes** per IP
- All auth fields validated server-side via `express-validator` before touching the database

<br/>
</details>

<br/>

---

<br/>

## 🛠️ Tech Stack

<br/>

| Layer | Technologies |
|:---|:---|
| **Frontend** | React 19 · React Router 7 · Tailwind CSS 4 · Framer Motion · Vite |
| **Backend** | Node.js · Express 5 |
| **Database** | MongoDB · Mongoose 9 |
| **Auth** | JWT · bcryptjs · HttpOnly Cookies |
| **Security** | Helmet · CORS · express-rate-limit · express-validator |
| **APIs** | Launch Library 2 · NASA APOD · NASA NeoWs · Spaceflight News |

<br/>

---

<br/>

## 📁 Project Structure

<br/>

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

<br/>

---

<br/>

## 🚦 Getting Started

<br/>

**Prerequisites**
- Node.js ≥ 18
- MongoDB running locally, or an Atlas connection string
- A free [NASA API key](https://api.nasa.gov/) *(optional — falls back to `DEMO_KEY`)*

<br/>

**1 · Clone & enter**
```bash
git clone <repo-url>
cd cosmovoid
```

**2 · Configure the backend**
```bash
cd backend
cp .env.example .env
```

```env
PORT            = 5000
FRONTEND_PORT   = 5173
MONGO_URI       = mongodb://127.0.0.1:27017/cosmovoid
JWT_SECRET      = replace-with-something-strong
NASA_API_KEY    = your-key-here
```

**3 · Start the backend**
```bash
npm install && npm start
```

**4 · Start the frontend**
```bash
cd ../frontend
npm install && npm run dev
```

Open `http://localhost:5173` — you're in orbit. 🛰️

<br/>

---

<br/>

## 🌐 API Reference

<br/>

<details>
<summary><b>Auth &nbsp;—&nbsp; <code>/api/auth</code></b></summary>
<br/>

| Method | Endpoint | Description |
|:---:|:---|:---|
| `POST` | `/signup` | Create an account |
| `POST` | `/login` | Log in *(rate-limited)* |
| `POST` | `/logout` | Clear session cookie |
| `GET` | `/me` | Get the current user |

<br/>
</details>

<details>
<summary><b>Space &nbsp;—&nbsp; <code>/api/space</code></b></summary>
<br/>

| Method | Endpoint | Description |
|:---:|:---|:---|
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

<br/>
</details>

<details>
<summary><b>Journal &nbsp;—&nbsp; <code>/api/journal</code> &nbsp;🔒 auth required</b></summary>
<br/>

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/` | All entries for current user |
| `POST` | `/` | Create a new entry |
| `GET` | `/:id` | Single entry |
| `PUT` | `/:id` | Edit an entry |
| `DELETE` | `/:id` | Delete an entry |

<br/>
</details>

<br/>

---

<br/>

## 🔑 Environment Variables

<br/>

| Variable | Required | Notes |
|:---|:---:|:---|
| `PORT` | ✅ | Backend port — default `5000` |
| `FRONTEND_PORT` | ✅ | Vite dev port, used to configure CORS |
| `MONGO_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Should be long and randomly generated |
| `NASA_API_KEY` | ➖ | Falls back to `DEMO_KEY` if omitted |

<br/>

---

<br/>

## 🛰️ Roadmap

<br/>

| Status | Feature | Description |
|:---:|:---|:---|
| ⬜ | **Live Launch Countdown** | Real-time countdown timer on launch pages |
| ⬜ | **APOD Gallery Archive** | Browse past APOD entries by date or keyword |
| ⬜ | **Earth Events Map** | NASA EONET — wildfires, storms, volcanic activity |
| ⬜ | **ISS Live Tracker** | Real-time ISS position on a world map |
| ⬜ | **Notification System** | Alerts for bookmarked upcoming launches |
| ⬜ | **Dark/Light Theme Toggle** | User-selectable theme, persisted to account |
| ⬜ | **Journal Export** | Download entries as PDF or markdown |

<br/>

---

<br/>

<div align="center">

*Built in the dark. Pointed at the stars.*

</div>
