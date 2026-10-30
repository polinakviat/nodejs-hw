import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  }

  const isProd = process.env.NODE_ENV === "production";
  res.status(500).json({
    message: isProd ? "Internal Server Error" : err.message,
  });
};

