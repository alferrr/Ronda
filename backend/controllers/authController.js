const supabase = require("../db/supabaseClient");
const UserModel = require("../models/userModel");

const AuthController = {
  async register(req, res) {
    const { email, password, fullName, role, barangay, phone } = req.body;

    if (!email || !password || !fullName || !role) {
      return res
        .status(400)
        .json({ error: "email, password, fullName, and role are required." });
    }

    if (!["resident", "official"].includes(role)) {
      return res
        .status(400)
        .json({ error: "role must be 'resident' or 'official'." });
    }

    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData?.user?.id)
        throw new Error("User creation failed, no ID returned.");

      console.log("Auth user created:", authData.user.id);

      // Step 2: Insert profile directly (avoid .single() issue)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          full_name: fullName,
          role,
          barangay: barangay || null,
          phone: phone || null,
        })
        .select();

      if (profileError) throw profileError;

      const profile = profileData[0];
      console.log("Profile created:", profile);

      return res
        .status(201)
        .json({ message: "User registered successfully.", user: profile });
    } catch (err) {
      console.error("Register error:", err);
      return res
        .status(500)
        .json({ error: err.message || "Registration failed." });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "email and password are required." });
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const profile = await UserModel.findById(data.user.id);

      return res.status(200).json({
        message: "Login successful.",
        session: data.session,
        user: profile,
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(401).json({ error: err.message || "Login failed." });
    }
  },

  async getMe(req, res) {
    try {
      const profile = await UserModel.findById(req.user.id);
      return res.status(200).json({ user: profile });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};

module.exports = AuthController;
