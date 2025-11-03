import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "sonner";

// Mock user for testing without backend
const MOCK_USER = {
  id: 1,
  name: "Admin Teste",
  email: "admin@teste.com",
  profile: "admin",
  companyId: 1,
  company: { name: "Empresa Teste", dueDate: "2025-12-31" },
  super: true,
};

const MOCK_TOKEN = "mock-jwt-token-for-testing";

interface User {
  id: number;
  name: string;
  email: string;
  profile: string;
  companyId?: number;
  company?: { name?: string; dueDate?: string } | null;
  super?: boolean;
}

interface AuthContextData {
  user: User | null;
  isAuth: boolean;
  loading: boolean;
  handleLogin: (userData: LoginData) => Promise<void>;
  handleLogout: () => void;
  handleSignup: (userData: SignupData) => Promise<void>;
  handleMockLogin: () => void;
}

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = async (userData: LoginData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", userData);
      
      localStorage.setItem("token", JSON.stringify(data.token));
      localStorage.setItem("user", JSON.stringify(data.user));
      
      api.defaults.headers.Authorization = `Bearer ${data.token}`;
      setUser(data.user);
      
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      const msg = error?.response?.data?.error || "Erro ao fazer login";
      toast.error(msg);
      // Se o backend estiver indisponível, ativar fallback de teste
      if (!error?.response) {
        handleMockLogin();
        return;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    api.defaults.headers.Authorization = undefined;
    navigate("/login");
  };

  const handleSignup = async (userData: SignupData) => {
    setLoading(true);
    try {
      await api.post("/auth/signup", userData);
      toast.success("Cadastro realizado! Faça login para continuar.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Erro ao criar conta");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = () => {
    localStorage.setItem("token", JSON.stringify(MOCK_TOKEN));
    localStorage.setItem("user", JSON.stringify(MOCK_USER));
    api.defaults.headers.Authorization = `Bearer ${MOCK_TOKEN}`;
    setUser(MOCK_USER);
    toast.success("Login de teste ativado!");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuth: !!user,
        loading,
        handleLogin,
        handleLogout,
        handleSignup,
        handleMockLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
