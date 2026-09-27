import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("amara_user");
    const token = localStorage.getItem("amara_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const persistSession = (data) => {
    localStorage.setItem("amara_token", data.access_token);
    localStorage.setItem("amara_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    persistSession(data);
    return data.user;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    persistSession(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("amara_token");
    localStorage.removeItem("amara_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === "admin",
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
