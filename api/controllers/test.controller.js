import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = (req, res) => {
  res.status(200).json({ success: true, message: "You are authenticated." });
};

export const shouldBeAdmin = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ success: false, message: "Not authenticated." });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
    if (err) return res.status(403).json({ success: false, message: "Token is not valid." });
    if (!payload.isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }
    next();
  });
};
