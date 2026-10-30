import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';
import notesRouter from './routes/notesRoutes.js';

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);


app.use(notesRouter);

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

// Обробники не знайдених маршрутів та помилок (мають бути в самому кінці після всіх роутів)
app.use(notFoundHandler);
app.use(errorHandler);

startServer();
