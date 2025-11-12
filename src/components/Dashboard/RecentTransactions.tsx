import {Card} from "@/components/ui/card";
import {ArrowDownRight, ArrowUpRight} from "lucide-react";
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {getApiUrl} from "@/config/api.ts";

export function RecentTransactions() {

    const [cookies] = useCookies(["user"]);
    const [recentTransactions, setRecentTransactions] = useState([]);

    const getRecentTransactions = async (maxLimit: number) => {
        const response = await fetch(getApiUrl(`/transactions/recent?limit=${maxLimit}`), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.user}`,
            },
        });
        const data = await response.json();
        setRecentTransactions(data.data);
    }

    useEffect(() => {
        getRecentTransactions(5);
    }, [cookies.user]);

    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Transactions</h2>
            <div className="space-y-4">
                <div className="space-y-2">
                    {recentTransactions.map((transaction) => {
                        const isIncome = transaction.type === 'INCOME';
                        const iconEmoji = transaction.categoryIcon || '💰';

                        return (
                            <div
                                key={transaction.id}
                                className={cn("flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer border border-border/50")}
                            >

                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div
                                        className={cn("p-2 rounded-lg text-2xl flex-shrink-0")}
                                        style={{backgroundColor: transaction.categoryColor}}>
                                        {iconEmoji}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm truncate">{transaction.description}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {transaction.categoryName || 'Uncategorized'} • {new Date(transaction.transactionDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                    <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                                        isIncome ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                                    )}>
                                        {isIncome ? (
                                            <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400"/>
                                        ) : (
                                            <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400"/>
                                        )}
                                    </div>
                                    <p className={cn(
                                        "font-bold text-lg text-right min-w-fit",
                                        isIncome ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                    )}>
                                        {isIncome ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}
