import {Target, TrendingDown, Wallet} from "lucide-react";
import {StatCard} from "@/components/Dashboard/StatCard";
import {RecentTransactions} from "@/components/Dashboard/RecentTransactions";
import {SpendingChart} from "@/components/Dashboard/SpendingChart";
import {MonthlyTrend} from "@/components/Dashboard/MonthlyTrend";
import {useCookies} from "react-cookie";

export default function Dashboard() {
    const currentDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const [cookies] = useCookies(["user"]);

    const getFullName = async () => {
        const response = await fetch("http://localhost:8080/api/v1/users/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.user}`,
            },
        });
        const data = await response.json();
        return data.fullName;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold mb-2">Welcome Back, John!</h1>
                <p className="text-muted-foreground">Today is {currentDate}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total Balance"
                    value="$12,450"
                    icon={<Wallet className="h-5 w-5"/>}
                    trend={{value: "+12.5% from last month", isPositive: true}}
                    variant="gradient"
                />
                <StatCard
                    title="This Month Spent"
                    value="$1,240"
                    icon={<TrendingDown className="h-5 w-5"/>}
                    trend={{value: "-5.2% from last month", isPositive: true}}
                />
                <StatCard
                    title="Savings Goal"
                    value="45%"
                    icon={<Target className="h-5 w-5"/>}
                    trend={{value: "On track", isPositive: true}}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <SpendingChart/>
                <MonthlyTrend/>
            </div>

            <RecentTransactions/>
        </div>
    );
}
