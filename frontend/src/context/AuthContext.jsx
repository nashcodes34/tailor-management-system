import { createContext, useContext, useState } from "react";

import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");

      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to parse saved user", error);
      return null;
    }
  });

  const login = async (email, password, role) => {
    const endpoint = role === "admin" ? "/admin/login" : "/tailor/login";

    const response = await API.post(endpoint, {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("token", token);

    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
