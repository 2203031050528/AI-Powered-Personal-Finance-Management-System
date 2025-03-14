const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();
const salesRoutes = require('./routes/sales');
const errorHandler = require('./middleware/error');
const http = require('http');
const socketIo = require('socket.io');
const savingsRoutes = require('./routes/savings');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Connect Database
connectDB();

// Init Middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/sales', salesRoutes);
app.use('/api/savings', savingsRoutes);

// Error handling
app.use(errorHandler);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Export io instance for use in routes
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 