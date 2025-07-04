export interface MessagesHelpChat {
  text: string;
}

export interface HelpChat {
  from: "user" | "system";
  content: MessagesHelpChat;
}
