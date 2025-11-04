import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Receipt, Wallet, BarChart3, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: LayoutDashboard },
  { name: "Trans.", href: "/transactions", icon: Receipt },
  { name: "Budget", href: "/budgets", icon: Wallet },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Goals", href: "/goals", icon: Target },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border z-50">
      <div className="flex justify-around">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-3 px-3 min-w-0 flex-1 transition-smooth",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
