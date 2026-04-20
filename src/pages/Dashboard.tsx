import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PotliCard from "@/components/PotliCard";
import AddIncomeModal from "@/components/AddIncomeModal";
import AddExpenseModal from "@/components/AddExpenseModal";
import SettingsSidebar from "@/components/SettingsSidebar";
import { DonutChart } from "@/components/DonutChart";
import { CoinBackground } from "@/components/CoinBackground";
import { Plus, Minus, Settings, User } from "lucide-react";
console.log("ENV:", import.meta.env);
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
  const [hoveredPotliId, setHoveredPotliId] = useState<string | null>(null);
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [preSelectedPotliId, setPreSelectedPotliId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        fetchPotlis();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchPotlis = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from("potlis")
        .select("*")
        .eq("user_id", session.user.id)
        .order("display_order");

      if (error) throw error;

      setPotlis(data || []);
    } catch (error) {
      console.log(error);
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

  const handleCardClick = (potliId: string) => {
    setPreSelectedPotliId(potliId);
    setExpenseModalOpen(true);
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
    <div className="h-full relative">
      <CoinBackground />
      {/* View 1: Dashboard */}
      <div className="min-h-screen bg-transparent texture-fabric">
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
                  className="rounded-full border-primary/20 hover:border-primary/50 overflow-hidden ml-2"
                  onClick={() => navigate('/account')}
                >
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary">
                    <User className="h-5 w-5" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="container mx-auto px-4 py-8 lg:pt-8 max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_calc(40%-40px)] gap-10 items-start">

            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-8 order-2 lg:order-1">

              <div className="flex flex-col gap-4 w-full">
                <div>
                  <p className="text-sm text-muted-foreground mb-1 font-bold uppercase tracking-widest">Liquid Money</p>
                  <p className="font-handwriting text-7xl font-bold text-primary">
                    ₹{totalBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>

                <div className="flex gap-4 max-w-md w-full relative z-10 mt-2">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {potlis.map((potli) => (
                  <div
                    key={potli.id}
                    onMouseEnter={() => setHoveredPotliId(potli.id)}
                    onMouseLeave={() => setHoveredPotliId(null)}
                  >
                    <PotliCard
                      name={potli.name}
                      color={potli.color}
                      percentage={potli.percentage}
                      balance={potli.balance}
                      icon={potli.icon}
                      onClick={() => handleCardClick(potli.id)}
                      isHovered={hoveredPotliId === potli.id}
                    />
                  </div>
                ))}
              </div>

              {potlis.length === 0 && (
                <div className="text-center py-12 relative z-10">
                  <p className="text-muted-foreground mb-4">
                    No potlis yet. Start by adding your first income!
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:sticky lg:top-32 order-1 lg:order-2 flex flex-col items-center w-full min-w-[340px] max-w-[420px] mx-auto overflow-visible px-4">
              <div className="w-full">
                <DonutChart
                  potlis={potlis}
                  totalBalance={totalBalance}
                  hoveredPotliId={hoveredPotliId}
                  onHover={setHoveredPotliId}
                />
              </div>

              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 mt-6 w-full relative z-10">
                {potlis.map((potli) => {
                  const colorMap: Record<string, string> = {
                    "royal-blue": "var(--royal-blue)",
                    "emerald": "var(--emerald)",
                    "turmeric": "var(--turmeric)",
                    "maroon": "var(--maroon)",
                    "coral": "var(--coral)",
                    "saffron": "var(--saffron)",
                  };
                  return (
                    <div
                      key={`legend-${potli.id}`}
                      className={`flex items-center gap-2.5 text-sm transition-all duration-200 cursor-pointer p-2 rounded-xl border border-transparent hover:border-border/40 hover:bg-card/50 ${hoveredPotliId && hoveredPotliId !== potli.id ? 'opacity-40 grayscale-[20%]' : 'opacity-100'}`}
                      onMouseEnter={() => setHoveredPotliId(potli.id)}
                      onMouseLeave={() => setHoveredPotliId(null)}
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: colorMap[potli.color] || 'var(--turmeric)' }}
                      />
                      <span className="font-bold text-foreground/80">{potli.name}</span>
                      <span className="text-muted-foreground font-bold text-[11px] bg-muted/30 px-1.5 py-0.5 rounded-md">{potli.percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddIncomeModal
          open={incomeModalOpen}
          onOpenChange={setIncomeModalOpen}
          onAddIncome={handleAddIncome}
        />

        <AddExpenseModal
          open={expenseModalOpen}
          onOpenChange={(open) => {
            setExpenseModalOpen(open);
            if (!open) setPreSelectedPotliId(null);
          }}
          potlis={potlis}
          onAddExpense={handleAddExpense}
          defaultPotliId={preSelectedPotliId || undefined}
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
    </div>
  );
};

export default Dashboard;