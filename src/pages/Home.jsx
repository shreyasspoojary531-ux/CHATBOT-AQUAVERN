import { motion } from "framer-motion";
import ChatWindow from "../components/chat/ChatWindow";
import NotificationPanel from "../components/notifications/NotificationPanel";
import { mockChats, mockNotifications } from "../data/mockData";

export default function Home() {
  return (
    <motion.main
      className="relative z-10 mx-auto max-w-[1600px] px-6 py-6 md:px-10 lg:px-14 xl:px-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 xl:gap-8">
        <div className="min-w-0 lg:col-span-8">
          <ChatWindow chats={mockChats} />
        </div>
        <div className="min-w-0 lg:col-span-4">
          <NotificationPanel notifications={mockNotifications} />
        </div>
      </div>
    </motion.main>
  );
}
