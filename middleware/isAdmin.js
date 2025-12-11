// export default function isAdmin(req, res, next) {
//   try {
//     // You must have attached user details earlier in JWT middleware
//     const user = req.user;

//     if (!user || !user.name.endsWith("@admin")) {
//       return res.status(403).json({ message: "Access denied: Admin only" });
//     }

//     next();
//   } catch (err) {
//     res.status(500).json({ message: "Internal error" });
//   }
// }

export default function isAdmin(req, res, next) {
  try {
    // Check session user
    const user = req.session?.user;
    
    if (!user) {
      return res.status(403).json({ message: "Not authenticated" });
    }

    // Allow if admin by email/username
    if (user.name && user.name.endsWith("@admin")) {
      return next();
    }

    // Allow if admin role exists
    if (user.role === "admin") {
      return next();
    }

    return res.status(403).json({ message: "Access denied: Admin only" });

  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
