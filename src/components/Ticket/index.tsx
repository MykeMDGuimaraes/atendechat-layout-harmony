import React, { useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TicketHeader } from "../TicketHeader";
import { TicketMessagesArea } from "../TicketMessagesArea";
import { MessageInput } from "../MessageInput";
import { useMessages } from "../../hooks/useMessages";
import { useTickets } from "../../context/Tickets/TicketsContext";
import api from "../../services/api";

const Ticket: React.FC = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { currentTicket, setCurrentTicket, tickets } = useTickets();
  const ticketIdNumber = ticketId ? parseInt(ticketId) : null;

  const { messages, loading, hasMore, loadMore, sendMessage, sendMedia } =
    useMessages(ticketIdNumber);

  useEffect(() => {
    if (!ticketIdNumber) return;

    const ticket = tickets.find((t) => t.id === ticketIdNumber);
    if (ticket) {
      setCurrentTicket(ticket);
    } else {
      // Fetch ticket details if not in context
      const fetchTicket = async () => {
        try {
          const { data } = await api.get(`/tickets/${ticketIdNumber}`);
          setCurrentTicket(data);
        } catch (error) {
          console.error("Error fetching ticket:", error);
          toast.error("Ticket não encontrado");
          navigate("/tickets");
        }
      };
      fetchTicket();
    }
  }, [ticketIdNumber, tickets, setCurrentTicket, navigate]);

  const handleAccept = async () => {
    if (!currentTicket) return;

    try {
      await api.put(`/tickets/${currentTicket.id}`, { status: "open" });
      toast.success("Ticket aceito com sucesso!");
    } catch (error) {
      toast.error("Erro ao aceitar ticket");
    }
  };

  const handleResolve = async () => {
    if (!currentTicket) return;

    try {
      await api.put(`/tickets/${currentTicket.id}`, { status: "closed" });
      toast.success("Ticket finalizado com sucesso!");
      navigate("/tickets");
    } catch (error) {
      toast.error("Erro ao finalizar ticket");
    }
  };

  const handleTransfer = async () => {
    // TODO: Implement transfer dialog
    toast.info("Funcionalidade de transferência em desenvolvimento");
  };

  if (!currentTicket) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <TicketHeader
        contact={currentTicket.contact}
        queue={currentTicket.queue}
        user={currentTicket.user}
        status={currentTicket.status}
        onAccept={currentTicket.status === "pending" ? handleAccept : undefined}
        onTransfer={handleTransfer}
        onResolve={handleResolve}
        onBack={() => navigate("/tickets")}
        showBackButton={true}
      />

      <TicketMessagesArea
        messages={messages}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />

      <MessageInput
        onSendMessage={sendMessage}
        onSendMedia={sendMedia}
        disabled={currentTicket.status === "closed"}
      />
    </div>
  );
};

export default Ticket;
