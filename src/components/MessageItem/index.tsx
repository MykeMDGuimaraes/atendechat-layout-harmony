import React from "react";
import { format } from "date-fns";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  body: string;
  fromMe: boolean;
  read: boolean;
  mediaUrl?: string;
  mediaType?: string;
  ack: number;
  createdAt: string;
  quotedMsg?: Message;
  contact?: {
    id: number;
    name: string;
    profilePicUrl?: string;
  };
}

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const renderAckIcon = () => {
    if (!message.fromMe) return null;

    if (message.ack === 3 || message.read) {
      return <CheckCheck className="h-4 w-4 text-blue-500" />;
    }
    if (message.ack === 2) {
      return <CheckCheck className="h-4 w-4 text-muted-foreground" />;
    }
    return <Check className="h-4 w-4 text-muted-foreground" />;
  };

  const renderMedia = () => {
    if (!message.mediaUrl) return null;

    if (message.mediaType?.startsWith("image")) {
      return (
        <img
          src={message.mediaUrl}
          alt="Media"
          className="max-w-sm rounded-lg mb-2"
        />
      );
    }

    if (message.mediaType?.startsWith("video")) {
      return (
        <video controls className="max-w-sm rounded-lg mb-2">
          <source src={message.mediaUrl} type={message.mediaType} />
        </video>
      );
    }

    if (message.mediaType?.startsWith("audio")) {
      return (
        <audio controls className="mb-2">
          <source src={message.mediaUrl} type={message.mediaType} />
        </audio>
      );
    }

    return (
      <a
        href={message.mediaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline mb-2 block"
      >
        📎 Download arquivo
      </a>
    );
  };

  const renderQuotedMessage = () => {
    if (!message.quotedMsg) return null;

    return (
      <div className="bg-muted/50 border-l-4 border-primary p-2 rounded mb-2">
        <p className="text-xs text-muted-foreground font-semibold">
          {message.quotedMsg.contact?.name || "Você"}
        </p>
        <p className="text-sm text-foreground line-clamp-2">
          {message.quotedMsg.body}
        </p>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex gap-2 mb-4 px-4",
        message.fromMe ? "justify-end" : "justify-start"
      )}
    >
      {!message.fromMe && message.contact && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.contact.profilePicUrl} />
          <AvatarFallback>
            {message.contact.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[70%] rounded-lg p-3",
          message.fromMe
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {!message.fromMe && message.contact && (
          <p className="text-xs font-semibold mb-1 text-primary">
            {message.contact.name}
          </p>
        )}

        {renderQuotedMessage()}
        {renderMedia()}

        {message.body && (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.body}
          </p>
        )}

        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs opacity-70">
            {format(new Date(message.createdAt), "HH:mm")}
          </span>
          {renderAckIcon()}
        </div>
      </div>
    </div>
  );
};
