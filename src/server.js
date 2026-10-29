import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { logger } from './middleware/logger.js';
import { notesRouter } from './routes/notesRoutes.js';



const PORT = process.env.PORT ?? 3030;
const app = express();

app.use('/notes', notesRouter);
app.use(cors());
app.use(express.json());
app.use(logger);
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

const startServer = async () => {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port $(PORT)`);
    });
  }
  catch (error) {
    console.error('Failed to start the server:', error.message);
    process.exit(1);
  }
};


app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello world!' });
});
app.get('/notes', (req, res) => {
  res.status(200).json({
    "message": "Retrieved all notes"
  });
});
app.get('/notes/:noteId', (req, res) => {
  const noteID = req.params.noteId;
  res.status(200).json({
    "message": `Retrieved note with ID: ${noteID}`
  });
});

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});


app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    "message": "Route not found"
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

// запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

startServer();
