import { User, Settings, Palette, Bell, FileText, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

type AccountSection = "account" | "preferences" | "personalisation" | "notifications" | "terms" | "help";

interface AccountSidebarProps {
  activeSection: AccountSection;
  onSectionChange: (section: AccountSection) => void;
}

const menuItems = [
  { id: "account" as AccountSection, label: "Account", icon: User },
  { id: "preferences" as AccountSection, label: "Preferences", icon: Settings },
  { id: "personalisation" as AccountSection, label: "Personalisation", icon: Palette },
  { id: "notifications" as AccountSection, label: "Notifications", icon: Bell },
  { id: "terms" as AccountSection, label: "Terms & Conditions", icon: FileText },
  { id: "help" as AccountSection, label: "Help", icon: HelpCircle },
];

const SidebarContent = ({ activeSection, onSectionChange }: AccountSidebarProps) => (
  <nav className="space-y-2">
    {menuItems.map((item) => {
      const Icon = item.icon;
      return (
        <button
          key={item.id}
          onClick={() => onSectionChange(item.id)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
            activeSection === item.id
              ? "bg-primary text-primary-foreground font-semibold"
              : "hover:bg-muted text-foreground"
          )}
        >
          <Icon className="h-5 w-5" />
          <span>{item.label}</span>
        </button>
      );
    })}
  </nav>
);

const AccountSidebar = ({ activeSection, onSectionChange }: AccountSidebarProps) => {
  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mb-4">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 texture-fabric">
            <div className="py-6">
              <SidebarContent
                activeSection={activeSection}
                onSectionChange={onSectionChange}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <Card className="hidden lg:block w-64 p-4 texture-fabric">
        <SidebarContent
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
      </Card>
    </>
  );
};

export default AccountSidebar;
