"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, UserRole } from "@/types";
import { getCurrentUserFromLocalStorage, saveCurrentUserToLocalStorage, getUsers } from "@/lib/data";

type AuthContextType = {
  currentUser: User | null;
  login: (username: string, password: string, role: UserRole) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getCurrentUserFromLocalStorage();
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const login = useCallback((username: string, password: string, role: UserRole) => {
    const users = getUsers();
    const user = users.find((u) => u.username === username && u.password === password && u.role === role);
    if (user) {
      setCurrentUser(user);
      saveCurrentUserToLocalStorage(user);
    } else {
      alert("Invalid username, password, or role. Please try again.");
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    saveCurrentUserToLocalStorage(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
