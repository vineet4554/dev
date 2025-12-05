import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import issueRoutes from './routes/issues.js';
import commentRoutes from './routes/comments.js';
import attachmentRoutes from './routes/attachments.js';
import userRoutes from './routes/users.js';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    dbState: mongoose.connection.readyState
  });
});
app.use('/auth', authRoutes);
app.use('/issues', issueRoutes);
app.use('/comments', commentRoutes);
app.use('/attachments', attachmentRoutes);
app.use('/users', userRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal error' });
});

export default app;

