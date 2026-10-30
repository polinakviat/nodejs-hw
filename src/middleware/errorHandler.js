export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const isProd = process.env.NODE_ENV === "production";
  res.status(500).json({
    message: isProd ? "повідомлення про помилку" : err.message,
  });
};

