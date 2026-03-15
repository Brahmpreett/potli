import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, Sliders, Palette, Bell, FileText, 
  HelpCircle, LogOut, ChevronLeft, ArrowRightLeft,
  Sun, Moon
} from "lucide-react";
import { CoinBackground } from "@/components/CoinBackground";
import AccountProfile from "@/components/AccountProfile";
import TransactionHistory from "@/components/TransactionHistory";
import AboutSection from "@/components/AboutSection";
import TermsSection from "@/components/TermsSection";

type TabSegment = "account" | "transactions" | "preferences" | "personalisation" | "notifications" | "terms" | "about";

export default function Account() {
  const [activeTab, setActiveTab] = useState<TabSegment>("account");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("potli-theme");
    setIsDarkMode(savedTheme !== "light");
  }, []);

  const toggleDarkMode = (dark: boolean) => {
    setIsDarkMode(dark);
    if (dark) {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("potli-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("potli-theme", "light");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const menuItems: { id: TabSegment; label: string; icon: React.ReactNode }[] = [
    { id: "account", label: "Account", icon: <User className="w-5 h-5" /> },
    { id: "transactions", label: "Transactions", icon: <ArrowRightLeft className="w-5 h-5" /> },
    { id: "personalisation", label: "Appearance", icon: <Palette className="w-5 h-5" /> },
    { id: "preferences", label: "Preferences", icon: <Sliders className="w-5 h-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { id: "terms", label: "Terms & Conditions", icon: <FileText className="w-5 h-5" /> },
    { id: "about", label: "About Potli", icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "account": return <AccountProfile />;
      case "transactions": return <TransactionHistory />;
      case "personalisation": return (
        <div className="flex flex-col gap-6 w-full max-w-3xl animate-in fade-in duration-500">
           <h2 className="text-2xl font-bold px-2">Appearance</h2>
           <div className="bg-card w-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-3xl p-8 border border-border/50 flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold">Theme</h3>
                <p className="text-sm text-muted-foreground font-medium">Choose between a warm light or a earthy dark aesthetic.</p>
              </div>

              {/* Theme Toggle Card */}
              <div className="relative bg-background/50 border border-border/40 p-1.5 rounded-2xl flex items-center w-full max-w-[400px] shadow-inner overflow-hidden">
                {/* Sliding Pill */}
                <div 
                    className={`absolute inset-y-1.5 w-[calc(50%-6px)] bg-primary rounded-[11px] shadow-md transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isDarkMode ? 'translate-x-[calc(100%+6px)]' : 'translate-x-0'}`}
                />
                
                <button 
                    onClick={() => toggleDarkMode(false)}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-3.5 z-10 transition-colors duration-300 font-bold text-sm ${!isDarkMode ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                >
                    <Sun className={`w-5 h-5 ${!isDarkMode ? 'fill-current' : ''}`} />
                    Light Mode
                </button>
                
                <button 
                    onClick={() => toggleDarkMode(true)}
                    className={`relative flex-1 flex items-center justify-center gap-2 py-3.5 z-10 transition-colors duration-300 font-bold text-sm ${isDarkMode ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                >
                    <Moon className={`w-5 h-5 ${isDarkMode ? 'fill-current' : ''}`} />
                    Dark Mode
                </button>
              </div>
           </div>
        </div>
      );
      case "preferences": return <PlaceholderCard title="Preferences" description="Currency, language and display preferences coming soon" icon={<Sliders className="w-12 h-12 opacity-20" />} />;
      case "notifications": return <PlaceholderCard title="Notifications" description="Notification settings coming soon" icon={<Bell className="w-12 h-12 opacity-20" />} />;
      case "terms": return <TermsSection />;
      case "about": return <AboutSection />;
      default: return <AccountProfile />;
    }
  };

  return (
    <div className="h-full relative min-h-screen bg-background texture-fabric transition-colors duration-500">
      <CoinBackground />
      
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-foreground/80" />
            </button>
            <h1 className="font-handwriting text-4xl font-bold text-primary mb-1">Potli</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-0 md:px-4 py-6 md:py-10 max-w-[1200px]">
        {/* Responsive Layout Shell */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* LEFT PANEL: Navigation Sidebar */}
          <aside className="w-full md:w-[240px] md:sticky md:top-32 flex flex-col gap-2 shrink-0 px-4 md:px-0 z-20">
            <div className="flex md:flex-col overflow-x-auto pb-4 md:pb-0 hide-scrollbar gap-2 w-full snap-x">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-150 snap-start whitespace-nowrap md:whitespace-normal text-left
                    ${activeTab === item.id 
                      ? "bg-primary/10 text-primary border-l-4 md:border-l-4 border-b-4 md:border-b-0 border-primary" 
                      : "text-muted-foreground hover:bg-primary/5 border-l-4 md:border-l-4 border-b-4 md:border-b-0 border-transparent hover:text-foreground"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              
              <div className="hidden md:block w-full h-px bg-border my-4" />
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-destructive hover:bg-destructive/10 transition-colors border-l-4 md:border-l-4 border-b-4 md:border-b-0 border-transparent snap-start whitespace-nowrap md:whitespace-normal"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </aside>

          {/* RIGHT PANEL: Dynamic Content Area */}
          <main className="flex-1 w-full flex flex-col gap-6 px-4 md:px-0">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

const PlaceholderCard = ({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) => (
  <div className="bg-card w-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[300px] border border-border/50">
    <div className="mb-6 text-primary">{icon}</div>
    <h2 className="text-2xl font-semibold mb-2">{title}</h2>
    <p className="text-muted-foreground max-w-sm font-medium">{description}</p>
  </div>
);
