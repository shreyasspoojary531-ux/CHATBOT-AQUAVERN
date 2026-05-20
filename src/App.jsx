import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Chatbot from "./pages/Chatbot";
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
