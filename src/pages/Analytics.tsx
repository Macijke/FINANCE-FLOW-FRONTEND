import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import { StatCard } from "@/components/Dashboard/StatCard";

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Income"
          value="$3,300"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: "+8.2%", isPositive: true }}
        />
        <StatCard
          title="Total Expenses"
          value="$2,700"
          icon={<TrendingDown className="h-5 w-5" />}
          trend={{ value: "+3.1%", isPositive: false }}
        />
        <StatCard
          title="Net Income"
          value="$600"
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: "+15.4%", isPositive: true }}
        />
        <StatCard
          title="Savings Rate"
          value="18.2%"
          icon={<Percent className="h-5 w-5" />}
          trend={{ value: "+2.3%", isPositive: true }}
        />
      </div>

      <Card className="p-6">
        <p className="text-center text-muted-foreground py-12">
          Detailed analytics charts will appear here
        </p>
      </Card>
    </div>
  );
}
