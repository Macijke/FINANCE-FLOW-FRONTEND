import {Card} from "@/components/ui/card";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

const data = [
    {month: "May", income: 2800, expenses: 2200},
    {month: "Jun", income: 3200, expenses: 2400},
    {month: "Jul", income: 2900, expenses: 2600},
    {month: "Aug", income: 3400, expenses: 2300},
    {month: "Sep", income: 3100, expenses: 2500},
    {month: "Oct", income: 3300, expenses: 2700},
];

export function MonthlyTrend() {
    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Monthly Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
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
