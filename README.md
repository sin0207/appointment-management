# Appointment Management System

## Overview

The Appointment Management System allows users to schedule, update, and manage appointments. It features user authentication, a responsive frontend, and an user can update the details.

## Features

- User authentication with JWT
- Full CRUD functionality for appointments
- Admin panel for managing users
- Responsive UI

## Installation

### Prerequisites

- Node.js
- MongoDB

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/sin0207/appointment-management.git
   ```

2. Install Backend & Frontend Dependencies:
    ```bash
    npm run install-all
    ```

3. Create a .env file in the backend and set your MongoDB URI and JWT secret.

4. Update the backend url in the frontend axiosConfig file if you change the port or network setting.

5. Run the application:
    ```bash
    npm run start
    ```
## CI/CD Pipeline

-	Checkout code: checkout the latest code from github by using version 3 of actions/checkout container
-	Setup Node.js: setup the environment in node@22
-	Stop the running pm2 processes on the AWS EC2
-	Install Backend Dependencies: using npm to install all dependencies
-	Install Frontend Dependencies: using npm to install all dependencies
-	Run Backend Tests: run tests on the backend side
-	Copy all env variables to the .env for backend server
-	Restart all pm2 services for deployed version
