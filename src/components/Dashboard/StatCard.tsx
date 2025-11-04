import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "gradient";
}

export function StatCard({ title, value, icon, trend, variant = "default" }: StatCardProps) {
  return (
    <Card 
      className={cn(
        "p-6",
        variant === "gradient" && "bg-gradient-to-br from-primary to-primary-hover text-primary-foreground border-0"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className={cn(
          "text-sm font-medium",
          variant === "gradient" ? "text-primary-foreground/80" : "text-muted-foreground"
        )}>
          {title}
        </h3>
        <div className={cn(
          "p-2 rounded-lg",
          variant === "gradient" ? "bg-white/10" : "bg-primary/10 text-primary"
        )}>
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold">{value}</p>
        {trend && (
          <p className={cn(
            "text-sm",
            variant === "gradient" 
              ? "text-primary-foreground/70" 
              : trend.isPositive 
                ? "text-success" 
                : "text-destructive"
          )}>
            {trend.value}
          </p>
        )}
      </div>
    </Card>
  );
}
