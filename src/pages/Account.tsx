import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AccountSidebar from "@/components/account/AccountSidebar";
import AccountDetails from "@/components/account/AccountDetails";
import Preferences from "@/components/account/Preferences";
import Personalisation from "@/components/account/Personalisation";
import Notifications from "@/components/account/Notifications";
import TermsConditions from "@/components/account/TermsConditions";
import Help from "@/components/account/Help";

type AccountSection = "account" | "preferences" | "personalisation" | "notifications" | "terms" | "help";

const Account = () => {
  const [activeSection, setActiveSection] = useState<AccountSection>("account");
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return <AccountDetails />;
      case "preferences":
        return <Preferences />;
      case "personalisation":
        return <Personalisation />;
      case "notifications":
        return <Notifications />;
      case "terms":
        return <TermsConditions />;
      case "help":
        return <Help />;
      default:
        return <AccountDetails />;
    }
  };

  return (
    <div className="min-h-screen bg-background texture-fabric">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-handwriting text-4xl font-bold text-primary">Account</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <AccountSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          {/* Content Area */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
