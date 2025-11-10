import React, {useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {UserPlusIcon} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {inviteMemberSchema, InviteMemberSchemaType} from "@/schemas/member-schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import {useMutation} from "@tanstack/react-query";
import {orpc} from "@/lib/orpc";

const InviteMember = () => {
    const [open, setOpen] = useState<boolean>(false)

    const form = useForm<InviteMemberSchemaType>({
        resolver: zodResolver(inviteMemberSchema),
        mode: "onBlur",
        defaultValues: {
            name: "",
            email: ""
        }
    })

    const inviteMemberMutation = useMutation(
        orpc.workspace.member.invite.mutationOptions({
            onMutate: () => {
                toast.loading("Sending your invitation...", {
                    description: "",
                    id: "invite-member"
                })
            },
            onSuccess: () => {
                toast.success("Invitation sent successfully!", {
                    description: "",
                    id: "invite-member"
                })
                form.reset()
                setOpen(false)
            },
            onError: (error) => {
                toast.error("Oops! Something went wrong...", {
                    description: "Please try again",
                    id: "invite-member"
                })
            }
        })
    )

    function onSubmit(values: InviteMemberSchemaType) {
        inviteMemberMutation.mutate(values)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button
                    variant={"outline"}
                >
                    <UserPlusIcon />
                    Invite member
                </Button>
            </DialogTrigger>
            <DialogContent className={"sm:max-w-[425px]"}>
                <DialogHeader>
                    <DialogTitle>
                        Invite member
                    </DialogTitle>
                    <DialogDescription>
                        Invite a new member to your workspace via their email
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className={"space-y-6"}
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            name={"name"}
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={"Enter a name..."}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name={"email"}
                            control={form.control}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={"Enter an email..."}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type={"submit"}
                        >
                            Send Invite
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default InviteMember
