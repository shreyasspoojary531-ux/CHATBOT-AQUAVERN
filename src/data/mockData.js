export const mockChats = [
  {
    id: 1,
    name: "Alex Chen",
    initials: "AC",
    lastMessage: "Sure, I'll send the files by evening",
    timestamp: "2:34 PM",
    unread: 2,
    messages: [
      { id: 1, sender: "them", text: "Hey! Did you get a chance to review the project specs?", time: "10:30 AM" },
      { id: 2, sender: "me", text: "Yes, I went through them. Looks good!", time: "10:45 AM" },
      { id: 3, sender: "them", text: "Great! I have some ideas for the UI improvements.", time: "11:00 AM" },
      { id: 4, sender: "me", text: "Really? I'd love to hear them.", time: "11:15 AM" },
      { id: 5, sender: "them", text: "So I was thinking we could add some animations to the landing page...", time: "11:30 AM" },
      { id: 6, sender: "me", text: "That sounds like a great idea. Let's discuss in detail.", time: "12:00 PM" },
      { id: 7, sender: "them", text: "Sure, I'll send the files by evening", time: "2:34 PM" },
    ]
  }
];

export const mockNotifications = [
  {
    id: 1,
    title: "New message from Alex",
    description: "Sent you the project files",
    time: "2 minutes ago",
    unread: true
  },
  {
    id: 2,
    title: "Sarah accepted your invite",
    description: "Joined the design review meeting",
    time: "1 hour ago",
    unread: true
  },
  {
    id: 3,
    title: "System update",
    description: "New features available in dashboard",
    time: "3 hours ago",
    unread: false
  },
  {
    id: 4,
    title: "Meeting reminder",
    description: "Standup in 30 minutes",
    time: "Yesterday",
    unread: false
  },
];

export const defaultBotResponse = "Message received. Aquavern AI processing will be connected soon.";
