import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {toast} from "@/hooks/use-toast";
import {useCookies} from "react-cookie";
import {getApiUrl} from "@/config/api.ts";

const budgetSchema = z.object({
    categoryId: z.string().min(1, "Category is required"),
    limitAmount: z.string().min(1, "Amount is required"),
    month: z.date({
        required_error: "Date is required",
    }),
});

interface EditBudget {
    id: number;
    categoryId: number;
    limitAmount: number;
    month: string;
}

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetDialogProps {
    children: React.ReactNode;
    onBudgetAdded?: () => void;
    editBudget?: EditBudget;
}

export function BudgetDialog({children, onBudgetAdded, editBudget}: BudgetDialogProps) {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['user']);

    const isEditMode = !!editBudget;

    const form = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            categoryId: "",
            limitAmount: "",
        },
    });

    const fetchCategories = async () => {
        try {
            const response = await fetch(getApiUrl(`/categories`), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${cookies.user}`,
                },
            });

            const data = await response.json();
            setCategories(data.data || []);
            return data;
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const createBudget = async (budgetData: BudgetFormValues) => {
        try {
            const response = await fetch(getApiUrl(`/budgets`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.user}`,
                },
                body: JSON.stringify({
                    categoryId: parseInt(budgetData.categoryId),
                    limitAmount: parseFloat(budgetData.limitAmount),
                    month: format(budgetData.month, 'yyyy-MM-dd'),
                }),
            });

            return await response.json();
        } catch (err) {
            console.error('Error:', err);
            return {error: true};
        }
    };

    const updateBudget = async (budgetData: BudgetFormValues) => {
        try {
            const response = await fetch(getApiUrl(`/budgets/${editBudget.id}`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.user}`,
                },
                body: JSON.stringify({
                    categoryId: parseInt(budgetData.categoryId),
                    limitAmount: parseFloat(budgetData.limitAmount),
                    month: format(budgetData.month, 'yyyy-MM-dd'),
                }),
            });

            return await response.json();
        } catch (err) {
            console.error('Error:', err);
            return {error: true};
        }
    };

    const onSubmit = async (data: BudgetFormValues) => {
        setLoading(true);

        const response = isEditMode
            ? await updateBudget(data)
            : await createBudget(data);

        setLoading(false);

        if (response && !response.error) {
            toast({
                title: isEditMode ? "Budget updated" : "Budget added",
                description: isEditMode
                    ? `Budget limit updated to $${data.limitAmount}`
                    : `$${data.limitAmount} budget for category added.`,
            });
            setOpen(false);
            form.reset();
            if (onBudgetAdded) {
                onBudgetAdded();
            }
        } else {
            toast({
                title: "Error",
                description: response?.message || "Operation failed. Please try again.",
                variant: "destructive"
            });
        }
    };

    useEffect(() => {
        if (open) {
            fetchCategories();

            if (editBudget) {
                console.log(editBudget);
                form.reset({
                    categoryId: String(editBudget.categoryId || ""),
                    limitAmount: String(editBudget.limitAmount || ""),
                    month: editBudget.month ? new Date(editBudget.month) : new Date(),
                });
            } else {
                form.reset({
                    categoryId: "",
                    limitAmount: "",
                    month: new Date(),
                });
            }
        }
    }, [open, editBudget]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? "Edit Budget" : "Add New Budget"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="limitAmount"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Limit Amount (USD)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isEditMode}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories && categories.length > 0 ? (
                                                categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={String(category.id)}
                                                    >
                                                        {category.name || `Category ${category.id}`}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem disabled value="no-categories">
                                                    No categories available
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="month"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Budget Month</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "MMMM yyyy")
                                                    ) : (
                                                        <span>Select Month</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : isEditMode ? "Update Budget" : "Add Budget"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
