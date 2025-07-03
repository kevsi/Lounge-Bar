import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  nom: string;
  prenoms: string;
  email: string;
  role: "owner" | "manager" | "employee";
  telephone?: string;
  age?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isOwner: boolean;
  canAddUsers: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database - in real app this would come from your API
const mockUsers: Array<User & { password: string }> = [
  {
    id: "1",
    nom: "PROPRIETAIRE",
    prenoms: "Admin",
    email: "owner@restaurant.com",
    password: "owner123",
    role: "owner",
    telephone: "0123456789",
    age: 35,
  },
  {
    id: "2",
    nom: "MANAGER",
    prenoms: "Jean",
    email: "manager@restaurant.com",
    password: "manager123",
    role: "manager",
    telephone: "0123456788",
    age: 30,
  },
  {
    id: "3",
    nom: "EMPLOYE",
    prenoms: "Marie",
    email: "employee@restaurant.com",
    password: "employee123",
    role: "employee",
    telephone: "0123456787",
    age: 25,
  },
];

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("authUser");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("authUser");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("authUser", JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authUser");
  };

  const isOwner = user?.role === "owner";
  const canAddUsers = isOwner; // Only owner can add users

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    isOwner,
    canAddUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
