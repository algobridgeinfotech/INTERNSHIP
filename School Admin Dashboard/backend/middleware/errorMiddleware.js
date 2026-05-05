export const notFound = (req, _res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  if (err.name === "SyntaxError" && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON request body" });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({ message: `${field} already exists` });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(err.errors).map((item) => item.message).join(", ") });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Server error",
    errors: err.errors || undefined
  });
};
