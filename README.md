# PaniTime

### Live Demo

https://panitime-frontend.onrender.com

**PaniTime** is a web application that helps residents check water supply information for their locality and report water-related problems.

## Problem

Water supply timings can be different for different localities. Many people depend on WhatsApp groups or other informal sources to know when water is expected.

This makes it difficult to find clear and updated information.

## Solution

PaniTime provides one platform where residents can:

* Check water supply timings for their locality
* Search for their locality
* Follow localities they are interested in
* Get notifications when water supply information is updated
* Report water-related problems

City Admins can update water supply information and manage reported issues.

A Platform Admin can add cities and create City Admin accounts.

## Features

* User registration and login
* Role-based access
* City-based admin management
* Water supply status and timing updates
* Locality search
* Locality follow system
* Notifications for water supply updates
* Water-related issue reporting
* Issue management for admins
* Change password
* Deployed frontend and backend

## User Roles

### Resident

Residents can:

* Register and login
* Select their city
* Follow localities
* Search water supply information
* Get notifications about water supply updates
* Report water-related problems
* Change their password

### City Admin

City Admins can:

* Login to the admin dashboard
* Update water supply information
* View reported issues
* Resolve reported issues

A City Admin can only manage information for their assigned city.

### Platform Admin

The Platform Admin can:

* Add new cities
* Create City Admin accounts
* View City Admins
* Deactivate City Admin accounts

## Tech Stack

### Frontend

* React
* Vite
* React Router
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication
* bcryptjs

### Database

* MongoDB
* Mongoose

### Deployment

* GitHub
* Render
* MongoDB Atlas

## How It Works

```text
Resident / Admin
       │
       ▼
   React Frontend
       │
       │ REST API
       ▼
 Node.js + Express
       │
       │ Mongoose
       ▼
    MongoDB
```

The frontend communicates with the backend using REST APIs.

The backend handles authentication, authorization, business logic, and database operations.

## Authentication

PaniTime uses JWT for login and authentication.

After a successful login, the backend creates a JWT token. The frontend stores the token and sends it with requests that need authentication.

The backend checks the token before allowing access to protected routes.

Different roles have different permissions:

* Resident
* City Admin
* Platform Admin

Passwords are hashed using `bcryptjs`.

Sensitive configuration such as the MongoDB connection string and JWT secret is stored in environment variables.

## Deployment

PaniTime is deployed using:

* **Frontend:** Render
* **Backend:** Render
* **Database:** MongoDB Atlas

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/jaishikha/PaniTime.git
cd PaniTime
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

## Project Goal

PaniTime was built to solve a simple local problem: making water supply information easier for residents to find and reducing dependence on scattered WhatsApp messages.

Through this project, I worked with:

* React
* Node.js and Express
* MongoDB
* REST APIs
* JWT authentication
* Role-based access
* Frontend-backend communication
* Deployment
