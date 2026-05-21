import { ArrowRight, Coins, Wallet, PieChart } from "lucide-react";

export default function AboutSection() {
  return (
    <div className="flex flex-col gap-16 w-full max-w-3xl py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HERO SECTION */}
      <section className="text-center flex flex-col items-center gap-4">
        <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-4 shadow-sm border border-primary/20">
            <span className="font-handwriting text-6xl text-primary font-bold">P</span>
        </div>
        <h1 className="font-handwriting text-6xl md:text-7xl font-bold text-primary">Potli</h1>
        <p className="text-xl md:text-2xl font-medium text-muted-foreground italic">"Spend guilt-free"</p>
        <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold tracking-widest uppercase border border-primary/20">Beta v1.0</span>
      </section>

      {/* STORY SECTION */}
      <section className="bg-card/40 backdrop-blur-sm p-8 md:p-12 rounded-[2.5rem] border border-border/50 shadow-sm flex flex-col gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <h2 className="text-3xl font-bold text-primary">Why Potli?</h2>
        <div className="flex flex-col gap-6 text-lg text-foreground/80 leading-relaxed font-medium">
          <p>
            Growing up, I watched my grandparents manage every rupee with 
            impressive clarity and discipline. Whenever they received cash, 
            they would divide it into different pouches — or potlis — each 
            for a specific purpose: needs, wants, savings, emergencies, 
            and donations.
          </p>
          <p>
            I wanted to bring that same timeless wisdom into the digital age. 
            Potli is that idea — simple, intentional, and rooted in the way 
            money was always meant to be managed.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-primary text-center md:text-left px-4">How Potli Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepCard 
            icon={<Coins className="w-8 h-8" />}
            title="Add Your Income"
            description="Tell Potli how much you earned this session."
            step="1"
          />
          <StepCard 
            icon={<Wallet className="w-8 h-8" />}
            title="Split Into Potlis"
            description="Your money is divided automatically based on your custom allocations."
            step="2"
          />
          <StepCard 
            icon={<PieChart className="w-8 h-8" />}
            title="Spend Mindfully"
            description="Check your potli before spending. If it's empty, you know to wait."
            step="3"
          />
        </div>
      </section>

      {/* BUILT BY SECTION */}
      <section className="text-center flex flex-col items-center gap-6 mt-8">
        <div className="w-20 h-px bg-primary/30" />
        <div className="flex flex-col gap-1">
            <p className="text-muted-foreground text-sm font-medium">Crafted with passion by</p>
            <p className="text-xl font-bold text-foreground">Brahmpreet Singh</p>
        </div>
        <p className="text-primary font-handwriting text-2xl">"Solving one rupee at a time."</p>
      </section>

    </div>
  );
}

const StepCard = ({ icon, title, description, step }: { icon: React.ReactNode, title: string, description: string, step: string }) => (
    <div className="bg-card border border-border/50 p-8 rounded-3xl flex flex-col gap-5 hover:border-primary/30 transition-all group relative">
        <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold border border-primary/20 backdrop-blur-sm">
            {step}
        </div>
        <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground leading-snug font-medium">{description}</p>
        </div>
    </div>
);
