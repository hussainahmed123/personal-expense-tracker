# 💰 Personal Expense Tracker

A simple web-based **Personal Expense Tracker** that helps users manage and monitor their income and expenses in one place.

## 📌 Project Overview

The Personal Expense Tracker is designed to make it easier to record financial transactions and keep track of personal spending.

The project includes a frontend interface and a Node.js/Express backend connected with MongoDB for storing transaction data.

## ✨ Features

* ➕ Add income transactions
* ➖ Add expense transactions
* 📋 View transaction records
* ✏️ Update existing transactions
* 🗑️ Delete transactions
* 🏷️ Categorize transactions
* 📅 Store transaction dates
* 💾 Store transaction data in MongoDB
* 🔗 REST API for transaction management

## 🛠️ Technologies Used

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* CORS
* dotenv

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Postman

## 📂 Project Structure

```text
Personal Expense Tracker
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── html/
│   ├── css/
│   └── js/
│
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| GET    | `/api/transactions`     | Get all transactions       |
| GET    | `/api/transactions/:id` | Get a specific transaction |
| POST   | `/api/transactions`     | Add a transaction          |
| PUT    | `/api/transactions/:id` | Update a transaction       |
| DELETE | `/api/transactions/:id` | Delete a transaction       |

## 🚀 How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/hussainahmed123/personal-expense-tracker.git
```

### 2. Open the project

```bash
cd personal-expense-tracker
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Start the backend

```bash
npm start
```

The application runs locally on:

```text
http://localhost:5000
```

## 🗄️ Database

This project uses **MongoDB** to store transaction information.

The application uses Mongoose to communicate with the MongoDB database.

## 🧪 Testing

The project was also tested using:

* Black-box testing
* Equivalence Partitioning
* Boundary Value Analysis
* Decision Table Testing
* White-box testing
* Statement Coverage
* Branch Coverage
* Postman API testing

## 🎯 Project Purpose

This project was developed as a practical web development and software testing project to understand:

* Full-stack web application development
* REST API development
* Database integration
* CRUD operations
* Git and GitHub workflow
* Software testing techniques

## 👨‍💻 Developer

**Hussain Ahmed**

Computer Science Student

GitHub: `https://github.com/hussainahmed123`

## 📄 License

This project is created for educational and portfolio purposes.

