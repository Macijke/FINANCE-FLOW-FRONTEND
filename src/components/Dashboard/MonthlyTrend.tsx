import {Card} from "@/components/ui/card";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";

export function MonthlyTrend() {
    const [cookies] = useCookies(["user"]);
    const [monthlyTrends, setmonthlyTrends] = useState([]);

    const getMonthlyTrends = async () => {
        const response = await fetch(`http://localhost:8080/api/v1/analytics/monthly-trends`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.user}`,
            },
        });
        const data = await response.json();
        setmonthlyTrends(data.data);
    }

    useEffect(() => {
        getMonthlyTrends();
    }, [cookies.user]);

    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Monthly Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border"/>
                    <XAxis
                        dataKey="month"
                        className="text-sm"
                        tick={{fill: "hsl(var(--muted-foreground))"}}
                    />
                    <YAxis
                        className="text-sm"
                        tick={{fill: "hsl(var(--muted-foreground))"}}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                        }}
                    />
                    <Legend/>
                    <Line
                        type="monotone"
                        dataKey="income"
                        stroke="hsl(var(--success))"
                        strokeWidth={2}
                        dot={{fill: "hsl(var(--success))", r: 4}}
                        activeDot={{r: 6}}
                    />
                    <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={2}
                        dot={{fill: "hsl(var(--destructive))", r: 4}}
                        activeDot={{r: 6}}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}
