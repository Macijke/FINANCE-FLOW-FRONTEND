import {Target, TrendingDown, TrendingUp, Wallet} from "lucide-react";
import {StatCard} from "@/components/Dashboard/StatCard";
import {RecentTransactions} from "@/components/Dashboard/RecentTransactions";
import {SpendingChart} from "@/components/Dashboard/SpendingChart";
import {MonthlyTrend} from "@/components/Dashboard/MonthlyTrend";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import {getApiUrl} from "@/config/api.ts";

export default function Dashboard() {
    const currentDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const [cookies] = useCookies(["user"]);
    const [summary, setSummary] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUserProfile = async () => {
        try {
            const response = await fetch(getApiUrl(`/users/profile`), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cookies.user}`,
                },
            });
            const data = await response.json();
            setUserProfile(data.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }

    const getDashboardSummary = async () => {
        try {
            const response = await fetch(getApiUrl(`/analytics/summary`), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cookies.user}`,
                },
            });
            const data = await response.json();
            setSummary(data.data);
        } catch (error) {
            console.error("Error fetching summary:", error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([
                getDashboardSummary(),
                getUserProfile()
            ]);
            setLoading(false);
        };

        if (cookies.user) {
            fetchData();
        }
    }, [cookies.user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="relative">
                    <Wallet className="h-20 w-20 text-blue-600 animate-pulse" />
                    <div className="absolute inset-0 rounded-full bg-blue-600/20 animate-ping"></div>
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        Finance Flow
                    </h2>
                    <p className="text-sm text-muted-foreground animate-pulse">
                        Loading your financial dashboard...
                    </p>
                </div>

                <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 animate-loading-bar"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in px-4 sm:px-0">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    Welcome Back, {userProfile?.firstName || 'User'}!
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">Today is {currentDate}</p>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total Balance"
                    value={summary?.totalBalance ? `$${summary.totalBalance.toFixed(2)}` : "$0.00"}
                    icon={<Wallet className="h-5 w-5"/>}
                    variant="gradient"
                />
                <StatCard
                    title="This Month Income"
                    value={summary?.totalIncome ? `$${summary.totalIncome.toFixed(2)}` : "$0.00"}
                    icon={<TrendingUp className="h-5 w-5"/>}
                    variant="green"
                />
                <StatCard
                    title="This Month Spent"
                    value={summary?.totalExpenses ? `$${summary.totalExpenses.toFixed(2)}` : "$0.00"}
                    icon={<TrendingDown className="h-5 w-5"/>}
                    variant="red"
                />
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
                <SpendingChart/>
                <MonthlyTrend/>
            </div>

            <RecentTransactions/>
        </div>
    );
}
