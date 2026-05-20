export const privateChats = [
  {
    id: "ops-room",
    name: "Mira Kapoor",
    role: "Operations Lead",
    initials: "MK",
    lastMessage: "Can you confirm the Aquavern rollout window?",
    timestamp: "09:42",
    status: "Online",
    unread: 2,
    messages: [
      {
        id: 1,
        sender: "Mira Kapoor",
        text: "Morning. Can you confirm the Aquavern rollout window?",
        timestamp: "09:36",
        direction: "incoming",
      },
      {
        id: 2,
        sender: "You",
        text: "Targeting the quiet slot after the internal sync.",
        timestamp: "09:38",
        direction: "outgoing",
      },
      {
        id: 3,
        sender: "Mira Kapoor",
        text: "Perfect. I will keep the notifications channel warm.",
        timestamp: "09:42",
        direction: "incoming",
      },
    ],
  },
];

export const notifications = [
  {
    id: 1,
    title: "Workspace sync complete",
    body: "Private chat indexes refreshed across internal rooms.",
    time: "2m ago",
  },
  {
    id: 2,
    title: "Policy update queued",
    body: "New moderation copy is pending review for Aquavern.",
    time: "18m ago",
  },
  {
    id: 3,
    title: "Chatbot UI preview",
    body: "Default AI response flow is ready for stakeholder testing.",
    time: "41m ago",
  },
  {
    id: 4,
    title: "Quiet hours active",
    body: "Non-critical notifications are being bundled.",
    time: "1h ago",
  },
];

export const chatbotStarterMessages = [
  {
    id: "system-1",
    role: "assistant",
    content: "Aquavern interface is online. Send a message to preview the response flow.",
    timestamp: "Ready",
  },
];

export const defaultBotReply =
  "Message received. Aquavern Intelligence is processing your request in simulation mode.";
