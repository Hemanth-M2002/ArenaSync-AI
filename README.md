

https://github.com/user-attachments/assets/af658bda-be31-4a9f-9afd-9745ef10bcf6

# ArenaSync AI 🏟️🤖

### Smart Physical Event Experience Platform for Large Sporting Venues

ArenaSync AI is a web-based intelligent venue experience platform built for the **Google PromptWars Challenge**. It improves the physical event experience for attendees at stadiums, arenas, racing circuits, and concert venues by solving crowd movement, waiting times, and real-time coordination challenges.

---

## 🚀 Live Demo

* Frontend: https://arena-sync-client.vercel.app/
* Backend : https://arenasync-server-1.onrender.com

## Test Login ID
* Email : test123@gmail.com
* Password : test123
---

## 🎥 Demo Video

To use the access and go through the website, use the details I enter in the video.


https://github.com/user-attachments/assets/c04ad519-a65d-4738-9164-198373d24b09




---

## 📌 Problem Statement

Large sporting venues often face:

* Long queues at entry gates
* Congested walkways
* Difficulty locating seats
* Overcrowded food stalls
* Poor restroom visibility
* Delayed alerts & announcements
* Slow exits after events

ArenaSync AI solves these problems using AI + real-time smart assistance.

---

## ✨ Core Features

### ✅ Smart Gate Recommendation

Suggests the least crowded gate based on queue data and walking distance.

### ✅ Live Crowd Heatmap

Visual crowd density map:

* 🟢 Low Crowd
* 🟡 Moderate
* 🔴 High Crowd

### ✅ AI Venue Assistant (Gemini Powered)

Ask questions like:

* Where is the nearest restroom?
* Best food stall near me?
* Fastest exit route?
* How do I reach Block C12?

### ✅ Queue Intelligence

Estimated wait times for:

* Food stalls
* Beverage counters
* Merchandise stores
* Restrooms

### ✅ Smart Seat Navigation

Guides users to their seat block.

### ✅ Real-Time Alerts [ For development purpose, its activated manually ]

Push alerts for:

* Gate closures
* Congestion
* Match reminders
* Safety instructions

### ✅ Admin Dashboard [ In Developement ]

For venue managers:

* Crowd monitoring
* Queue analytics
* Heatmap insights
* Incident reporting

---

## 🧾 Assumptions Made

Since access to real stadium infrastructure data is limited, the following assumptions were used for the MVP:

- Crowd heatmap uses simulated live crowd data
- Queue waiting times are dynamically mocked for demo purposes
- Venue maps are simplified zone-based layouts
- AI recommendations use available database + Gemini responses
- Notifications are manually triggered during testing
- System designed to scale for real integrations later


## 🎯 Approach and Logic

ArenaSync AI was designed using a user-first problem-solving approach for large sporting venues.

The system focuses on common attendee pain points such as long queues, navigation confusion, overcrowding, and limited on-site assistance.

### Core Logic Used:

- Analyze crowd levels across venue zones using simulated operational data
- Recommend least crowded gates and efficient walking routes
- Estimate queue waiting times dynamically for key service areas
- Use AI assistant for natural language venue support
- Provide alerts for congestion and safety guidance
- Improve attendee movement flow across the stadium

The platform combines structured stadium data, MongoDB data storage, and Google Gemini AI responses to deliver practical venue assistance. The system is designed to support live integrations in future deployments.

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### AI & Google Services

* Google Gemini API
* Google OAuth
* Google Maps API

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## 🧠 How It Works

```text
User enters venue
↓
ArenaSync analyzes crowd + queue + location
↓
AI assistant gives best recommendations
↓
User moves faster, waits less, enjoys more
```

---

## 📂 Project Structure

```text
ArenaSync/
├── client/
├── server/
├── README.md
└── .gitignore
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/ArenaSync-AI.git
cd ArenaSync-AI
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Backend Setup

```bash
cd server
npm install
nodemon server.js
```

---

## 🔐 Environment Variables

Create `.env` inside server:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GEMINI_API_KEY=your_api_key
CLIENT_URL=http://localhost:5173
```

---

## 📈 Success Metrics

* Queue reduction %
* Faster entry time
* AI assistant usage
* Navigation success rate
* User satisfaction

---

## 🛣️ Future Roadmap

* AR seat navigation
* Face recognition ticketing
* Multi-language support
* Parking assistant
* Wearable integrations

---

## 👨‍💻 Developed By

**Hemanth Mathivanan**
B.Tech Computer Science and Business Systems

---

## 🏆 Chosen Vertical

**Physical Event Experience**

ArenaSync AI improves the physical event experience for attendees at large-scale sporting venues through AI-powered navigation, crowd intelligence, and queue optimization.

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
