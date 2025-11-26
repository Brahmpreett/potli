import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pencil, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EditNameModal from "./EditNameModal";
import EditUsernameModal from "./EditUsernameModal";

const AccountDetails = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [editUsernameOpen, setEditUsernameOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      setProfile(profileData);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || "U";
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 texture-fabric">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile?.avatar_url} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" />
            Change Avatar
          </Button>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div className="flex items-center justify-between py-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Name</p>
              <p className="text-lg font-medium">{profile?.full_name || "Not set"}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditNameOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Change
            </Button>
          </div>

          {/* Username */}
          <div className="flex items-center justify-between py-4 border-b">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Username</p>
              <p className="text-lg font-medium">{profile?.username || "Not set"}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditUsernameOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Change
            </Button>
          </div>

          {/* Email */}
          <div className="py-4 border-b">
            <p className="text-sm text-muted-foreground mb-1">Email</p>
            <p className="text-lg font-medium">{user?.email}</p>
          </div>

          {/* Subscription */}
          <div className="py-4 border-b">
            <p className="text-sm text-muted-foreground mb-1">Your Subscription</p>
            <p className="text-lg font-medium">Free Plan</p>
          </div>
        </div>

        <div className="mt-8">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </Card>

      <EditNameModal
        open={editNameOpen}
        onOpenChange={setEditNameOpen}
        currentName={profile?.full_name || ""}
        onUpdate={fetchUserData}
      />

      <EditUsernameModal
        open={editUsernameOpen}
        onOpenChange={setEditUsernameOpen}
        currentUsername={profile?.username || ""}
        onUpdate={fetchUserData}
      />
    </div>
  );
};

export default AccountDetails;
