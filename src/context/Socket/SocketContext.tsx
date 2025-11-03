import React, { createContext } from "react";
import { io, Socket } from "socket.io-client";

const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? JSON.parse(token) : null;
};

export const SocketManager = io(import.meta.env.VITE_API_BASE_URL || "https://api.diasolutions.ia.br", {
  transports: ["websocket"],
  autoConnect: false,
  auth: (cb) => {
    cb({ token: getToken() });
  },
});

export const SocketContext = createContext<Socket>(SocketManager);
