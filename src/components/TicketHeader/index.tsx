import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Check,
  UserPlus,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { i18n } from "../../translate/i18n";

interface Contact {
  id: number;
  name: string;
  number: string;
  profilePicUrl?: string;
}

interface Queue {
  id: number;
  name: string;
  color: string;
}

interface User {
  id: number;
  name: string;
}

interface TicketHeaderProps {
  contact: Contact;
  queue?: Queue;
  user?: User;
  status: string;
  onAccept?: () => void;
  onTransfer?: () => void;
  onResolve?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const TicketHeader: React.FC<TicketHeaderProps> = ({
  contact,
  queue,
  user,
  status,
  onAccept,
  onTransfer,
  onResolve,
  onBack,
  showBackButton = false,
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
    <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
      {showBackButton && (
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

      <Avatar className="h-10 w-10">
        <AvatarImage src={contact.profilePicUrl} alt={contact.name} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {getInitials(contact.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-foreground truncate">{contact.name}</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{contact.number}</span>
          {queue && (
            <>
              <span>•</span>
              <span
                className="px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: queue.color }}
              >
                {queue.name}
              </span>
            </>
          )}
          {user && (
            <>
              <span>•</span>
              <span>{user.name}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {status === "pending" && onAccept && (
          <Button variant="default" size="sm" onClick={onAccept}>
            <Check className="h-4 w-4 mr-2" />
            {i18n.t("tickets.actions.accept") || "Aceitar"}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onTransfer && (
              <DropdownMenuItem onClick={onTransfer}>
                <UserPlus className="h-4 w-4 mr-2" />
                {i18n.t("tickets.actions.transfer") || "Transferir"}
              </DropdownMenuItem>
            )}
            {onResolve && status !== "closed" && (
              <DropdownMenuItem onClick={onResolve}>
                <Check className="h-4 w-4 mr-2" />
                {i18n.t("tickets.actions.resolve") || "Resolver"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
