import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_change_me"

export const protect = (req, res, next) => {
  let token = req.headers.authorization

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1]

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = decoded
      next()
    } catch (err) {
      console.error("Token verification failed:", err)
      return res.status(401).json({ message: "Not authorized, token failed" })
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" })
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
    next()
  } else {
    return res.status(403).json({ message: "Not authorized as admin" })
  }
}

export const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    next()
  } else {
    return res.status(403).json({ message: "Not authorized as super admin" })
  }
}
