import { Card } from "@/components/ui/card";

const Notifications = () => {
  return (
    <Card className="p-6 texture-fabric">
      <h2 className="font-handwriting text-3xl text-primary mb-6">Notifications</h2>
      <p className="text-muted-foreground">
        Manage your notification preferences and alerts.
      </p>
    </Card>
  );
};

export default Notifications;
