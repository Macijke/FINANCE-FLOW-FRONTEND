import {Edit, Plus, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {cn} from "@/lib/utils.ts";
import {GoalDialog} from "@/components/Dialog/GoalDialog.tsx";
import {ContributeDialog} from "@/components/Dialog/ContributeDialog.tsx";

export default function Goals() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [goals, setGoals] = useState([]);
    const [cookies] = useCookies(['user']);
    const [editingGoal, setEditingGoal] = useState(null);

    const fetchSavingsGoals = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/v1/savings-goals', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${cookies.user}`,
                },
            });

            const data = await response.json();
            const gls = data.data || [];
            setGoals(gls);
            return data;
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavingsGoals();
    }, [cookies.user]);

    const onGoalAdded = () => {
        fetchSavingsGoals();
        setEditingGoal(null);
    }

    const handleDeleteGoal = async (goalId: number) => {
        if (!confirm("Are you sure you want to delete this goal?")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/v1/savings-goals/${goalId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${cookies.user}`,
                },
            });

            if (response.ok) {
                fetchSavingsGoals();
            }
        } catch (err) {
            console.error('Error deleting goal:', err);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold">Savings Goals</h1>
                <Card className="p-6 text-center">
                    <p>Loading goals...</p>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold">Savings Goals</h1>
                <Card className="p-6 text-center text-destructive">
                    <p>Error: {error}</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Savings Goals</h1>
                <GoalDialog onGoalAdded={onGoalAdded}>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4"/>
                        Add Goal
                    </Button>
                </GoalDialog>
            </div>

            {goals.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No savings goals yet. Create one to get started!</p>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {goals.map((goal) => {
                        const percentage = goal.percentageCompleted || 0;
                        const todayDate = new Date();
                        const daysLeft = goal.targetDate
                            ? Math.max(0, Math.ceil((new Date(goal.targetDate).getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)))
                            : Infinity;
                        const monthsLeft = daysLeft / 30;
                        const monthlyNeeded = monthsLeft > 0 ? goal.remainingAmount / monthsLeft : 0;
                        const isCompleted = goal.isCompleted;
                        const isUrgent = daysLeft < 30 && !isCompleted;

                        return (
                            <Card
                                key={goal.id}
                                className={cn(
                                    "p-6 transition-all hover:shadow-lg",
                                    isCompleted && "border-green-500/30 bg-green-500/5"
                                )}
                            >
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div
                                                className="p-2 rounded-lg text-2xl flex-shrink-0"
                                                style={{backgroundColor: goal.color}}
                                            >
                                                {goal.icon}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-extrabold text-3xl truncate">{goal.name}</h3>
                                                {isCompleted && (
                                                    <span
                                                        className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">
                                                        ✓ Completed
                                                    </span>
                                                )}
                                                {isUrgent && (
                                                    <span
                                                        className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded">
                                                        ⚠️ Urgent
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-1 flex-shrink-0">
                                            <GoalDialog
                                                onGoalAdded={onGoalAdded}
                                                editGoal={goal}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit className="h-4 w-4"/>
                                                </Button>
                                            </GoalDialog>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => handleDeleteGoal(goal.id)}
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>

                                    {goal.description && (
                                        <p className="text-sm text-muted-foreground">
                                            {goal.description}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="bg-muted/40 rounded-lg p-2">
                                            <p className="text-xs text-muted-foreground mb-1">Target</p>
                                            <p className="font-semibold text-base">${goal.targetAmount?.toLocaleString() || 0}</p>
                                        </div>
                                        <div className="bg-muted/40 rounded-lg p-2">
                                            <p className="text-xs text-muted-foreground mb-1">Current</p>
                                            <p className="font-semibold text-base text-green-600">${goal.currentAmount?.toLocaleString() || 0}</p>
                                        </div>
                                        <div className="bg-muted/40 rounded-lg p-2">
                                            <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                                            <p className="font-semibold text-sm">
                                                {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }) : 'N/A'}
                                            </p>
                                        </div>
                                        <div className="bg-muted/40 rounded-lg p-2">
                                            <p className="text-xs text-muted-foreground mb-1">Days Left</p>
                                            <p className={cn(
                                                "font-semibold text-sm",
                                                isUrgent && "text-yellow-600"
                                            )}>
                                                {daysLeft} days
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="w-full bg-muted rounded-full overflow-hidden h-3">
                                            <div
                                                className={cn(
                                                    "h-full transition-all",
                                                    isCompleted ? "bg-green-500" : "bg-primary"
                                                )}
                                                style={{width: `${Math.min(percentage, 100)}%`}}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">
                                                {percentage.toFixed(0)}% complete
                                            </span>
                                            <span className="text-muted-foreground">
                                                ${goal.remainingAmount?.toLocaleString() || 0} remaining
                                            </span>
                                        </div>
                                    </div>

                                    {!isCompleted && (
                                        <div className="pt-3 border-t border-border">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Monthly needed:</span>
                                                <span className="font-semibold text-foreground">
                                                    ${monthlyNeeded > 0 ? monthlyNeeded.toFixed(2) : '0.00'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                to reach your deadline
                                            </p>
                                        </div>
                                    )}

                                    {!isCompleted && (
                                        <ContributeDialog goal={goal} onContributed={fetchSavingsGoals}>
                                            <Button variant="outline" className="w-full">
                                                Add Contribution
                                            </Button>
                                        </ContributeDialog>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
