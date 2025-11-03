import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../context/Socket/SocketContext";
import api from "../services/api";

interface Message {
  id: string;
  ticketId: number;
  body: string;
  fromMe: boolean;
  read: boolean;
  mediaUrl?: string;
  mediaType?: string;
  ack: number;
  createdAt: string;
  updatedAt: string;
  quotedMsg?: Message;
  contact?: {
    id: number;
    name: string;
    number: string;
    profilePicUrl?: string;
  };
}

interface UseMessagesResult {
  messages: Message[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  sendMessage: (body: string) => Promise<void>;
  sendMedia: (file: File) => Promise<void>;
}

export const useMessages = (ticketId: number | null): UseMessagesResult => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!ticketId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    setPageNumber(1);

    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${ticketId}`, {
          params: { pageNumber: 1 },
        });
        setMessages(data.messages);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [ticketId]);

  useEffect(() => {
    if (!ticketId) return;

    const handleNewMessage = (data: any) => {
      if (data.action === "create" && data.message.ticketId === ticketId) {
        setMessages((prev) => [...prev, data.message]);
      }
      if (data.action === "update") {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === data.message.id ? data.message : msg))
        );
      }
    };

    socket.on("appMessage", handleNewMessage);

    return () => {
      socket.off("appMessage", handleNewMessage);
    };
  }, [ticketId, socket]);

  const loadMore = async () => {
    if (!ticketId || !hasMore || loading) return;

    setLoading(true);
    try {
      const { data } = await api.get(`/messages/${ticketId}`, {
        params: { pageNumber: pageNumber + 1 },
      });
      setMessages((prev) => [...data.messages, ...prev]);
      setPageNumber((prev) => prev + 1);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (body: string) => {
    if (!ticketId || !body.trim()) return;

    try {
      await api.post(`/messages/${ticketId}`, { body });
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const sendMedia = async (file: File) => {
    if (!ticketId) return;

    const formData = new FormData();
    formData.append("medias", file);
    formData.append("body", file.name);

    try {
      await api.post(`/messages/${ticketId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Error sending media:", error);
      throw error;
    }
  };

  return { messages, loading, hasMore, loadMore, sendMessage, sendMedia };
};
