import {useEffect, useState} from "react";
import {ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight, Plus, Search, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Card} from "@/components/ui/card";
import {useCookies} from "react-cookie";
import {cn} from "@/lib/utils.ts";
import {TransactionDialog} from "@/components/Dialog/TransactionDialog.tsx";
import {getApiUrl} from "@/config/api.ts";

export default function Transactions() {
    const [cookies] = useCookies(['user']);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("ALL");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleTransactions = async (page = 0, size = pageSize) => {
        try {
            setLoading(true);

            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
            });

            const response = await fetch(getApiUrl(`/transactions?${params}`), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${cookies.user}`,
                },
            });

            const data = await response.json();
            const pageData = data.data;

            setTransactions(pageData.content || []);
            setCurrentPage(pageData.number || 0);
            setTotalPages(pageData.totalPages || 0);
            setTotalElements(pageData.totalElements || 0);

            return data;
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cookies.user) {
            handleTransactions(0, pageSize);
        }
    }, [cookies.user, pageSize]);

    const filteredTransactions = transactions.filter(transaction => {
        if (filterType !== "ALL" && transaction.type !== filterType) {
            return false;
        }

        if (startDate && new Date(transaction.transactionDate) < new Date(startDate)) {
            return false;
        }
        if (endDate && new Date(transaction.transactionDate) > new Date(endDate)) {
            return false;
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const description = transaction.description?.toLowerCase() || "";
            const categoryName = transaction.categoryName?.toLowerCase() || "";
            const amount = transaction.amount?.toString() || "";

            return (
                description.includes(query) ||
                categoryName.includes(query) ||
                amount.includes(query)
            );
        }

        return true;
    });

    const onTransactionAdded = () => {
        handleTransactions(currentPage, pageSize);
    };

    const resetFilters = () => {
        setSearchQuery("");
        setFilterType("ALL");
        setStartDate("");
        setEndDate("");
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
            handleTransactions(newPage, pageSize);
        }
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(0);
        handleTransactions(0, newSize);
    };

    const hasActiveFilters = searchQuery || filterType !== "ALL" || startDate || endDate;

    if (loading && transactions.length === 0) {
        return (
            <div className="space-y-6 animate-fade-in px-4 sm:px-0">
                <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
                <Card className="p-6 text-center">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6 animate-fade-in px-4 sm:px-0">
                <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
                <Card className="p-6 text-center text-destructive">
                    <p>Error: {error}</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in px-4 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
                <TransactionDialog onTransactionAdded={onTransactionAdded}>
                    <Button className="gap-2 w-full sm:w-auto">
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

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
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

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Show:</span>
                        <select
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                            className="px-2 py-1 text-xs border border-border rounded-md bg-background text-foreground hover:bg-muted transition-colors h-8"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </Card>

            <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Transactions</h2>
                    <div className="text-xs text-muted-foreground">
                        {hasActiveFilters && (
                            <span
                                className="font-semibold text-foreground">{filteredTransactions.length} filtered / </span>
                        )}
                        <span className="font-semibold text-foreground">{totalElements}</span> total
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
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
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-border/50"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div
                                            className="p-2 rounded-lg text-xl sm:text-2xl flex-shrink-0"
                                            style={{backgroundColor: transaction.categoryColor}}
                                        >
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
                                            "font-bold text-base sm:text-lg text-right min-w-fit",
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

                {!hasActiveFilters && totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
                        <div className="text-xs text-muted-foreground">
                            Page <span className="font-semibold text-foreground">{currentPage + 1}</span> of{' '}
                            <span className="font-semibold text-foreground">{totalPages}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(0)}
                                disabled={currentPage === 0}
                                className="h-8"
                            >
                                First
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronLeft className="h-4 w-4"/>
                            </Button>

                            <div className="hidden sm:flex items-center gap-1">
                                {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i;
                                    } else if (currentPage < 3) {
                                        pageNum = i;
                                    } else if (currentPage > totalPages - 3) {
                                        pageNum = totalPages - 5 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNum)}
                                            className="h-8 w-8 p-0"
                                        >
                                            {pageNum + 1}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages - 1}
                                className="h-8 w-8 p-0"
                            >
                                <ChevronRight className="h-4 w-4"/>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(totalPages - 1)}
                                disabled={currentPage >= totalPages - 1}
                                className="h-8"
                            >
                                Last
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
