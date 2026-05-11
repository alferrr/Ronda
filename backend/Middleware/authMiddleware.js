const supabase = require("../db/supabaseClient");
const UserModel = require("../models/userModel");

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid authorization header." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) throw error || new Error("Invalid token.");

    const profile = await UserModel.findById(data.user.id);
    req.user = { ...data.user, ...profile };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized." });
  }
};

const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: insufficient permissions." });
    }
    next();
  };

module.exports = { authenticate, requireRole };
