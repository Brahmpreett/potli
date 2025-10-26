import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Potli {
  id: string;
  name: string;
  balance: number;
  color: string;
}

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  potlis: Potli[];
  onAddExpense: (potliId: string, amount: number, description: string) => Promise<void>;
}

const AddExpenseModal = ({ open, onOpenChange, potlis, onAddExpense }: AddExpenseModalProps) => {
  const [selectedPotliId, setSelectedPotliId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (!selectedPotliId) {
      toast({
        title: "Select a Potli",
        description: "Please select which potli to spend from",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      });
      return;
    }

    const selectedPotli = potlis.find(p => p.id === selectedPotliId);
    if (selectedPotli && numAmount > selectedPotli.balance) {
      toast({
        title: "Insufficient Balance",
        description: `Not enough in ${selectedPotli.name} potli!`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onAddExpense(selectedPotliId, numAmount, description);
      setSelectedPotliId("");
      setAmount("");
      setDescription("");
      onOpenChange(false);
      toast({
        title: "Expense Added!",
        description: `₹${numAmount.toFixed(2)} spent from ${selectedPotli?.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense",
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
            Add Expense
          </DialogTitle>
          <DialogDescription>
            Select a potli and enter the amount you want to spend
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="potli">Select Potli</Label>
            <Select value={selectedPotliId} onValueChange={setSelectedPotliId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a potli..." />
              </SelectTrigger>
              <SelectContent>
                {potlis.map((potli) => (
                  <SelectItem key={potli.id} value={potli.id}>
                    {potli.name} (₹{potli.balance.toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-amount">Amount (₹)</Label>
            <Input
              id="expense-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-description">Description (Optional)</Label>
            <Input
              id="expense-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you buy?"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Expense"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;