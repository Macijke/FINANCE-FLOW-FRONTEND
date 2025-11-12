import {Card} from "@/components/ui/card";
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import {getApiUrl} from "@/config/api.ts";

export function SpendingChart() {

    const [cookies] = useCookies(["user"]);
    const [categoryBreakdown, setCategoryBreakdown] = useState([]);

    const getCategoryBreakdown = async () => {
        const response = await fetch(getApiUrl(`/analytics/category-breakdown`), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.user}`,
            },
        });
        const data = await response.json();
        setCategoryBreakdown(data.data);
    }

    useEffect(() => {
        getCategoryBreakdown();
    }, [cookies.user]);

    const renderCustomLabel = ({cx, cy, midAngle, innerRadius, outerRadius, categoryName, percentage}) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                className="text-sm font-semibold"
            >
                {`${percentage.toFixed(1)}%`}
            </text>
        );
    };

    const CustomTooltip = ({active, payload}) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
                    <p className="font-semibold text-gray-800">
                        {data.categoryIcon} {data.categoryName}
                    </p>
                    <p className="text-sm text-gray-600">
                        Amount: ${data.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                        Percentage: {data.percentage.toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-600">
                        Transactions: {data.transactionCount}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Spending by Category</h2>
            {categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={categoryBreakdown}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            dataKey="amount"
                            nameKey="categoryName"
                            label={renderCustomLabel}
                        >
                            {categoryBreakdown.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.categoryColor}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip/>}/>
                        <Legend
                            formatter={(value, entry) => {
                                const data = entry.payload;
                                return `${data.categoryIcon} ${data.categoryName}`;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                    No spending data available
                </div>
            )}
        </Card>
    );
}
