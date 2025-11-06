import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {cn} from "@/lib/utils";

export default function Budgets() {
    const [cookies] = useCookies(["user"]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const fetchBudgets = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/v1/budgets', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${cookies.user}`,
                },
            });

            const data = await response.json();
            console.log("Budget data:", data); // DEBUG
            const bgts = data.data || [];
            setBudgets(bgts);
            return data;
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, [cookies.user]);

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const monthYear = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    const getProgressColor = (percentage: number) => {
        if (percentage > 100) return "bg-red-500";
        if (percentage > 80) return "bg-yellow-500";
        return "bg-green-500";
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold">Budgets</h1>
                <Card className="p-6 text-center">
                    <p>Loading budgets...</p>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold">Budgets</h1>
                <Card className="p-6 text-center text-destructive">
                    <p>Error: {error}</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Budgets</h1>
                <Button className="gap-2">
                    <Plus className="h-4 w-4"/>
                    Add Budget
                </Button>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-center gap-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousMonth}
                >
                    ←
                </Button>
                <h2 className="text-lg font-semibold min-w-40 text-center">{monthYear}</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextMonth}
                >
                    →
                </Button>
            </div>

            {/* Budgets Grid */}
            {budgets.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No budgets yet. Create one to get started!</p>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {budgets.map((budget) => {
                        const percentage = budget.percentageUsed || 0;
                        const isOverBudget = percentage > 100;
                        const progressColor = getProgressColor(percentage);
                        const icon = budget.categoryIcon;

                        return (
                            <Card
                                key={budget.id}
                                className={cn(
                                    "p-4 transition-all hover:shadow-lg",
                                    isOverBudget && "border-red-500/30 bg-red-500/5"
                                )}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{icon}</span>
                                        <h3 className="font-semibold">{budget.categoryName}</h3>
                                        {isOverBudget && <span className="text-xs bg-red-500/20 text-red-600 px-2 py-1 rounded">Over</span>}
                                    </div>

                                    <div className="text-sm space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Spent:</span>
                                            <span className="font-semibold">${budget.spentAmount?.toFixed(2) || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Limit:</span>
                                            <span className="font-semibold">${budget.limitAmount?.toFixed(2) || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Remaining:</span>
                                            <span className={cn(
                                                "font-semibold",
                                                isOverBudget ? "text-red-600" : "text-green-600"
                                            )}>
                                                {isOverBudget ? "-" : "+"}${Math.abs(budget.remainingAmount || 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span>{percentage.toFixed(0)}% Used</span>
                                            {isOverBudget && <span className="text-red-600 font-semibold">⚠️ Over Budget</span>}
                                        </div>
                                        <div className="w-full bg-muted rounded-full overflow-hidden h-2">
                                            <div
                                                className={cn("h-full transition-all", progressColor)}
                                                style={{width: `${Math.min(percentage, 100)}%`}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
