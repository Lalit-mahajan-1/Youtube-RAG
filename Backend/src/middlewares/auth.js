import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = {
      id: decoded.id
    };

    next();
  });
};

export default requireAuth;
