import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Coffee, Briefcase, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: 1,
    description: "Coffee Shop",
    category: "Food & Dining",
    amount: -5.50,
    date: "2025-10-30",
    time: "18:45",
    icon: Coffee,
  },
  {
    id: 2,
    description: "Salary Deposit",
    category: "Income",
    amount: 2500,
    date: "2025-10-30",
    time: "09:00",
    icon: Briefcase,
  },
  {
    id: 3,
    description: "Gym Subscription",
    category: "Health",
    amount: -50,
    date: "2025-10-29",
    time: "14:20",
    icon: Dumbbell,
  },
];

export function RecentTransactions() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => {
          const Icon = transaction.icon;
          const isIncome = transaction.amount > 0;
          
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2 rounded-lg",
                  isIncome ? "bg-success/10 text-success" : "bg-gray-100 dark:bg-gray-800 text-foreground"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  "font-semibold flex items-center gap-1",
                  isIncome ? "text-success" : "text-destructive"
                )}>
                  {isIncome ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {isIncome ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.date} {transaction.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
