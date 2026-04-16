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
  };

  const signup = async (username, email, password, confirmPassword) => {
    const res = await api.post("/auth/signup", {
      username,
      email,
      password,
      confirmPassword,
    });
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
