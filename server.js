const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const createError = require('http-errors');
const fileRoutes = require('./routes/fileRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use('/api/files', fileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof createError.HttpError) {
    res.status(err.status).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});