import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useCookies} from "react-cookie";
import {toast} from "@/hooks/use-toast";
import {getApiUrl} from "@/config/api.ts";

const contributeSchema = z.object({
    amount: z
        .string()
        .min(1, "Kwota jest wymagana")
        .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Podaj poprawną dodatnią kwotę"),
});

type ContributeFormValues = z.infer<typeof contributeSchema>;

interface EditGoal {
    id: number;
    name?: string;
}

interface ContributeDialogProps {
    children: React.ReactNode;
    goal: EditGoal;
    onContributed?: () => void;
}

export function ContributeDialog({children, goal, onContributed}: ContributeDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(["user"]);

    const form = useForm<ContributeFormValues>({
        resolver: zodResolver(contributeSchema),
        defaultValues: {
            amount: "",
        },
    });

    const onSubmit = async (data: ContributeFormValues) => {
        setLoading(true);
        try {
            const response = await fetch(getApiUrl(`/savings-goals/${goal.id}/contribute`), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cookies.user}`,
                },
                body: JSON.stringify({
                    amount: parseFloat(data.amount),
                }),
            });
            setLoading(false);
            const resJson = await response.json();

            if (response.ok && !resJson.error) {
                toast({
                    title: "Contribution Successful",
                    description: `${data.amount} successfully added to goal ${goal.name ? ` "${goal.name}"` : ""}.`,
                });
                setOpen(false);
                form.reset();
                onContributed?.();
            } else {
                toast({
                    title: "Error",
                    description: resJson?.message || "Could not contribute to the goal. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (err) {
            console.error(err);
            toast({
                title: "Network Error",
                description: "An error occurred while trying to contribute to the goal. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Contribute to goal {goal.name ? ` — ${goal.name}` : ""}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Amount (USD)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                                Anuluj
                            </Button>
                            <Button type="submit" className="flex-1" disabled={loading}>
                                {loading ? "Wysyłanie..." : "Wpłać"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}