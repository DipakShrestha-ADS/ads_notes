# Smart Restaurant Management System (RMS) - Backend (Golang)

---

## Project Title

> Smart Restaurant Management System (RMS) Backend using Golang (Gin Framework)

---

## Student Information

* **Name:** John Doe  
* **Roll Number:** 2023-CS-045  
* **Course / Program:** BSc Computer Science  
* **Semester / Year:** 3rd Semester / 2026  

---

## Instructor Information

* **Instructor Name:** Mr. Dipak Shrestha  
* **Course Title:** Backend Development with Golang  
* **College Name:** XYZ International College  

---

## Project Overview

> This project is a backend-based Restaurant Management System developed using Golang and the Gin framework.  
It provides RESTful APIs for managing menu items, customer orders, billing, and user roles.  
The system supports role-based access control for Admin, Staff, and Customers.  
It connects with a PostgreSQL database to store and retrieve data efficiently.  
The main goal is to build a scalable and efficient backend system for restaurant operations.

---

## Objectives

* Build RESTful APIs using Golang  
* Implement CRUD operations for restaurant management  
* Understand middleware, routing, and database integration  
* Apply clean architecture and structured code practices  

---

## Technologies Used

### Backend

* Golang  
* Gin Framework  

### Database

* PostgreSQL  

### Other Tools

* GORM (ORM for Golang)  
* Git & GitHub  
* Postman (API Testing)  
* Docker (Optional)  

---

## Key Features

* Menu Management API (Add, Update, Delete, Get Items)  
* Order Management System  
* Billing System with Sequential Bill Number  
* Role-Based Access Control (Admin, Staff, Customer)  
* Authentication & Authorization (JWT-based)  
* Reports & Analytics APIs  

---

## API Modules

* Authentication (Login/Register)  
* Menu Management  
* Order Management  
* Billing System  
* User Management  
* Reports  

---

## Installation & Setup

```bash
# Clone repository
git clone https://github.com/johndoe/rms-backend.git

# Go to project folder
cd rms-backend

# Initialize Go modules
go mod tidy

# Run the application
go run main.go
````

---

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=rms_db
JWT_SECRET=secretkey
```

---

## Project Structure

```
/project-root
│── main.go
│── config/
│── controllers/
│── models/
│── routes/
│── middleware/
│── services/
│── utils/
│── database/
│── go.mod
│── README.md
```

---

## GitHub & API Base URL

* **GitHub Repository:** [https://github.com/johndoe/rms-backend](https://github.com/johndoe/rms-backend)
* **Base URL:** [http://localhost:8080/api](http://localhost:8080/api)

---

## Testing

* Tested APIs using Postman
* Verified CRUD operations
* Tested authentication and authorization
* Handled edge cases (invalid input, unauthorized access)

---

## Challenges Faced

> Example:

* Structuring scalable project architecture in Golang
* Handling middleware for authentication
* Managing database relationships using GORM

---

## Future Enhancements

* Integrate frontend (React / Flutter)
* Add real-time order updates using WebSockets
* Implement caching (Redis)
* Add payment gateway integration (eSewa/Khalti)

---

## Acknowledgement

> I would like to thank my instructor **Mr. Dipak Shrestha** for guidance and support throughout this project.

---

## Declaration

> I hereby declare that this project is my original work and has been completed as part of my academic submission.
