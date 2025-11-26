import { Card } from "@/components/ui/card";

const Help = () => {
  return (
    <Card className="p-6 texture-fabric">
      <h2 className="font-handwriting text-3xl text-primary mb-6">Help</h2>
      <p className="text-muted-foreground mb-4">
        Need assistance? We're here to help!
      </p>
      <div className="space-y-4 text-muted-foreground">
        <div>
          <h3 className="font-semibold text-foreground mb-2">Getting Started</h3>
          <p className="text-sm">Learn how to create potlis and manage your budget effectively.</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-2">Contact Support</h3>
          <p className="text-sm">Reach out to our support team for any questions or issues.</p>
        </div>
      </div>
    </Card>
  );
};

export default Help;
