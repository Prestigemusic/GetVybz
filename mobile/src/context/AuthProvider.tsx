// FILE: src/context/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken, detectBestHost } from "../api/client";

type AuthContextType = {
  user: any | null;
  token: string | null;
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 🔑 Run best host detection on app startup
  useEffect(() => {
    const init = async () => {
      await detectBestHost(); // checks Render + Local, caches best
      const storedToken = await AsyncStorage.getItem("authToken");
      const storedUser = await AsyncStorage.getItem("authUser");

      if (storedToken) {
        setToken(storedToken);
        setAuthToken(storedToken);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    init();
  }, []);

  const login = async (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    setAuthToken(newToken);

    await AsyncStorage.setItem("authToken", newToken);
    await AsyncStorage.setItem("authUser", JSON.stringify(newUser));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);

    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
