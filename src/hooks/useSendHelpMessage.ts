import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { helpChatState } from "../state/atom";
import type { HelpChat } from "../types/helpChat";
import axios from "axios";

export function useSendHelpMessage() {
  const [error, setError] = useState<string | null>(null);
  const setMessages = useSetRecoilState(helpChatState);

  const sendMessage = async (text: string) => {
    const userMessage: HelpChat = {
      from: "user",
      content: { text },
    };

    setMessages(prev => [...prev, userMessage]);
    setError(null);

    try {
      const { data } = await axios.post("/api/help/chat", {
        message: text,
      });

      const systemMessage: HelpChat = {
        from: "system",
        content: { text: data.reply },
      };

      setMessages(prev => [...prev, systemMessage]);
    } catch (err: any) {
      setError(err.message || "Erro ao enviar mensagem.");
    } 
  };

  return { sendMessage, error };
}
