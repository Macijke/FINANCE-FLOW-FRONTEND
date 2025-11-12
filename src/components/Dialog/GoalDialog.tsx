import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {toast} from "@/hooks/use-toast";
import {useCookies} from "react-cookie";
import {getApiUrl} from "@/config/api.ts";

const goalSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    targetAmount: z.string().min(1, "Amount is required"),
    targetDate: z.date().optional(),
    icon: z.string().min(1, "Icon is required"),
    color: z.string().min(1, "Color is required"),
});

type GoalFormValues = z.infer<typeof goalSchema>;

interface GoalDialog {
    children: React.ReactNode;
    onGoalAdded?: () => void;
    editGoal?: EditGoal;
}

interface EditGoal {
    id?: number;
    name?: string;
    description?: string;
    targetAmount?: number | string;
    targetDate?: string | Date;
    icon?: string;
    color?: string;
}

export function GoalDialog({children, onGoalAdded, editGoal}: GoalDialog) {
    const [open, setOpen] = useState(false);
    const [cookies] = useCookies(['user']);
    const isEditMode = !!editGoal;

    const form = useForm<GoalFormValues>({
        resolver: zodResolver(goalSchema),
        defaultValues: {
            name: "",
            description: "",
            targetAmount: "",
            icon: "",
            color: "",
        },
    });

    useEffect(() => {
        if (open) {
            if (editGoal) {
                console.log("Edit dialog data:", editGoal);
                form.reset({
                    name: editGoal.name || "",
                    description: editGoal.description || "",
                    targetAmount: editGoal.targetAmount ? String(editGoal.targetAmount) : "",
                    targetDate: editGoal.targetDate ? new Date(editGoal.targetDate) : undefined,
                    icon: editGoal.icon || "",
                    color: editGoal.color || "",
                });
            } else {
                form.reset({
                    name: "",
                    description: "",
                    targetAmount: "",
                    icon: "",
                    color: "",
                });

            }
        }
    }, [editGoal, open]);

    const createGoal = async (goalData: GoalFormValues) => {
        try {
            const response = await fetch(getApiUrl(`/savings-goals`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.user}`,
                },
                body: JSON.stringify({
                    ...goalData
                }),
            });

            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Error:', err);
        }
    }

    const updateGoal = async (goalData: GoalFormValues) => {
        try {
            const response = await fetch(getApiUrl(`/savings-goals/${editGoal.id}`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.user}`,
                },
                body: JSON.stringify({
                    ...goalData
                }),
            });

            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Error:', err);
        }
    }

    const onSubmit = async (data: GoalFormValues) => {
        const response = isEditMode ? await updateGoal(data) : await createGoal(data);

        if (response && !response.error) {
            toast({
                title: isEditMode ? "Saving goal updated" : "Saving goal successfully created",
                description: isEditMode ? "Your saving goal has been updated." : "Your new saving goal has been created.",
            });
            setOpen(false);
            form.reset();
            if (onGoalAdded) {
                onGoalAdded();
            }
        } else {
            toast({
                title: "Error",
                description: response?.message || "Saving goal not created. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit saving goal" : "Add new saving goal"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Saving goal name" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Description of the saving goal..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >

                        </FormField>

                        <FormField
                            control={form.control}
                            name="targetAmount"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Target amount (USD)</FormLabel>
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
                            name="icon"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Icon URL" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>

                        <FormField
                            control={form.control}
                            name="color"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Color HEX code" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        >
                        </FormField>

                        <FormField
                            control={form.control}
                            name="targetDate"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Dedline date</FormLabel>
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
                                                disabled={(targetDate) =>
                                                    targetDate < new Date()
                                                }
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
                                {isEditMode ? "Update Goal" : "Add Goal"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
