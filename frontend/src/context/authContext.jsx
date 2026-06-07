import { useState, useEffect } from "react";
import api from "../api/axios";
import { AuthContext } from "./authContextValue";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (identifier, password) => {
    const res = await api.post("/auth/login", {
      email: identifier,
      username: identifier,
      password,
    });
    setUser(res.data.user);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
  };

  const signup = async (username, email, password, confirmPassword) => {
    const res = await api.post("/auth/signup", {
      username,
      email,
      password,
      confirmPassword,
    });
    setUser(res.data.user);
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
