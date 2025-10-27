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
    <div className="fixed bottom-2 right-4 text-[10px] text-neutral-400 transition-opacity duration-500">
        © 2025{" "}
        <a
            href="https://brahmpreet.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-700 underline hover:text-neutral-900"
        >
            Brahmpreet Singh
        </a>
        . All rights reserved.
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