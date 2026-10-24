"use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatWindow({ room }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  // room badalne par messages lo, aur har 3 sec me refresh
  // (Socket.IO lagane par ye polling hata denge)
  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const res = await api.get(`/message/${room._id}`);
        if (active) setMessages(res.data.data);
      } catch {
        if (active) setMessages([]);
      }
    };

    load();
    const timer = setInterval(load, 3000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [room._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await api.post(`/message/${room._id}`, { text });
      setMessages((prev) => [...prev, res.data.data]);
      setText("");
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

  const title = room.isGroup
    ? room.name
    : room.members.find((m) => m._id !== user._id)?.username;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-3 font-semibold">{title}</div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {messages.map((m, i) => {
            const mine = m.senderId?._id === user._id;
            return (
              <div
                key={m._id ?? `msg-${i}`}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-xs px-3 py-2 ${
                    mine ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  {!mine && (
                    <p className="text-xs font-bold">{m.senderId?.username}</p>
                  )}
                  <p>{m.text}</p>
                </Card>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <form onSubmit={send} className="flex gap-2 border-t p-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
