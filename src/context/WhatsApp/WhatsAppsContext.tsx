import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext";

interface WhatsApp {
  id: number;
  name: string;
  status: string;
  qrcode?: string;
  number?: string;
  updatedAt: string;
  isDefault?: boolean;
}

interface WhatsAppsContextData {
  whatsApps: WhatsApp[];
  setWhatsApps: React.Dispatch<React.SetStateAction<WhatsApp[]>>;
  loading: boolean;
}

const WhatsAppsContext = createContext<WhatsAppsContextData>({} as WhatsAppsContextData);

export const WhatsAppsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [whatsApps, setWhatsApps] = useState<WhatsApp[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setWhatsApps([]);
    }
  }, [user]);

  return (
    <WhatsAppsContext.Provider
      value={{
        whatsApps,
        setWhatsApps,
        loading,
      }}
    >
      {children}
    </WhatsAppsContext.Provider>
  );
};

export const useWhatsApps = () => {
  const context = useContext(WhatsAppsContext);
  if (!context) {
    throw new Error("useWhatsApps must be used within WhatsAppsProvider");
  }
  return context;
};

export default WhatsAppsContext;
