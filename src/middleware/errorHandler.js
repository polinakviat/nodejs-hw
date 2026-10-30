import { HttpError } from 'http-errors';
import { isCelebrateError } from 'celebrate';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // 1. Обробка помилок валідації від Celebrate
  if (isCelebrateError(err)) {
    const errorDetails = {};

    // Збираємо деталі по кожній частині запиту (body, query, params)
    for (const [segment, joiError] of err.details.entries()) {
      errorDetails[segment] = joiError.details.map((detail) => detail.message);
    }

    return res.status(400).json({
      status: 400,
      message: 'Validation Error',
      details: errorDetails,
    });
  }

  // 2. Обробка звичайних HttpError
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message || err.name,
    });
  }

  // 3. Усі інші непередбачувані помилки (500)
  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    status: 500,
    message: isProd ? 'Internal Server Error' : err.message,
  });
};
