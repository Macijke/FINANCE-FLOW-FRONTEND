import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const goals = [
  {
    id: 1,
    title: "Summer Vacation",
    target: 5000,
    current: 2500,
    deadline: "2026-07-01",
    daysLeft: 260,
  },
  {
    id: 2,
    title: "New Laptop",
    target: 2000,
    current: 1500,
    deadline: "2026-03-15",
    daysLeft: 152,
  },
  {
    id: 3,
    title: "Emergency Fund",
    target: 10000,
    current: 6000,
    deadline: "2026-12-31",
    daysLeft: 443,
  },
];

export default function Goals() {
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.current, 0);
  const overallProgress = (totalCurrent / totalTarget) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Savings Goals</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </div>

      <Card className="p-6 bg-gradient-to-br from-primary to-primary-hover text-primary-foreground border-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-foreground/80">Total Goal Amount</p>
              <p className="text-3xl font-bold">${totalTarget.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-primary-foreground/80">Current Savings</p>
              <p className="text-3xl font-bold">${totalCurrent.toLocaleString()}</p>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-primary-foreground/80">Overall Progress</p>
              <p className="text-sm font-semibold">{overallProgress.toFixed(0)}%</p>
            </div>
            <Progress value={overallProgress} className="h-3 bg-white/20" />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {goals.map((goal) => {
          const percentage = (goal.current / goal.target) * 100;
          const remaining = goal.target - goal.current;
          const monthlyNeeded = remaining / (goal.daysLeft / 30);

          return (
            <Card key={goal.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-xl">{goal.title}</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Target</p>
                    <p className="font-semibold">${goal.target.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current</p>
                    <p className="font-semibold">${goal.current.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Deadline</p>
                    <p className="font-semibold">{new Date(goal.deadline).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Days Left</p>
                    <p className="font-semibold">{goal.daysLeft} days</p>
                  </div>
                </div>

                <div>
                  <Progress value={percentage} className="h-3 mb-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{percentage.toFixed(0)}% complete</span>
                    <span>${remaining.toLocaleString()} remaining</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Monthly needed: <span className="font-semibold text-foreground">${monthlyNeeded.toFixed(2)}</span> to reach deadline
                  </p>
                </div>

                <Button variant="outline" className="w-full">
                  Add Contribution
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
