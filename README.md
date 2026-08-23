# Car Dealership Inventory System

A full-stack Car Dealership Inventory System built using React, TypeScript, Node.js, Express.js, and MySQL.

The application allows users to register, log in securely using JWT authentication, and manage car inventory through CRUD operations.

---

## Features

### User Authentication

- User registration
- User login
- Password hashing using bcryptjs
- JWT-based authentication
- Protected API endpoints
- Logout functionality
- Login session persistence using localStorage

### Car Management

- Add new cars
- View all cars
- View a car by ID
- Update car details
- Delete cars
- Search cars by brand or model
- Input validation for car details

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Axios

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- MySQL

### Authentication

- JSON Web Token (JWT)
- bcryptjs

### Tools

- Postman
- Git
- GitHub
- Visual Studio Code

---

## Project Structure

```text
car-dealership-inventory-system/
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── authMiddleware.ts
│   │   ├── db.ts
│   │   └── index.ts
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# How to Run the Project

## Prerequisites

Make sure the following are installed on your system:

- Node.js
- MySQL
- npm
- Git

---

## 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/Rohitha234/car-dealership-inventory-system.git
```

Move into the project folder:

```bash
cd car-dealership-inventory-system
```

---

## 2. Set Up the Database

Open MySQL and run the following commands:

```sql
CREATE DATABASE car_dealership;

USE car_dealership;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL
);
```

---

## 3. Configure Environment Variables

Inside the `backend` folder, create a file named `.env`.

Add the following values:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=car_dealership
DB_PORT=3306
JWT_SECRET=your_secret_key
```

Replace:

- `your_mysql_password` with your own MySQL password.
- `your_secret_key` with any secure secret value of your choice.

Do not upload your actual `.env` file or real passwords/secrets to GitHub.

---

## 4. Run the Backend

From the project root, open a terminal and run:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

Start the backend server:

```bash
npm.cmd run dev
```

The backend server will run at:

```text
http://localhost:3000
```

---

## 5. Run the Frontend

Open a new terminal.

From the project root, run:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the frontend application:

```bash
npm.cmd run dev
```

Open the URL displayed in the terminal. It is usually:

```text
http://localhost:5173
```

---

## 6. Use the Application

1. Open the frontend application in your browser.
2. Click **Register** and create a new account.
3. Log in using your registered email and password.
4. Add cars to the inventory.
5. View all cars.
6. Search cars by brand or model.
7. Edit car details.
8. Delete a car.
9. Click **Logout** when finished.

---

# API Endpoints

## Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and receive a JWT token |

## Car APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/cars` | Get all cars |
| GET | `/cars/:id` | Get a car by ID |
| POST | `/cars` | Add a new car |
| PUT | `/cars/:id` | Update a car |
| DELETE | `/cars/:id` | Delete a car |

---

# Authentication

After successful login, the backend generates a JWT token.

The token is stored in the browser using localStorage.

For protected API requests, the token is sent using the following header:

```text
Authorization: Bearer <your_jwt_token>
```

The authentication middleware verifies the JWT token before allowing access to protected resources.

---

# Testing

The backend APIs were tested using Postman.

The following functionality was tested:

- User registration
- User login
- JWT token generation
- JWT authentication
- Adding cars
- Fetching all cars
- Fetching a car by ID
- Updating car details
- Deleting cars
- Input validation and error handling

---

# Security

The application implements the following security practices:

- Passwords are hashed using bcryptjs before being stored in the database.
- JWT is used for user authentication.
- Protected routes use authentication middleware.
- Database credentials and JWT secrets are stored using environment variables.
- Sensitive environment files are excluded using `.gitignore`.

---

# My AI Usage

## AI Tools Used

- ChatGPT

## How I Used AI

I used ChatGPT as an AI assistant during the development of this project.

ChatGPT was used for:

- Understanding the overall project structure and architecture
- Understanding frontend and backend integration
- Generating and improving boilerplate code
- Implementing React and TypeScript components
- Developing Express.js API routes
- Implementing CRUD operations for car management
- Implementing user registration and login functionality
- Understanding and implementing password hashing using bcryptjs
- Understanding and implementing JWT-based authentication
- Implementing authentication middleware
- Debugging frontend and backend issues
- Troubleshooting server, port, and environment variable issues
- Understanding MySQL database integration
- Testing and debugging REST API endpoints using Postman
- Improving input validation and error handling

## Reflection

Using AI helped me speed up my development workflow and better understand concepts while building this full-stack application. It was particularly useful for understanding how the frontend, backend, database, and authentication system work together.

I used AI as a development assistant for guidance, explanations, debugging, and code suggestions. I reviewed the code, tested the application and API functionality, and made changes based on the project requirements and issues encountered during development.

Overall, AI helped me learn more efficiently and improve my problem-solving and debugging workflow while developing the project.

---

# Author

**Rohitha**

GitHub: https://github.com/Rohitha234

---

# License

This project was created for educational and learning purposes.
