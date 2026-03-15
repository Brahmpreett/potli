import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { type RealtimeChannel } from "@supabase/supabase-js";
import { format, parseISO, isToday, isYesterday } from "date-fns";
import { Filter, AlertCircle, CheckCircle2 } from "lucide-react";

interface Transaction {
  id: string;
  category_name: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  description: string | null;
  potlis?: {
    name: string;
    color: string;
  } | null;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(20);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const fetchTransactions = useCallback(async (currentLimit: number, isInitial = false) => {
    if (isInitial) setIsLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get total count first or in parallel
      const { count } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      setTotalCount(count || 0);

      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          type,
          description,
          created_at,
          potli_id,
          potlis (
            name,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(currentLimit);

      if (fetchError) throw fetchError;

      const mappedData: Transaction[] = (data || []).map(t => ({
        id: t.id,
        amount: t.amount,
        type: t.type as 'income' | 'expense',
        date: t.created_at || new Date().toISOString(),
        description: t.description,
        category_name: t.type === 'income' ? 'General' : ((t.potlis as unknown) as { name: string })?.name || 'Needs',
        potlis: t.potlis as unknown as { name: string; color: string }
      }));

      setTransactions(mappedData);
      setHasMore(mappedData.length < (count || 0));
    } catch (e) {
      const err = e as Error;
      console.error(err);
      setError(err.message || "Couldn't load transactions.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(20, true);

    // Real-time subscription
    let channel: RealtimeChannel | null = null;
    const setupSubscription = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        channel = supabase
            .channel('transaction-updates')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'transactions',
                    filter: `user_id=eq.${user.id}`
                },
                async (payload) => {
                    // When a new transaction is inserted, we re-fetch to get the join data (potli name)
                    // Prepending might miss the join data if we just use payload.new
                    fetchTransactions(limit);
                }
            )
            .subscribe();
    };

    setupSubscription();

    return () => {
        if (channel) supabase.removeChannel(channel);
    };
  }, [fetchTransactions, limit]);

  const loadMore = () => {
    const newLimit = limit + 20;
    setLimit(newLimit);
    fetchTransactions(newLimit);
  };

  const getDayLabel = (dateIso: string) => {
    const date = parseISO(dateIso);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d, yyyy");
  };

  // Group transactions
  const groupedTransactions = transactions.reduce((groups, t) => {
    const label = getDayLabel(t.date);
    if (!groups[label]) groups[label] = [];
    groups[label].push(t);
    return groups;
  }, {} as Record<string, Transaction[]>);

  if (isLoading && transactions.length === 0) {
    return <TransactionSkeleton />;
  }

  if (error && transactions.length === 0) {
    return (
      <div className="bg-[#D4614A]/10 border border-[#D4614A]/20 p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
        <AlertCircle className="w-10 h-10 text-[#D4614A]" />
        <div>
            <h3 className="text-[#D4614A] font-bold text-lg">Couldn't load transactions</h3>
            <p className="text-[#D4614A]/80 text-sm">Please check your connection and try again.</p>
        </div>
        <button 
            onClick={() => fetchTransactions(limit, true)}
            className="bg-[#D4614A] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#D4614A]/90 transition-colors"
        >
            Tap to retry
        </button>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-card w-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[300px] border border-border/50">
        <div className="w-16 h-16 mb-4 opacity-30 texture-fabric rounded-full flex items-center justify-center bg-[#F5A623]">
            <Filter className="w-8 h-8 text-black" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No transactions yet</h2>
        <p className="text-muted-foreground text-sm">When you add income or expenses, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2 px-2">
        <div>
            <h2 className="text-2xl font-bold">Transaction History</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{totalCount} total activities</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium border border-[#F5A623]/20 bg-card px-4 py-2 rounded-xl hover:bg-[#F5A623]/5 transition-colors shadow-sm">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {Object.entries(groupedTransactions).map(([dateLabel, dailyTransactions]) => (
          <div key={dateLabel} className="flex flex-col gap-4">
            <div className="flex items-center gap-4 px-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{dateLabel}</span>
              <div className="h-px bg-border/40 flex-1" />
            </div>

            <div className="flex flex-col gap-2.5">
              {dailyTransactions.map((t) => {
                const isExpense = t.type === 'expense';
                const timeStr = format(parseISO(t.date), "MMM d, yyyy • hh:mm a");
                const categoryColor = t.potlis?.color || (t.type === 'income' ? 'gold' : 'turmeric');
                
                return (
                  <div key={t.id} className="bg-card hover:border-[#F5A623]/30 transition-all w-full shadow-sm rounded-2xl p-4 md:p-5 border border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                    
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex flex-col gap-1.5">
                        <span className={`w-auto inline-flex px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider self-start
                          ${t.type === 'income' ? 'bg-[#6B8F5E]/10 text-[#6B8F5E]' : 'bg-[#F5A623]/10 text-[#8B5A00]'}
                        `}>
                          {t.category_name}
                        </span>
                        {t.description ? (
                          <span className="font-semibold text-foreground leading-tight">{t.description}</span>
                        ) : (
                          <span className="text-muted-foreground italic text-sm">{t.category_name}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-1">
                        <span className={`text-xl font-bold font-handwriting tracking-wide ${isExpense ? 'text-[#D4614A]' : 'text-[#6B8F5E]'}`}>
                            {isExpense ? '−' : '+'}₹{formatAmount(t.amount)}
                        </span>
                        <span className="text-[11px] text-muted-foreground/70">{timeStr}</span>
                    </div>
                    
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col items-center gap-4 mt-6 mb-8">
        {hasMore ? (
            <button 
                onClick={loadMore}
                className="text-sm font-bold border-2 border-[#F5A623]/30 text-[#8B5A00] px-8 py-3 rounded-2xl hover:bg-[#F5A623]/10 transition-all active:scale-95 shadow-sm"
            >
                Load More
            </button>
        ) : (
            <div className="flex items-center gap-2 text-muted-foreground/60 text-sm py-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>You're all caught up</span>
            </div>
        )}
      </div>
    </div>
  );
}

const TransactionSkeleton = () => (
    <div className="flex flex-col gap-6 w-full max-w-3xl animate-pulse px-2">
        <div className="flex justify-between items-end mb-4">
            <div className="h-8 w-48 bg-[#F5A623]/10 rounded-lg"></div>
            <div className="h-10 w-24 bg-[#F5A623]/5 rounded-xl"></div>
        </div>
        
        {[1, 2].map((group) => (
            <div key={group} className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-3 w-20 bg-muted/60 rounded"></div>
                    <div className="h-px bg-muted/40 flex-1"></div>
                </div>
                {[1, 2, 3].map((row) => (
                    <div key={row} className="h-24 bg-card/60 border border-border/30 rounded-2xl w-full flex items-center justify-between p-5">
                        <div className="flex flex-col gap-3">
                            <div className="h-4 w-16 bg-[#F5A623]/10 rounded"></div>
                            <div className="h-5 w-40 bg-muted/40 rounded"></div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className="h-7 w-24 bg-muted/60 rounded-lg"></div>
                            <div className="h-3 w-32 bg-muted/30 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        ))}
    </div>
);
