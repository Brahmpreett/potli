import { Card } from "@/components/ui/card";

const Preferences = () => {
  return (
    <Card className="p-6 texture-fabric">
      <h2 className="font-handwriting text-3xl text-primary mb-6">Preferences</h2>
      <p className="text-muted-foreground">
        Customize your app preferences and settings here.
      </p>
    </Card>
  );
};

export default Preferences;
