import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PotliCard from "@/components/PotliCard";
import AddIncomeModal from "@/components/AddIncomeModal";
import AddExpenseModal from "@/components/AddExpenseModal";
import SettingsSidebar from "@/components/SettingsSidebar";
import { Plus, Minus, Settings, LogOut } from "lucide-react";

interface Potli {
  id: string;
  name: string;
  color: string;
  percentage: number;
  balance: number;
  icon: string;
  display_order: number;
}

const Dashboard = () => {
  const [potlis, setPotlis] = useState<Potli[]>([]);
  const [loading, setLoading] = useState(true);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchPotlis();
  }, []);

  const fetchPotlis = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("potlis")
        .select("*")
        .eq("user_id", user.id)
        .order("display_order");

      if (error) throw error;
      setPotlis(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load potlis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (amount: number, description: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Distribute income proportionally
    const updates = potlis.map((potli) => ({
      id: potli.id,
      balance: potli.balance + (amount * potli.percentage) / 100,
    }));

    for (const update of updates) {
      await supabase
        .from("potlis")
        .update({ balance: update.balance })
        .eq("id", update.id);
    }

    // Record transaction
    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "income",
      amount,
      description,
    });

    await fetchPotlis();
  };

  const handleAddExpense = async (potliId: string, amount: number, description: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const potli = potlis.find((p) => p.id === potliId);
    if (!potli || potli.balance < amount) {
      throw new Error("Insufficient balance");
    }

    await supabase
      .from("potlis")
      .update({ balance: potli.balance - amount })
      .eq("id", potliId);

    await supabase.from("transactions").insert({
      user_id: user.id,
      potli_id: potliId,
      type: "expense",
      amount,
      description,
    });

    await fetchPotlis();
  };

  const handleUpdatePercentages = async (updatedPotlis: Potli[]) => {
    for (const potli of updatedPotlis) {
      await supabase
        .from("potlis")
        .update({ percentage: potli.percentage })
        .eq("id", potli.id);
    }
    await fetchPotlis();
  };

  const handleAddPotli = async (name: string, color: string, percentage: number, icon: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const maxOrder = Math.max(...potlis.map((p) => p.display_order), 0);
    await supabase.from("potlis").insert({
      user_id: user.id,
      name,
      color,
      percentage,
      icon,
      display_order: maxOrder + 1,
    });

    await fetchPotlis();
  };

  const handleDeletePotli = async (id: string) => {
    await supabase.from("potlis").delete().eq("id", id);
    await fetchPotlis();
  };

  const handleRenamePotli = async (id: string, newName: string) => {
    await supabase.from("potlis").update({ name: newName }).eq("id", id);
    await fetchPotlis();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const totalBalance = potlis.reduce((sum, p) => sum + p.balance, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your potlis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background texture-fabric">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-handwriting text-4xl font-bold text-primary">Potli</h1>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Total Balance */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8 mb-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">Total Balance</p>
          <p className="font-handwriting text-6xl font-bold text-primary">
            ₹{totalBalance.toFixed(2)}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 max-w-md mx-auto">
          <Button
            onClick={() => setIncomeModalOpen(true)}
            className="flex-1 bg-primary hover:bg-primary/90 h-14"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Income
          </Button>
          <Button
            onClick={() => setExpenseModalOpen(true)}
            variant="destructive"
            className="flex-1 h-14"
          >
            <Minus className="mr-2 h-5 w-5" />
            Add Expense
          </Button>
        </div>

        {/* Potlis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {potlis.map((potli) => (
            <PotliCard
              key={potli.id}
              name={potli.name}
              color={potli.color}
              percentage={potli.percentage}
              balance={potli.balance}
              icon={potli.icon}
              onClick={() => {}}
            />
          ))}
        </div>

        {potlis.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No potlis yet. Start by adding your first income!
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddIncomeModal
        open={incomeModalOpen}
        onOpenChange={setIncomeModalOpen}
        onAddIncome={handleAddIncome}
      />

      <AddExpenseModal
        open={expenseModalOpen}
        onOpenChange={setExpenseModalOpen}
        potlis={potlis}
        onAddExpense={handleAddExpense}
      />

      <SettingsSidebar
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        potlis={potlis}
        onUpdatePercentages={handleUpdatePercentages}
        onAddPotli={handleAddPotli}
        onDeletePotli={handleDeletePotli}
        onRenamePotli={handleRenamePotli}
      />
    </div>
  );
};

export default Dashboard;