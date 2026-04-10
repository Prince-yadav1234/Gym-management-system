const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User.js");

dotenv.config();

const app = express();

const cleanMongoUri = (uri) => {
  if (!uri) return '';
  const trimmed = uri.trim();
  return trimmed.replace(/^"|"$/g, '');
};

const connectDbUri = async (uri) => {
  const cleanedUri = cleanMongoUri(uri);
  const conn = await mongoose.connect(cleanedUri);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
  return conn;
};

const connectDB = async () => {
  const atlasUri = process.env.MONGO_URI;
  const localUri = 'mongodb://127.0.0.1:27017/gymdb';

  try {
    await connectDbUri(atlasUri);
  } catch (err) {
    console.warn('Atlas connection failed, trying local MongoDB fallback.');
    console.warn(err.message);
    try {
      await connectDbUri(localUri);
    } catch (localErr) {
      console.error('Local MongoDB fallback also failed.');
      console.error(localErr);
      return false;
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin1234';
  const adminExists = await User.findOne({ email: adminEmail });

  if (!adminExists) {
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log(`Default admin created: ${adminEmail}`);
    console.log(`Use password: ${adminPassword}`);
  }

  return true;
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  if (Object.keys(req.body || {}).length) {
    console.log('Request body:', req.body);
  }
  next();
});

const authRoutes = require('./routes/authRoutes.js');
const memberRoutes = require('./routes/memberRoutes.js');
const attendenceRoutes = require('./routes/attendenceRoutes.js');

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/attendance', attendenceRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const connected = await connectDB();
  if (!connected) {
    console.error('MongoDB connection failed. Server not started.');
    return;
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();