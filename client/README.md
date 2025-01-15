# Create project directories
mkdir finance-management-system
cd finance-management-system

# Create frontend and backend directories
mkdir client server

# Initialize frontend
cd client
npx create-react-app .
npm install @tailwindcss/postcss7-compat @tailwindcss/forms axios chart.js react-chartjs-2 @heroicons/react @headlessui/react

# Initialize backend
cd ../server
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors helmet morgan
