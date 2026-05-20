import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";

export default function MainLayout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030303] text-white antialiased">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_82%_8%,rgba(255,255,255,0.055),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(255,255,255,0.045),transparent_36%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),transparent_34%),linear-gradient(0deg,rgba(0,0,0,0.72),transparent_42%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_42%,rgba(0,0,0,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:96px_96px] opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />
      </div>
      <Navbar />
      <Outlet />
    </div>
  );
}
