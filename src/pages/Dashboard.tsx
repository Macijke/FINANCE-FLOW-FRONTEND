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
    const [summary, setSummary] = useState([]);
    const [userProfile, setUserProfile] = useState([]);

    const getUserProfile = async () => {
        const response = await fetch(getApiUrl(`/users/profile`), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.user}`,
            },
        });
        const data = await response.json();
        setUserProfile(data.data);
    }

    const getDashboardSummary = async () => {
        const response = await fetch(getApiUrl(`/analytics/summary`), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.user}`,
            },
        });
        const data = await response.json();
        setSummary(data.data);
    }

    useEffect(() => {
        getDashboardSummary();
        getUserProfile();
    }, [cookies.user]);
    

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold mb-2">Welcome Back, {userProfile.firstName}!</h1>
                <p className="text-muted-foreground">Today is {currentDate}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total Balance"
                    value={"$ " + summary.totalBalance}
                    icon={<Wallet className="h-5 w-5"/>}
                    variant="gradient"
                />
                <StatCard
                    title="This Month Income"
                    value={"$ " + summary.totalIncome}
                    icon={<TrendingUp className="h-5 w-5"/>}
                    variant="green"
                />
                <StatCard
                    title="This Month Spent"
                    value={"$ " + summary.totalExpenses}
                    icon={<TrendingDown className="h-5 w-5"/>}
                    variant="red"

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
