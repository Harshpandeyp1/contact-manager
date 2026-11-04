const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? Number(res.statusCode) : 500;

  switch (statusCode) {
    case Number(constants.validationError):
      return res.status(statusCode).json({
        title: "validation error",
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    case Number(constants.unauthorized):
      return res.status(statusCode).json({
        title: "unauthorized error",
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    case Number(constants.forbidden):
      return res.status(statusCode).json({
        title: "forbidden error",
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    case Number(constants.notFound):
      return res.status(statusCode).json({
        title: "not found error",
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
    default:
      return res.status(statusCode).json({
        title: "server error",
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
      });
  }
};

module.exports = errorHandler;