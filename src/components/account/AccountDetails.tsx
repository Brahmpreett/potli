import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pencil, LogOut, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import EditNameModal from "./EditNameModal";
import EditUsernameModal from "./EditUsernameModal";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
  potli_id: string | null;
  potli_name?: string;
  potli_color?: string;
}

const AccountDetails = () => {
  const [user, setUser] = useState<unknown>(null);
  const [profile, setProfile] = useState<unknown>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [editUsernameOpen, setEditUsernameOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchTransactions();
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

  const fetchTransactions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch transactions with potli info
    const { data: transactionsData, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching transactions:", error);
      return;
    }

    // Fetch potlis to get names and colors
    const { data: potlisData } = await supabase
      .from("potlis")
      .select("id, name, color")
      .eq("user_id", user.id);

    const potliMap = new Map(potlisData?.map(p => [p.id, { name: p.name, color: p.color }]) || []);

    const enrichedTransactions = transactionsData?.map(t => ({
      ...t,
      potli_name: t.potli_id ? potliMap.get(t.potli_id)?.name : "General",
      potli_color: t.potli_id ? potliMap.get(t.potli_id)?.color : "muted",
    })) || [];

    setTransactions(enrichedTransactions);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getInitials = () => {
    const p = profile as { full_name?: string };
    const u = user as { email?: string };
    if (p?.full_name) {
      return p.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase();
    }
    return u?.email?.[0].toUpperCase() || "U";
  };

  const formatTransactionDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  };

  const formatTransactionTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "hh:mm a");
  };

  return (
    <div className="space-y-6">
      {/* Account Info Card */}
      <Card className="p-6 texture-fabric">
        <div className="flex flex-col items-center space-y-4 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={(profile as { avatar_url?: string })?.avatar_url} />
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
              <p className="text-lg font-medium">{(profile as { full_name?: string })?.full_name || "Not set"}</p>
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
              <p className="text-lg font-medium">{(profile as { username?: string })?.username || "Not set"}</p>
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
            <p className="text-lg font-medium">{(user as { email?: string })?.email}</p>
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

      {/* Transaction History Card */}
      <Card className="p-6 texture-fabric">
        <h3 className="font-handwriting text-2xl font-bold text-primary mb-4">Transaction History</h3>
        
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No transactions yet</p>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50 hover:bg-background/80 hover:border-primary/30 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${transaction.type === "income" ? "bg-emerald/20" : "bg-maroon/20"}`}>
                      {transaction.type === "income" ? (
                        <TrendingUp className="h-5 w-5 text-emerald" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-maroon" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {transaction.potli_name || "General"}
                      </span>
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {transaction.description || "No description"}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{formatTransactionDate(transaction.created_at)}</span>
                        <span>•</span>
                        <span>{formatTransactionTime(transaction.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${transaction.type === "income" ? "text-emerald" : "text-maroon"}`}>
                    {transaction.type === "income" ? "+" : "−"}₹{transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </Card>

      <EditNameModal
        open={editNameOpen}
        onOpenChange={setEditNameOpen}
        currentName={(profile as { full_name?: string })?.full_name || ""}
        onUpdate={fetchUserData}
      />

      <EditUsernameModal
        open={editUsernameOpen}
        onOpenChange={setEditUsernameOpen}
        currentUsername={(profile as { username?: string })?.username || ""}
        onUpdate={fetchUserData}
      />
    </div>
  );
};

export default AccountDetails;
