B
---

```
# Chat App

A fully functional **Chat Application** built with **React.js** for frontend and **Express.js + SQLite3** for backend. This project allows users to send and receive messages in real-time, with a simple and lightweight interface.

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Project Structure](#project-structure)  
4. [Installation & Setup](#installation--setup)  
   - [Backend](#backend)  
   - [Frontend](#frontend)  
5. [Deployment](#deployment)  
6. [Database](#database)  
7. [Usage](#usage)  
8. [Author](#author)  

---

## Features

- Real-time messaging (basic)  
- User authentication (optional)  
- Lightweight and responsive UI  
- SQLite3 database for storing messages  
- Simple and easy to deploy  

---

## Tech Stack

| Layer       | Technology           |
|------------|---------------------|
| Frontend   | React.js, HTML, CSS, JavaScript |
| Backend    | Node.js, Express.js |
| Database   | SQLite3             |
| Deployment | Railway / Render / Replit / Glitch |

---

## Project Structure

```

chat-app/
│
├── backend/          # Express.js backend
│   ├── index.js      # Main server file
│   ├── database.sqlite  # SQLite3 database
│   ├── routes/       # API routes
│   ├── package.json  # Backend dependencies
│
├── frontend/         # React frontend
│   ├── public/       # Public assets
│   ├── src/          # React source files
│   ├── package.json  # Frontend dependencies
│
└── README.md         # Project documentation

````

---

## Installation & Setup

### Backend

1. Navigate to backend folder:
```bash
cd backend
````

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
node index.js
```

* Server will run on `http://localhost:5000` by default

> Ensure `database.sqlite` is present in the backend folder.

---

### Frontend

1. Navigate to frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the React app:

```bash
npm start
```

* Frontend will run on `http://localhost:3000`
* Update API URLs in frontend to point to your backend, for example:

```javascript
fetch("http://localhost:5000/api/messages")
```

---

## Deployment

### Backend Deployment

* Platforms: **Railway, Render, Replit, Glitch**
* Build Command:

```bash
npm install
```

* Start Command:

```bash
node index.js
```

* Ensure your SQLite3 database file (`database.sqlite`) is included in the deployment

### Frontend Deployment

* Platforms: **Vercel, Netlify, Firebase Hosting**
* Build Command:

```bash
npm run build
```

* Output Directory:

```
build
```

* Update frontend API calls to point to deployed backend URL:

```javascript
fetch("https://your-backend-url.com/api/messages")
```

---

## Database

* **SQLite3** is a file-based database stored as `database.sqlite` in backend folder
* Best for development and testing
* For production, consider using **PostgreSQL** or **MySQL**

---

## Usage

1. Open the frontend URL in browser
2. Users can register/login (if implemented)
3. Start sending messages in chat interface
4. Messages are stored in the backend SQLite3 database


## Notes

* Make sure **backend is running** before starting frontend locally
* For deployment, **update all API URLs** in frontend to point to live backend
* SQLite3 file must be included in backend for proper functionality

---
