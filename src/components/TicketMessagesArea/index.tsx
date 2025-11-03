import React, { useEffect, useRef, useState } from "react";
import { format, isSameDay } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageItem } from "../MessageItem";

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

interface TicketMessagesAreaProps {
  messages: Message[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const getLocale = () => {
  const i18nlocale = localStorage.getItem("i18nextLng");
  const browserLocale = i18nlocale?.substring(0, 2) ?? "pt";
  
  if (browserLocale === "en") return enUS;
  if (browserLocale === "es") return es;
  return ptBR;
};

export const TicketMessagesArea: React.FC<TicketMessagesAreaProps> = ({
  messages,
  loading,
  hasMore,
  onLoadMore,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const prevMessagesLengthRef = useRef(messages.length);

  useEffect(() => {
    if (scrollRef.current && shouldAutoScroll) {
      const messagesAdded = messages.length > prevMessagesLengthRef.current;
      if (messagesAdded) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages, shouldAutoScroll]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShouldAutoScroll(isAtBottom);

    if (target.scrollTop === 0 && hasMore && !loading) {
      onLoadMore();
    }
  };

  const renderDateSeparator = (date: string, index: number) => {
    const currentDate = new Date(date);
    const previousDate =
      index > 0 ? new Date(messages[index - 1].createdAt) : null;

    if (!previousDate || !isSameDay(currentDate, previousDate)) {
      return (
        <div className="flex justify-center my-4">
          <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
            {format(currentDate, "PPP", { locale: getLocale() })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 overflow-hidden relative bg-background">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto"
      >
        {hasMore && (
          <div className="flex justify-center p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadMore}
              disabled={loading}
            >
              {loading ? "Carregando..." : "Carregar mais mensagens"}
            </Button>
          </div>
        )}

        <div className="py-4">
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              {renderDateSeparator(message.createdAt, index)}
              <MessageItem message={message} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
