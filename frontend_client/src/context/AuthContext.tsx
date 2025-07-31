"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import jwt_decode, { JwtPayload } from "jwt-decode";

// Token payload type
interface DecodedToken extends JwtPayload {
  email?: string;
  [key: string]: unknown;
}

type AuthContextType = {
  token: string | null;
  user: DecodedToken | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
      setUser(jwt_decode(localToken) as DecodedToken);
    }
  }, []);

  const login = (tok: string) => {
    localStorage.setItem("token", tok);
    setToken(tok);
    setUser(jwt_decode(tok) as DecodedToken);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
