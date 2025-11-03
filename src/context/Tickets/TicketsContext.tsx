import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext";

export interface Ticket {
  id: number;
  status: string;
  lastMessage?: string;
  updatedAt: string;
  unreadMessages?: number;
  contactId: number;
  userId: number;
  queueId: number;
  contact: {
    id: number;
    name: string;
    number: string;
    profilePicUrl?: string;
  };
  user?: {
    id: number;
    name: string;
  };
  queue?: {
    id: number;
    name: string;
    color: string;
  };
}

interface TicketsContextData {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  currentTicket: Ticket | null;
  setCurrentTicket: React.Dispatch<React.SetStateAction<Ticket | null>>;
}

export const TicketsContext = createContext<TicketsContextData>({} as TicketsContextData);

export const TicketsContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setTickets([]);
      setCurrentTicket(null);
    }
  }, [user]);

  return (
    <TicketsContext.Provider
      value={{
        tickets,
        setTickets,
        currentTicket,
        setCurrentTicket,
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketsContext);
  if (!context) {
    throw new Error("useTickets must be used within TicketsContextProvider");
  }
  return context;
};

export default TicketsContext;
