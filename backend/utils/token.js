import jwt from "jsonwebtoken";

export const generateAccessToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (id, rememberMe = true) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: rememberMe ? "7d" : "1d",
  });
};
