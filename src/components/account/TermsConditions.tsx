import { Card } from "@/components/ui/card";

const TermsConditions = () => {
  return (
    <Card className="p-6 texture-fabric">
      <h2 className="font-handwriting text-3xl text-primary mb-6">Terms & Conditions</h2>
      <div className="prose prose-sm max-w-none text-muted-foreground">
        <p className="mb-4">
          Welcome to Potli. By using this application, you agree to these terms and conditions.
        </p>
        <p>
          Please review our terms carefully before continuing to use the service.
        </p>
      </div>
    </Card>
  );
};

export default TermsConditions;
