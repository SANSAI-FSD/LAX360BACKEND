// middleware/authMiddleware.js

export function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated" });
}

export function isAdmin(req, res, next) {
  if (req.session?.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin only" });
}
