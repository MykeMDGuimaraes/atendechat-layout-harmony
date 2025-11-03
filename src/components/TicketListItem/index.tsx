import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Ticket {
  id: number;
  status: string;
  lastMessage?: string;
  updatedAt: string;
  unreadMessages?: number;
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

interface TicketListItemProps {
  ticket: Ticket;
  onClick: () => void;
  isActive?: boolean;
}

const getLocale = () => {
  const i18nlocale = localStorage.getItem("i18nextLng");
  const browserLocale = i18nlocale?.substring(0, 2) ?? "pt";
  
  if (browserLocale === "en") return enUS;
  if (browserLocale === "es") return es;
  return ptBR;
};

export const TicketListItem: React.FC<TicketListItemProps> = ({
  ticket,
  onClick,
  isActive = false,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer border-b border-border transition-colors hover:bg-accent/50",
        isActive && "bg-accent"
      )}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={ticket.contact.profilePicUrl} alt={ticket.contact.name} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {getInitials(ticket.contact.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-sm text-foreground truncate">
            {ticket.contact.name}
          </h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(ticket.updatedAt), {
              addSuffix: true,
              locale: getLocale(),
            })}
          </span>
        </div>

        <p className="text-sm text-muted-foreground truncate mt-1">
          {ticket.lastMessage || ticket.contact.number}
        </p>

        <div className="flex items-center gap-2 mt-2">
          {ticket.queue && (
            <div
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: ticket.queue.color,
                color: "#fff",
              }}
            >
              {ticket.queue.name}
            </div>
          )}
          {ticket.user && (
            <span className="text-xs text-muted-foreground">
              {ticket.user.name}
            </span>
          )}
          {ticket.unreadMessages && ticket.unreadMessages > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {ticket.unreadMessages}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
