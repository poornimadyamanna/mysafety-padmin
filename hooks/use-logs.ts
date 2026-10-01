import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://mysafety24x7.in";

export function useLogSocket(token: string | null) {
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(`${SOCKET_URL}/logs`, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join", "admin-logs");
    });

    socket.on("logLine", (line: string) => {
      setLogs((prev) => [...prev, line]);
    });

    socket.on(
      "log-update",
      ({ filename, line }: { filename: string; line: string }) => {
        setLogs((prev) => [...prev, `[${filename}] ${line}`]);
      },
    );

    socket.on("tailStarted", (logType: string) => {
      // console.log(`Tailing ${logType} started`);
    });

    socket.on("logError", (error: string) => {
      console.error("Log error:", error);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const startTailing = (logType: "combined" | "error" = "combined") => {
    socketRef.current?.emit("startTail", logType);
  };

  const stopTailing = () => {
    socketRef.current?.emit("stopTail");
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return { connected, logs, startTailing, stopTailing, clearLogs };
}
