import {useEffect, useState} from "react";
import {ArrowDownRight, ArrowUpRight, Plus, Search, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card} from "@/components/ui/card";
import {useCookies} from "react-cookie";
import {cn} from "@/lib/utils.ts";
import {TransactionDialog} from "@/components/Dialog/TransactionDialog.tsx";

export default function Transactions() {
    const [cookies] = useCookies(['user']);
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("ALL");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleTransactions = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/v1/transactions', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${cookies.user}`,
                },
            });

            const data = await response.json();
            const trans = data.data.content || [];
            setTransactions(trans);
            setFilteredTransactions(trans);

            return data;
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleTransactions();
    }, [cookies.user]);


    useEffect(() => {
        let filtered = transactions;

        if (filterType !== "ALL") {
            filtered = filtered.filter(t => t.type === filterType);
        }

        if (startDate) {
            filtered = filtered.filter(t => new Date(t.transactionDate) >= new Date(startDate));
        }

        if (endDate) {
            filtered = filtered.filter(t => new Date(t.transactionDate) <= new Date(endDate));
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t => {
                const description = t.description?.toLowerCase() || "";
                const categoryName = t.categoryName?.toLowerCase() || "";
                const amount = t.amount?.toString() || "";

                return (
                    description.includes(query) ||
                    categoryName.includes(query) ||
                    amount.includes(query)
                );
            });
        }

        setFilteredTransactions(filtered);
    }, [searchQuery, filterType, startDate, endDate, transactions]);

    const onTransactionAdded = () => {
        handleTransactions();
    };

    const resetFilters = () => {
        setSearchQuery("");
        setFilterType("ALL");
        setStartDate("");
        setEndDate("");
    };

    const hasActiveFilters = searchQuery || filterType !== "ALL" || startDate || endDate;

    if (loading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold">Transactions</h1>
                <Card className="p-6 text-center">
                    <p>Loading transactions...</p>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl font-bold">Transactions</h1>
                <Card className="p-6 text-center text-destructive">
                    <p>Error: {error}</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Transactions</h1>
                <TransactionDialog onTransactionAdded={onTransactionAdded}>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4"/>
                        Add Transaction
                    </Button>
                </TransactionDialog>
            </div>

            <Card className="p-4 space-y-3">
                <div className="flex gap-4 flex-col sm:flex-row">
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder="Search by name, category, or amount..."
                            className="pl-10 h-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            onClick={resetFilters}
                            className="gap-2 h-9"
                            size="sm"
                        >
                            <X className="h-4 w-4"/>
                            Clear
                        </Button>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="flex gap-2 flex-wrap items-center">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-2 py-1 text-sm border border-border rounded-md bg-background text-foreground hover:bg-muted transition-colors h-8"
                        >
                            <option value="ALL">All Types</option>
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                        </select>

                        <div className="flex items-center gap-1">
                            <label className="text-xs text-muted-foreground">From:</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="px-2 py-1 text-xs border border-border rounded-md bg-background text-foreground hover:bg-muted transition-colors h-8"
                            />
                        </div>

                        <div className="flex items-center gap-1">
                            <label className="text-xs text-muted-foreground">To:</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-2 py-1 text-xs border border-border rounded-md bg-background text-foreground hover:bg-muted transition-colors h-8"
                            />
                        </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                        <span
                            className="font-semibold text-foreground">{filteredTransactions.length}</span>/{transactions.length}
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <h2 className="text-lg font-semibold mb-3">Recent Transactions</h2>

                {filteredTransactions.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                        {transactions.length === 0 ? (
                            <p>No transactions yet. Create one to get started!</p>
                        ) : (
                            <p>No transactions match your search criteria.</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredTransactions.map((transaction) => {
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
                )}
            </Card>
        </div>
    );
}
