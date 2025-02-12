# Finance Management System

![Finance Management System](https://yourimageurl.com/banner.png)

## 📌 Overview
The **Finance Management System** is a modern web application designed to help users efficiently manage their expenses, track budgets, monitor bills, and analyze financial data through interactive reports. Built using the **MERN stack**, it ensures a seamless and scalable financial tracking experience with robust authentication and security measures.

## 🚀 Features
### 🔑 Authentication System
- User registration & login
- JWT-based authentication
- Protected routes
- Admin privileges

### 💰 Expense Management
- Add, edit, delete expenses
- Categorize expenses
- Multiple currency support
- View historical expense data

### 📊 Budget Planning
- Monthly budget setting
- Category-wise budgeting
- Track budget vs. actual spending
- Overspending alerts

### 🏦 Bill Management
- Track bills
- Recurring bills support
- Due date reminders
- Payment status tracking

### 📈 Reporting & Analytics
- Expense analytics
- Budget performance reports
- Income vs. Expenses visualization
- Category-wise spending analysis

### 🔔 Notification System
- Bill due reminders
- Budget alerts
- Real-time updates

### 🛠 Admin Dashboard
- User management
- System statistics
- Activity monitoring
- Administrative controls

## 🏗 Technology Stack
### **Frontend** (Client)
- **Core Framework:** React.js
- **State Management:** React Hooks
- **Routing:** React Router v6
- **Styling:** Tailwind CSS, PostCSS
- **HTTP Client:** Axios
- **Charts:** Chart.js with React-Chartjs-2
- **Authentication:** JWT (JSON Web Tokens)
- **Icons:** Heroicons

### **Backend** (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken), bcryptjs for password hashing
- **Validation:** express-validator
- **Configuration:** dotenv
- **CORS Handling:** cors middleware

## 📂 Project Structure
```bash
finance-management-system/
├── client/            # Frontend Code
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── bills/
│   │   │   ├── budget/
│   │   │   ├── dashboard/
│   │   │   ├── expenses/
│   │   │   ├── layout/
│   │   │   ├── notifications/
│   │   │   ├── reports/
│   │   │   ├── routing/
│   │   │   └── visualizations/
│   ├── App.js
│   └── index.js
├── server/            # Backend Code
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── admin.js
│   │   └── auth.js
│   ├── models/
│   │   ├── Bill.js
│   │   ├── Budget.js
│   │   ├── Expense.js
│   │   ├── Income.js
│   │   ├── Notification.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── bills.js
│   │   ├── budget.js
│   │   ├── expenses.js
│   │   ├── income.js
│   │   ├── notifications.js
│   │   └── users.js
│   └── index.js
```

## ⚡ API Endpoints
### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/users` - User registration
- `GET /api/auth` - Get authenticated user

### **Expenses**
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### **Budget**
- `GET /api/budget` - Get user budgets
- `POST /api/budget` - Create budget
- `PUT /api/budget/:id` - Update budget

### **Bills**
- `GET /api/bills` - Get all bills
- `POST /api/bills` - Add new bill
- `PUT /api/bills/:id` - Update bill
- `GET /api/bills/reminders` - Get bill reminders

### **Admin**
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get system statistics
- `PUT /api/admin/users/:id` - Update user status

## 🔒 Security Measures
- **Authentication:** JWT-based authentication, password hashing with bcrypt
- **Authorization:** Admin middleware, user-specific data access control
- **Validation:** Input validation, request sanitization
- **Error Handling:** Centralized error handling

## 🏁 Getting Started
### 1️⃣ Clone the Repository
```sh
git clone https://github.com/yourusername/finance-management-system.git
cd finance-management-system
```

### 2️⃣ Install Dependencies
#### Frontend
```sh
cd client
npm install
```
#### Backend
```sh
cd server
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the `server/` directory and add:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

### 4️⃣ Run the Application
#### Start Backend Server
```sh
cd server
npm start
```
#### Start Frontend
```sh
cd client
npm start
```

## 🤝 Contributing
Contributions are welcome! Follow these steps:
1. Fork the repository
2. Create a new branch (`feature-branch`)
3. Commit your changes
4. Push to your fork and submit a PR

## 📜 License
This project is licensed under the **MIT License**.

## 📬 Contact
- **Author:** Rahul jangir
- **Email:** rahuljangir4368@gmail.com
- **GitHub:** (https://github.com/2203031050528)


---
🔥 **Manage your finances like a pro with the Finance Management System!** 🚀

