#  Real-Time Voting System

A full-stack web application for real-time voting, built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. Includes admin panel, role-based access control, JWT authentication, and real-time updates on votes.

##  Tech Stack

- **Frontend:** React, Context API, React Router DOM, Tailwind CSS (optional)
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Real-Time:** Socket.IO
- **Deployment Ready:** Environment-configurable API URLs

---

##  Features

- User registration and login  
- Role-based access (`user`, `admin`)  
- Secure voting (one vote per user)  
- Real-time vote updates  
- Admin panel for managing votes  
- Protected routes and JWT-based authentication  
- Fully responsive UI  

---

##  Folder Structure

```bash
.
├── client/              # React frontend
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── context/     # Auth context
│       └── App.js
├── server/              # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── server.js
└── .env                 # Environment variables
