import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface Potli {
  id: string;
  name: string;
  color: string;
  percentage: number;
  icon: string;
  display_order: number;
}

interface SettingsSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  potlis: Potli[];
  onUpdatePercentages: (potlis: Potli[]) => Promise<void>;
  onAddPotli: (name: string, color: string, percentage: number, icon: string) => Promise<void>;
  onDeletePotli: (id: string) => Promise<void>;
  onRenamePotli: (id: string, newName: string) => Promise<void>;
}

const SettingsSidebar = ({
  open,
  onOpenChange,
  potlis,
  onUpdatePercentages,
  onAddPotli,
  onDeletePotli,
  onRenamePotli,
}: SettingsSidebarProps) => {
  const [localPotlis, setLocalPotlis] = useState<Potli[]>(potlis);
  const [newPotliName, setNewPotliName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLocalPotlis(potlis);
  }, [potlis]);

  const totalPercentage = localPotlis.reduce((sum, p) => sum + p.percentage, 0);

  const handlePercentageChange = (id: string, value: number) => {
    setLocalPotlis((prev) =>
      prev.map((p) => (p.id === id ? { ...p, percentage: value } : p))
    );
  };

  const handleSavePercentages = async () => {
    if (totalPercentage !== 100) {
      toast({
        title: "Invalid Percentages",
        description: "Total must equal 100%",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onUpdatePercentages(localPotlis);
      toast({
        title: "Saved!",
        description: "Your potli percentages have been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPotli = async () => {
    if (!newPotliName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your potli",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onAddPotli(newPotliName, "turmeric", 0, "ShoppingBag");
      setNewPotliName("");
      toast({
        title: "Potli Added!",
        description: `${newPotliName} has been created`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add potli",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-handwriting text-3xl text-primary">
            Customize Your Potlis
          </SheetTitle>
          <SheetDescription>
            Adjust allocations and manage your budget categories
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="percentages" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="percentages">Percentages</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="percentages" className="space-y-6 mt-6">
            <div className="space-y-6">
              {localPotlis.map((potli) => (
                <div key={potli.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>{potli.name}</Label>
                    <span className="text-sm font-medium">{potli.percentage}%</span>
                  </div>
                  <Slider
                    value={[potli.percentage]}
                    onValueChange={(value) => handlePercentageChange(potli.id, value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            <div
              className={`text-center p-4 rounded-lg ${
                totalPercentage === 100
                  ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              Total: {totalPercentage}%
              {totalPercentage !== 100 && " (Must equal 100%)"}
            </div>

            <Button
              onClick={handleSavePercentages}
              className="w-full bg-primary hover:bg-primary/90 animate-glow"
              disabled={loading || totalPercentage !== 100}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-potli">Add New Potli</Label>
                <div className="flex gap-2">
                  <Input
                    id="new-potli"
                    value={newPotliName}
                    onChange={(e) => setNewPotliName(e.target.value)}
                    placeholder="Enter potli name..."
                  />
                  <Button onClick={handleAddPotli} disabled={loading}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Existing Potlis</Label>
                <div className="space-y-2">
                  {potlis.map((potli) => (
                    <div
                      key={potli.id}
                      className="flex items-center justify-between p-3 bg-card rounded-lg border"
                    >
                      <span className="font-medium">{potli.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeletePotli(potli.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSidebar;