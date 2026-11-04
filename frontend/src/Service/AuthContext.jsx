import { useState, useEffect } from "react";
import API from "../api/axios.js";
import { AuthContext } from "./authContext.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Rehydrate user profile if valid token exists in storage
  useEffect(() => {
    const fetchCurrent = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await API.get("/users/current");
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        } catch {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchCurrent();
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/users/login", { email, password });
    localStorage.setItem("token", res.data.accessToken);
    const userRes = await API.get("/users/current");
    setUser(userRes.data);
    localStorage.setItem("user", JSON.stringify(userRes.data));
    return userRes.data;
  };

  const register = async (name, email, password) => {
    // 1. Create account
    await API.post("/users/register", { name, email, password });
    // 2. Automatically log in to get access token and session
    return await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
