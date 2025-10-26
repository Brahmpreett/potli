import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddIncomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddIncome: (amount: number, description: string) => Promise<void>;
}

const AddIncomeModal = ({ open, onOpenChange, onAddIncome }: AddIncomeModalProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onAddIncome(numAmount, description);
      setAmount("");
      setDescription("");
      onOpenChange(false);
      toast({
        title: "Income Added!",
        description: `₹${numAmount.toFixed(2)} has been distributed to your potlis`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add income",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-handwriting text-3xl text-primary">
            Add Income
          </DialogTitle>
          <DialogDescription>
            Your income will be automatically distributed to your potlis based on their percentages
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Salary, bonus, etc."
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 animate-glow"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Income"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddIncomeModal;