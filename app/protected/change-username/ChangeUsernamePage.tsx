'use client'

import { ChangeUsernameSchema, ChangeUsernameType } from "@/ZodSchemas/ZodSchemas"
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, } from "react-hook-form"
import {
    Field,
} from '@/components/ui/field'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChangeUsername } from "@/app/actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

function ChangeUsernamePage() {

    const router = useRouter()

    const form = useForm<ChangeUsernameType>({
        resolver: zodResolver(ChangeUsernameSchema),
        defaultValues: {
            username: ''
        }
    })

    const VerifyChangeUsername = async (values: ChangeUsernameType) => {
        const { success, message } = await ChangeUsername(values)

        if (!success) {
            toast.error(message, {
                position: 'top-right'
            })
            return
        }

        router.push('/protected/profile')
        toast.success('Username Changed successfully', {
            position: 'top-right'
        })
    }

    return (
        <main className="flex flex-col w-full h-[92vh] items-center justify-center">
            <form
                method="POST"
                onSubmit={form.handleSubmit(VerifyChangeUsername)}
                className="flex flex-col justify-center items-center gap-y-5"
            >
                <h1 className="text-xl">Change your username</h1>
                <Controller
                    name="username"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <Input {...field} placeholder="Enter your new username here" />
                            {fieldState.error && <small className='text-red-500 font-bold'>{fieldState.error.message}</small>}
                        </Field>
                    )}
                />
                <Button className="w-full bg-blue-500 hover:bg-blue-600">Submit</Button>
            </form>
        </main>
    )
}

export default ChangeUsernamePage