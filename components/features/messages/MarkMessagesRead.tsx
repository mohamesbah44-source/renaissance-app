"use client";

import { useEffect } from "react";
import { markMessagesRead } from "@/lib/messages/actions";

export function MarkMessagesRead({ userId, fromUserId }: { userId: string; fromUserId?: string }) {
  useEffect(() => {
    markMessagesRead(userId, fromUserId);
  }, [userId, fromUserId]);

  return null;
}
