# Finance Flow - Frontend

A modern user interface for Personal Finance Tracker application. Built with **React.js** using **Tailwind CSS** and **Recharts** for financial data visualization.

# **🖥️ Dashboard Preview**
<img width="1895" height="898" alt="image" src="https://github.com/user-attachments/assets/3267fa8a-d292-4ea1-8932-ea3e50b5facb" />

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running The Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Backend API](#backend-api)
- [Code Conventions](#code-conventions)
- [License](#license)
- [Author](#author)

## 🎯 About The Project

The Finance Flow frontend is a responsive web application that enables users to manage their personal finances. The application offers an intuitive interface for tracking expenses and income, creating budgets, and visualizing financial data.

**Project Status:** 🚧 In Development

**Live Demo:** [financeflowm.vercel.app](https://financeflowm.vercel.app)

## ✨ Features

- 🔐 **User Authentication** - Registration, login, session management (JWT)
- 💰 **Transaction Management** - Add, edit, delete income and expenses
- 📊 **Dashboard with Charts** - Data visualization using Recharts (pie charts, line charts, bar charts)
- 💳 **Monthly Budgets** - Create and monitor budgets with alerts
- 🎯 **Savings Goals** - Track progress toward financial goals
- 📱 **Responsive Design** - Full support for mobile and tablet devices
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 🔍 **Filters & Search** - Advanced transaction filtering
- 📈 **Analytics** - Detailed reports and spending trends
- 👤 **Profile Management** - Password change and profile picture settings

## 🛠 Tech Stack

This project was built using the following technologies:

- **React.js** 18+ - UI Library
- **TypeScript** 98.4% - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router** v6 - Routing
- **Tailwind CSS** - Styling and responsive design
- **Recharts** - Charts and visualizations
- **React Hook Form** - Form management
- **date-fns** - Date manipulation
- **React Icons** - Icon library

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16.x or higher)
- **npm** (version 8.x or higher) or **yarn**
- **Git**

Optional:

- **VS Code** with extensions: ESLint, Prettier, Tailwind CSS IntelliSense

## 🚀 Installation

### 1. Clone the repository

git clone https://github.com/Macijke/FINANCE-FLOW-FRONTEND.git
cd FINANCE-FLOW-FRONTEND

### 2. Install dependencies

`npm install`

or

`yarn install`

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
#API URL (backend)
VITE_API_URL=http://localhost:8080/api/v1

#Environment
VITE_ENV=development

#Optional: Analytics, etc.
VITE_ANALYTICS_ID=your-analytics-id
```

## 🏃 Running The Application

### Development mode

`npm run dev`

or

`yarn dev`

The application will be available at: [**http://localhost:5173**](http://localhost:5173)

### Production build

`npm run build`

or

`yarn build`

Built files will be located in the `dist/` directory.

### Preview build

`npm run preview`

or

`yarn preview`

## 📁 Project Structure
```
frontend/
├── public/ # Static files
│ └── favicon.ico
├── src/
│ ├── assets/ # Images, fonts, etc.
│ ├── components/ # React components
│ │ ├── common/ # Reusable components (Button, Modal, Input)
│ │ ├── layout/ # Layout components (Header, Sidebar, Footer)
│ │ ├── dashboard/ # Dashboard components
│ │ ├── transactions/ # Transaction components
│ │ ├── budgets/ # Budget components
│ │ └── analytics/ # Analytics components
│ ├── pages/ # Application pages
│ │ ├── Dashboard.jsx
│ │ ├── Transactions.jsx
│ │ ├── Budgets.jsx
│ │ ├── Analytics.jsx
│ │ ├── SavingsGoals.jsx
│ │ ├── Settings.jsx
│ │ └── Auth/
│ │ ├── Login.jsx
│ │ └── Register.jsx
│ ├── hooks/ # Custom React hooks
│ ├── context/ # Context API (AuthContext, ThemeContext)
│ ├── store/ # Redux store and slices
│ ├── services/ # API services (axios instances)
│ ├── utils/ # Utility functions
│ ├── styles/ # Global styles (Tailwind config)
│ ├── App.jsx # Main App component
│ ├── main.jsx # Entry point
│ └── routes.jsx # Route definitions
├── .env.example # Example environment configuration
├── .gitignore
├── package.json
├── tailwind.config.js # Tailwind CSS configuration
├── vite.config.js # Vite configuration
└── README.md
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code (Prettier) |

## 🔗 Backend API

This frontend requires a running backend API. The backend can be found here:

- **Repository:** [FINANCE-FLOW-BACKEND](https://github.com/Macijke/FINANCE-FLOW-BACKEND)
- **API Documentation:** Swagger UI (available locally)

## 📝 Code Conventions

- Use **ESLint** and **Prettier** for formatting
- Component naming: **PascalCase** (e.g., `TransactionList.jsx`)
- Utility file naming: **camelCase** (e.g., `formatCurrency.js`)
- CSS classes: **Tailwind utility classes**
- Commits: use **Conventional Commits** (e.g., `feat:`, `fix:`, `docs:`)

## 🚀 Deployment

The application is deployed on **Vercel** and is accessible at:
[financeflowm.vercel.app](https://financeflowm.vercel.app)

## 📄 License

This project is available under the **MIT License**. See the LICENSE file for details.

## 👨‍💻 Author

**Macijke**

- GitHub: [@Macijke](https://github.com/Macijke)
- Email: macijke@gmail.com

## 🙏 Acknowledgments

- React Icons
- Recharts
- Tailwind CSS
- Vercel for free hosting

---

⭐ If you find this project useful, please consider giving it a star!
