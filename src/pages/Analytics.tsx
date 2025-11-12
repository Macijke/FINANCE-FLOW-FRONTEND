import {Card} from "@/components/ui/card";
import {AlertTriangle, CheckCircle, DollarSign, Info, TrendingDown, TrendingUp, Wallet} from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import {useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import {getApiUrl} from "@/config/api.ts";

export default function Analytics() {
    const [cookies] = useCookies(["user"]);
    const [analytics, setAnalytics] = useState(null);
    const [monthlyTrends, setMonthlyTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await fetch(getApiUrl(`/analytics`), {
                headers: {
                    "Authorization": `Bearer ${cookies.user}`,
                },
            });
            const data = await response.json();
            setAnalytics(data.data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMonthlyTrends = async () => {
        try {
            const response = await fetch(getApiUrl(`/analytics/monthly-trends`), {
                headers: {
                    "Authorization": `Bearer ${cookies.user}`,
                },
            });
            const data = await response.json();
            setMonthlyTrends(data.data);
        } catch (error) {
            console.error("Error fetching monthly trends:", error);
        }
    }

    useEffect(() => {
        if (cookies.user) {
            fetchAnalytics();
            fetchMonthlyTrends();
        }
    }, [cookies.user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const {summary, categoryBreakdowns, budgetOverview, insights} = analytics || {};

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Analytics</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {summary?.periodStart} - {summary?.periodEnd}
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium opacity-90">Total Balance</h3>
                        <Wallet className="h-5 w-5"/>
                    </div>
                    <p className="text-3xl font-bold">
                        ${summary?.totalBalance?.toFixed(2) || "0.00"}
                    </p>
                    <p className="text-xs opacity-75 mt-1">All-time balance</p>
                </Card>

                <Card className="p-6 bg-green-50 border-green-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-green-800">Income</h3>
                        <TrendingUp className="h-5 w-5 text-green-600"/>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                        ${summary?.totalIncome?.toFixed(2) || "0.00"}
                    </p>
                    <p className="text-xs text-green-600/70 mt-1">This period</p>
                </Card>

                <Card className="p-6 bg-red-50 border-red-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-red-800">Expenses</h3>
                        <TrendingDown className="h-5 w-5 text-red-600"/>
                    </div>
                    <p className="text-2xl font-bold text-red-600">
                        ${summary?.totalExpenses?.toFixed(2) || "0.00"}
                    </p>
                    <p className="text-xs text-red-600/70 mt-1">This period</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Net Balance</h3>
                        <DollarSign className="h-5 w-5 text-gray-600"/>
                    </div>
                    <p className={`text-2xl font-bold ${summary?.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${summary?.netBalance?.toFixed(2) || "0.00"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Savings: {summary?.savingsRate?.toFixed(1)}%
                    </p>
                </Card>
            </div>

            {/* Insights - PRZEPROJEKTOWANE */}
            {insights && insights.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {insights.map((insight, index) => {
                        const isWarning = insight.severity === 'WARNING';
                        const isCritical = insight.severity === 'CRITICAL';
                        const isInfo = insight.severity === 'INFO';

                        return (
                            <Card
                                key={index}
                                className={`p-5 border-l-4 ${
                                    isCritical
                                        ? 'border-l-red-500 bg-red-50/50'
                                        : isWarning
                                            ? 'border-l-yellow-500 bg-yellow-50/50'
                                            : 'border-l-blue-500 bg-blue-50/50'
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${
                                        isCritical
                                            ? 'bg-red-100'
                                            : isWarning
                                                ? 'bg-yellow-100'
                                                : 'bg-blue-100'
                                    }`}>
                                        {isCritical ? (
                                            <AlertTriangle className="h-5 w-5 text-red-600"/>
                                        ) : isWarning ? (
                                            <AlertTriangle className="h-5 w-5 text-yellow-600"/>
                                        ) : (
                                            <Info className="h-5 w-5 text-blue-600"/>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold uppercase tracking-wide ${
                          isCritical
                              ? 'text-red-700'
                              : isWarning
                                  ? 'text-yellow-700'
                                  : 'text-blue-700'
                      }`}>
                        {insight.type.replace('_', ' ')}
                      </span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 leading-snug">
                                            {insight.message}
                                        </p>
                                        {insight.metadata && (
                                            <div className="mt-2 pt-2 border-t border-gray-200">
                                                {insight.type === 'TOP_CATEGORY' && (
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-gray-600">Amount spent</span>
                                                        <span className="font-semibold text-gray-900">
                              ${insight.metadata.amount.toFixed(2)}
                            </span>
                                                    </div>
                                                )}
                                                {insight.type === 'BUDGET_ALERT' && (
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-gray-600">Utilization</span>
                                                        <span className="font-semibold text-gray-900">
                              {insight.metadata.utilizationRate?.toFixed(1)}%
                            </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Charts Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Pie Chart */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Spending by Category</h2>
                    {categoryBreakdowns && categoryBreakdowns.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryBreakdowns}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    dataKey="amount"
                                    label={({categoryName, percentage}) =>
                                        `${categoryName}: ${percentage.toFixed(1)}%`
                                    }
                                >
                                    {categoryBreakdowns.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.categoryColor}/>
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => `$${value.toFixed(2)}`}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-muted-foreground py-12">No spending data</p>
                    )}
                </Card>

                {/* Budget Overview */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-6">Budget Overview</h2>
                    {budgetOverview && budgetOverview.budgetStatuses?.length > 0 ? (
                        <div className="space-y-5">
                            {/* Total Budget Progress */}
                            <div className="space-y-2 pb-4 border-b">
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold">Total Budget</span>
                                    <span className="text-muted-foreground font-medium">
                    ${budgetOverview.totalSpent.toFixed(2)} / ${budgetOverview.totalBudget.toFixed(2)}
                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all ${
                                            budgetOverview.utilizationRate >= 100
                                                ? 'bg-red-500'
                                                : budgetOverview.utilizationRate >= 80
                                                    ? 'bg-yellow-500'
                                                    : 'bg-green-500'
                                        }`}
                                        style={{width: `${Math.min(budgetOverview.utilizationRate, 100)}%`}}
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                  <span className={`text-xs font-medium ${
                      budgetOverview.utilizationRate >= 100
                          ? 'text-red-600'
                          : budgetOverview.utilizationRate >= 80
                              ? 'text-yellow-600'
                              : 'text-green-600'
                  }`}>
                    {budgetOverview.utilizationRate.toFixed(1)}% used
                  </span>
                                    <span className="text-xs text-muted-foreground">
                    ${budgetOverview.remaining.toFixed(2)} remaining
                  </span>
                                </div>
                            </div>

                            {/* Individual Budgets */}
                            <div className="space-y-4">
                                {budgetOverview.budgetStatuses.map((budget) => (
                                    <div key={budget.budgetId} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {budget.status === 'EXCEEDED' ? (
                                                    <AlertTriangle className="h-4 w-4 text-red-500"/>
                                                ) : budget.status === 'WARNING' ? (
                                                    <AlertTriangle className="h-4 w-4 text-yellow-500"/>
                                                ) : (
                                                    <CheckCircle className="h-4 w-4 text-green-500"/>
                                                )}
                                                <span className="text-sm font-medium">{budget.categoryName}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                        ${budget.spent.toFixed(2)} / ${budget.budgetLimit.toFixed(2)}
                      </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${
                                                    budget.status === 'EXCEEDED'
                                                        ? 'bg-red-500'
                                                        : budget.status === 'WARNING'
                                                            ? 'bg-yellow-500'
                                                            : 'bg-green-500'
                                                }`}
                                                style={{width: `${Math.min(budget.utilizationRate, 100)}%`}}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs">
                      <span className={`font-medium ${
                          budget.status === 'EXCEEDED'
                              ? 'text-red-600'
                              : budget.status === 'WARNING'
                                  ? 'text-yellow-600'
                                  : 'text-green-600'
                      }`}>
                        {budget.utilizationRate.toFixed(1)}%
                      </span>
                                            <span className="text-muted-foreground">
                        ${Math.abs(budget.remaining).toFixed(2)} {budget.remaining < 0 ? 'over' : 'left'}
                      </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                            <p className="mb-2">No budgets set for this period</p>
                            <button
                                className="mt-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors">
                                Create Budget
                            </button>
                        </div>
                    )}
                </Card>
            </div>

            {/* Monthly Trends - UŻYWAM monthlyTrends Z ENDPOINTA */}
            {monthlyTrends && monthlyTrends.length > 0 && (
                <Card className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Monthly Trends</h2>
                        <span className="text-sm text-muted-foreground">
              Last {monthlyTrends.length} months
            </span>
                    </div>
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={monthlyTrends}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                                </linearGradient>
                                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200"/>
                            <XAxis
                                dataKey="month"
                                className="text-xs"
                                tickFormatter={(value) => {
                                    const [year, month] = value.split("-");
                                    return new Date(year, month - 1).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "2-digit"
                                    });
                                }}
                            />
                            <YAxis className="text-xs"/>
                            <Tooltip
                                formatter={(value) => `$${value.toFixed(2)}`}
                                labelFormatter={(label) => {
                                    const [year, month] = label.split("-");
                                    return new Date(year, month - 1).toLocaleDateString("en-US", {
                                        month: "long",
                                        year: "numeric"
                                    });
                                }}
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Legend/>
                            <Area
                                type="monotone"
                                dataKey="income"
                                stroke="#10b981"
                                strokeWidth={2}
                                fill="url(#colorIncome)"
                                name="Income"
                            />
                            <Area
                                type="monotone"
                                dataKey="expenses"
                                stroke="#ef4444"
                                strokeWidth={2}
                                fill="url(#colorExpenses)"
                                name="Expenses"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>
            )}

            {/* Category Details Table */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Category Details</h2>
                {categoryBreakdowns && categoryBreakdowns.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Category</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Amount</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Share</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Transactions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {categoryBreakdowns.map((cat) => (
                                <tr key={cat.categoryId}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{cat.categoryIcon}</span>
                                            <span className="font-medium text-gray-900">{cat.categoryName}</span>
                                        </div>
                                    </td>
                                    <td className="text-right py-4 px-4 font-semibold text-gray-900">
                                        ${cat.amount.toFixed(2)}
                                    </td>
                                    <td className="text-right py-4 px-4">
                                        <div className="flex items-center justify-end gap-3">
                                            <div className="w-20 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full transition-all"
                                                    style={{
                                                        width: `${cat.percentage}%`,
                                                        backgroundColor: cat.categoryColor,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 min-w-[50px]">
                          {cat.percentage.toFixed(1)}%
                        </span>
                                        </div>
                                    </td>
                                    <td className="text-right py-4 px-4 text-gray-600 font-medium">
                                        {cat.transactionCount}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No category data available</p>
                )}
            </Card>
        </div>
    );
}
