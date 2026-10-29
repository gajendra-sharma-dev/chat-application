"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import Link from "next/link";
import { toast } from "@/components/ui/toast";

export function ChatWindow({ roomId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getMessages = async () => {
    try {
      const res = await api.get(`/message/${roomId}`);
      setMessages(res.data.data);
    } catch (err) {
      toast.add({ title: "error", description: "can not get messages" });
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    const value = text.trim();
    if (!value) return;

    setText("");
    try {
      const res = await api.post(`/message/${roomId}`, { text: value });
      setMessages((prev) => [...prev, res.data.data]);
    } catch (err) {
      toast.add({ title: "error", description: "can not send message" });
      setText(value);
    }
  };

  useEffect(() => {
    if (!roomId) return;
    setMessages([]);
    getMessages();
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex items-center border-b px-3 py-2 sm:px-4 sm:py-3">
        <Link
          href="/dashboard"
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100"
        >
          ← Back
        </Link>
      </header>

      {/* messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
          {messages.map((msg) => {
            const isMe = msg.senderId?._id === currentUserId;

            return (
              <div
                key={msg._id}
                className={cn("flex", isMe ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm sm:max-w-[75%] lg:max-w-[65%]",
                    isMe
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted",
                  )}
                >
                  {!isMe && (
                    <p className="mb-0.5 text-xs font-medium opacity-70">
                      {msg.senderId?.username}
                    </p>
                  )}
                  <p className="break-words whitespace-pre-wrap [overflow-wrap:anywhere]">
                    {msg.text}
                  </p>
                  <p className="mt-1 text-right text-[10px] opacity-60">
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* input: iPhone ke home bar ke liye safe-area padding */}
      <form
        onSubmit={sendMessage}
        className="border-t px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-4 lg:px-6"
      >
        <div className="mx-auto flex w-full max-w-3xl gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
            className="min-w-0 flex-1 text-base sm:text-sm"
          />
          <Button
            type="submit"
            size="icon"
            className="shrink-0"
            aria-label="Send message"
            disabled={!text.trim()}
          >
            <SendHorizonal className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
