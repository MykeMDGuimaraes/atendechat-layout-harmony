import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users } from "lucide-react";
import TicketsManagerTabs from "../../components/TicketsManagerTabs";
import Ticket from "../../components/Ticket";
import TicketAdvancedLayout from "../../components/TicketAdvancedLayout";
import logo from "../../assets/logo.png";
import { useTickets } from "../../context/Tickets/TicketsContext";
import { i18n } from "../../translate/i18n";

const TicketAdvanced: React.FC = () => {
  const { ticketId } = useParams();
  const [activeTab, setActiveTab] = useState("ticket");
  const { currentTicket, setCurrentTicket } = useTickets();

  useEffect(() => {
    if (!ticketId) {
      setActiveTab("attendance");
    }
    return () => {
      setCurrentTicket(null);
    };
  }, [ticketId, setCurrentTicket]);

  useEffect(() => {
    if (currentTicket?.id) {
      setActiveTab("ticket");
    }
  }, [currentTicket]);

  const renderPlaceholder = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-card">
        <img src={logo} alt="Logo" className="w-64 mb-8 opacity-50" />
        <Button onClick={() => setActiveTab("attendance")} variant="default">
          {i18n.t("ticketAdvanced.selectTicket") || "Selecionar Ticket"}
        </Button>
      </div>
    );
  };

  const renderMessageContext = () => {
    if (ticketId) {
      return <Ticket />;
    }
    return renderPlaceholder();
  };

  const renderTicketsManagerTabs = () => {
    return <TicketsManagerTabs />;
  };

  return (
    <TicketAdvancedLayout>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b border-border bg-transparent h-auto p-0">
          <TabsTrigger
            value="ticket"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            {i18n.t("ticketAdvanced.ticketNav") || "Ticket"}
          </TabsTrigger>
          <TabsTrigger
            value="attendance"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary gap-2"
          >
            <Users className="h-4 w-4" />
            {i18n.t("ticketAdvanced.attendanceNav") || "Atendimentos"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ticket" className="flex-1 m-0">
          {renderMessageContext()}
        </TabsContent>

        <TabsContent value="attendance" className="flex-1 m-0">
          {renderTicketsManagerTabs()}
        </TabsContent>
      </Tabs>
    </TicketAdvancedLayout>
  );
};

export default TicketAdvanced;
