import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const budgets = [
  { category: "Food & Dining", spent: 250, limit: 350, color: "bg-primary" },
  { category: "Transport", spent: 120, limit: 200, color: "bg-warning" },
  { category: "Entertainment", spent: 180, limit: 150, color: "bg-destructive" },
  { category: "Shopping", spent: 90, limit: 300, color: "bg-success" },
];

export default function Budgets() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Budgets</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Budget
        </Button>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="icon">←</Button>
        <h2 className="text-xl font-semibold">October 2025</h2>
        <Button variant="outline" size="icon">→</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100;
          const isOverBudget = percentage > 100;
          
          return (
            <Card key={budget.category} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{budget.category}</h3>
                  {isOverBudget && (
                    <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded">
                      Over Budget
                    </span>
                  )}
                </div>
                
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <p className="text-sm text-muted-foreground">
                      Spent: <span className="font-semibold text-foreground">${budget.spent}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Limit: <span className="font-semibold text-foreground">${budget.limit}</span>
                    </p>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-3"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {percentage.toFixed(0)}% of budget used
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
