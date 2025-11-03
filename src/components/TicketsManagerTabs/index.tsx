import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { SocketContext } from "../../context/Socket/SocketContext";
import { useTickets } from "../../context/Tickets/TicketsContext";
import api from "../../services/api";
import { TicketListItem } from "../TicketListItem";
import { i18n } from "../../translate/i18n";

interface Ticket {
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

const TicketsManagerTabs: React.FC = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const { tickets, setTickets } = useTickets();
  const socket = useContext(SocketContext);
  const [activeTab, setActiveTab] = useState("open");
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/tickets", {
          params: {
            status: activeTab,
            searchParam: searchParam || undefined,
            showAll: true,
          },
        });
        setTickets(data.tickets || []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [activeTab, searchParam, setTickets]);

  useEffect(() => {
    const handleTicketUpdate = (data: any) => {
      if (data.action === "update" || data.action === "create") {
        setTickets((prev) => {
          const exists = prev.find((t) => t.id === data.ticket.id);
          if (exists) {
            return prev.map((t) => (t.id === data.ticket.id ? data.ticket : t));
          }
          return [data.ticket, ...prev];
        });
      }
      if (data.action === "delete") {
        setTickets((prev) => prev.filter((t) => t.id !== data.ticketId));
      }
    };

    socket.on("ticket", handleTicketUpdate);

    return () => {
      socket.off("ticket", handleTicketUpdate);
    };
  }, [socket, setTickets]);

  const filteredTickets = tickets.filter((ticket) => ticket.status === activeTab);

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={i18n.t("tickets.search") || "Buscar tickets..."}
            value={searchParam}
            onChange={(e) => setSearchParam(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b border-border bg-transparent h-auto p-0">
          <TabsTrigger
            value="open"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            {i18n.t("tickets.tabs.open") || "Abertos"}
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            {i18n.t("tickets.tabs.pending") || "Aguardando"}
          </TabsTrigger>
          <TabsTrigger
            value="closed"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            {i18n.t("tickets.tabs.closed") || "Finalizados"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="flex-1 m-0 p-0">
          <ScrollArea className="h-full">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                {i18n.t("tickets.noTickets") || "Nenhum ticket encontrado"}
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <TicketListItem
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  isActive={ticketId === String(ticket.id)}
                />
              ))
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TicketsManagerTabs;
