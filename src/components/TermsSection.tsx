export default function TermsSection() {
  const sections = [
    { title: "1. Acceptance of Terms", content: "By accessing or using Potli, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this app." },
    { title: "2. Use of the App", content: "Potli is provided for personal, non-commercial use only. You agree not to use the app for any illegal or unauthorized purpose. You are responsible for maintaining the security of your account." },
    { title: "3. Data & Privacy", content: "Your data is stored securely using industry-standard encryption. We do not sell your personal financial data to third parties. We use your data solely to provide and improve the Potli experience." },
    { title: "4. No Financial Advice", content: "Potli is a personal budgeting tool and does not constitute financial advice. The calculations and suggestions provided are for informational purposes only. Consult with a qualified professional for financial decisions.", important: true },
    { title: "5. User Responsibilities", content: "You are responsible for the accuracy of the data you enter. Potli is not liable for any financial decisions made based on the information provided in the app." },
    { title: "6. Intellectual Property", content: "The Potli name, logo, and design are the intellectual property of Brahmpreet Singh. You may not reproduce, distribute, or create derivative works without express permission." },
    { title: "7. Limitation of Liability", content: "Potli and its creators shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the service." },
    { title: "8. Changes to Terms", content: "We reserve the right to modify these terms at any time. We will notify users of any significant changes. Continued use of the app constitutes acceptance of the new terms." },
    { title: "9. Contact", content: "If you have any questions about these Terms, please contact us at support@potli.app" }
  ];

  return (
    <div className="flex flex-col gap-10 w-full max-w-3xl py-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">Terms & Conditions</h2>
        <p className="text-sm text-muted-foreground font-medium italic">Last updated: March 2026</p>
      </div>

      <div className="flex flex-col gap-6">
        {sections.map((s, i) => (
          <div key={i} className={`bg-card/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border ${s.important ? 'border-primary/40 bg-primary/5 shadow-sm' : 'border-border/50'} flex flex-col gap-3 transition-colors`}>
            <h3 className={`text-lg font-bold ${s.important ? 'text-primary' : 'text-foreground'}`}>
              {s.title}
            </h3>
            <p className="text-base text-foreground/80 leading-relaxed font-medium">
              {s.content}
            </p>
            {s.important && (
              <div className="bg-primary/10 text-primary self-start px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-primary/20 mt-2">
                Important Disclaimer
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="h-px bg-border/40 w-full mt-4" />
      
      <p className="text-center text-muted-foreground text-sm font-medium">
          Thank you for choosing Potli for your intentional spending journey.
      </p>
    </div>
  );
}
