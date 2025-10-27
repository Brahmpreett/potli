import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const Footer = () => {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
      setShowFooter(atBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-2 right-4 text-[10px] text-neutral-400 transition-opacity duration-500 ${
        showFooter ? "opacity-100" : "opacity-0"
      }`}
    >
      © 2025 Brahmpreet Singh. All rights reserved.
    </div>
  );
};

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;