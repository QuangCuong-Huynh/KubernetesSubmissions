// Standardized API response wrapper
export const sendResponse = (res, data, status = 200) => {
  return res.status(status).json({
    status: status < 300 ? "success" : "error",
    timestamp: new Date().toISOString(),
    data,
  });
};