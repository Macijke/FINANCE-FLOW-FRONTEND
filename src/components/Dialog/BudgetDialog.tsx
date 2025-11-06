import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {toast} from "@/hooks/use-toast";
import {useCookies} from "react-cookie";

const budgetSchema = z.object({
    categoryId: z.string().min(1, "Category is required"),
    limitAmount: z.string().min(1, "Amount is required"),
    month: z.date({
        required_error: "Date is required",
    }),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetDialog {
    children: React.ReactNode;
    onBudgetAdded?: () => void;
}

export function BudgetDialog({children, onBudgetAdded}: BudgetDialog) {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [cookies] = useCookies(['user']);

    const form = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            categoryId: "",
            limitAmount: ""
        },
    });

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/categories', {
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
    }

    const createBudget = async (budgetData: BudgetFormValues) => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/budgets', {
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

            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Error:', err);
        }
    }

    const onSubmit = async (data: BudgetFormValues) => {
        const response = await createBudget(data);

        if (response && !response.error) {
            toast({
                title: "Budget added successfully",
                description: `${data.limitAmount} budget for category added.`,
            });
            setOpen(false);
            form.reset();
            if (onBudgetAdded) {
                onBudgetAdded();
            }
        } else {
            toast({
                title: "Error",
                description: response?.message || "Budget add failed. Please try again.",
                variant: "destructive"
            });
        }
    };

    useEffect(() => {
        if (open) {
            fetchCategories();
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add new transaction</DialogTitle>
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                    <FormLabel>Transaction date</FormLabel>
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
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Select Date</span>
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
                                                className={cn("p-3 pointer-events-auto")}
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
                            <Button type="submit" className="flex-1">
                                Add budget
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
