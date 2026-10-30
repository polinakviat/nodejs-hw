import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { errors } from "celebrate";
import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';
import notesRouter from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import studentsRoutes from './routes/studentsRoutes.js';
import cookieParser from "cookie-parser";

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(notesRouter);
app.use(errors());
app.use(notFoundHandler);
app.use(errorHandler);
app.use(authRoutes);
app.use(studentsRoutes);

const startServer = async () => {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error.message);
    process.exit(1);
  }
};

startServer();
