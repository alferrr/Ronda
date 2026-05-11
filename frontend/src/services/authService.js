import api from "./api";

const AUTH_KEY = "ronda_token";
const USER_KEY = "ronda_user";

const authService = {
  async login(email, password) {
    const data = await api.post("/auth/login", { email, password });
    localStorage.setItem(AUTH_KEY, data.session.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  },

  async register({ email, password, fullName, role, barangay, phone }) {
    return api.post("/auth/register", {
      email,
      password,
      fullName,
      role,
      barangay,
      phone,
    });
  },

  async getMe() {
    return api.get("/auth/me");
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem(AUTH_KEY);
  },
};

export default authService;
