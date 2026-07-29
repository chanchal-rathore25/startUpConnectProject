import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

/**
 * SocketContext — StartupConnect
 * -------------------------------------------------
 * Ek hi Socket.io connection poori app ke liye, jab tak user logged in hai.
 * Online users ka Set track karta hai (presence:online / presence:offline events se).
 * -------------------------------------------------
 */

const SOCKET_URL = (import.meta.env?.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState(new Set());
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token || !user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      return;
    }

    const s = io(SOCKET_URL, { auth: { token } });
    socketRef.current = s;
    setSocket(s);

    s.on("presence:online", ({ userId }) => {
      setOnlineUserIds((prev) => new Set(prev).add(userId));
    });
    s.on("presence:offline", ({ userId }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      s.disconnect();
    };
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUserIds }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside <SocketProvider>");
  return ctx;
}
