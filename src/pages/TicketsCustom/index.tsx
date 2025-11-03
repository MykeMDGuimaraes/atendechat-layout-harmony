import React from "react";
import { useParams } from "react-router-dom";
import TicketsManager from "../../components/TicketsManagerTabs";
import Ticket from "../../components/Ticket";
import logo from "../../assets/logo.png";
import { i18n } from "../../translate/i18n";

const TicketsCustom: React.FC = () => {
  const { ticketId } = useParams();

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      <div className="w-[400px] border-r border-border">
        <TicketsManager />
      </div>

      <div className="flex-1">
        {ticketId ? (
          <Ticket />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-card">
            <img
              src={logo}
              alt="Logo"
              className="w-64 mb-8 opacity-50"
            />
            <p className="text-muted-foreground">
              {i18n.t("chat.noTicketMessage") || "Selecione um ticket para começar"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsCustom;
