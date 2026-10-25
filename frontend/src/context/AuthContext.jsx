import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("amara_token");

    const clearSession = () => {
      localStorage.removeItem("amara_token");
      localStorage.removeItem("amara_user");
      setUser(null);
    };
    const handleUnauthorized = () => clearSession();
    window.addEventListener("amara:unauthorized", handleUnauthorized);

    if (!token) {
      setLoading(false);
      return () => window.removeEventListener("amara:unauthorized", handleUnauthorized);
    }

    let active = true;
    authApi.fetchMe()
      .then((currentUser) => {
        if (active) {
          localStorage.setItem("amara_user", JSON.stringify(currentUser));
          setUser(currentUser);
        }
      })
      .catch(() => {
        if (active) clearSession();
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      window.removeEventListener("amara:unauthorized", handleUnauthorized);
    };
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
