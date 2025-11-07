import {Card} from "@/components/ui/card";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";

const data = [
    {name: "Food & Dining", value: 35, color: "#5B7FFF"},
    {name: "Transport", value: 20, color: "#10B981"},
    {name: "Entertainment", value: 15, color: "#F59E0B"},
    {name: "Shopping", value: 18, color: "#EF4444"},
    {name: "Other", value: 12, color: "#9CA3AF"},
];

export function SpendingChart() {
    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Spending by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color}/>
                        ))}
                    </Pie>
                    <Tooltip/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
}
