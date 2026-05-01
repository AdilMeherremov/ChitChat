'use client'

import { CreateRoom } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { CreateRoomSchema, CreateRoomType } from "@/ZodSchemas/ZodSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { motion } from 'motion/react'

function CreateRoomPage() {

    const router = useRouter()

    const form = useForm<CreateRoomType>({
        resolver: zodResolver(CreateRoomSchema),
        defaultValues: {
            room_name: ''
        }
    })

    const VerifyCreateRoom = async (values: CreateRoomType) => {
        const { success, message } = await CreateRoom(values)

        if (!success) {
            toast.error(message, {
                position: 'top-right'
            })
            return
        }

        toast.success('Room created successfully', {
            position: 'top-right'
        })
        router.push('/')
    }

    return (
        <main className="flex w-full h-[92vh] justify-center items-center">
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 100, y: 0 }}
                method="POST"
                onSubmit={form.handleSubmit(VerifyCreateRoom)}
                className="flex flex-col  items-center gap-y-3">
                <h1 className="text-xl">Create new room</h1>
                <Controller
                    name="room_name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <Input {...field} placeholder="Enter room name here" />
                            {fieldState.error && <small className='text-red-500 font-bold'>{fieldState.error.message}</small>}
                        </Field>
                    )}
                />
                <Button className="w-full bg-blue-500 hover:bg-blue-600">Submit</Button>
            </motion.form>
        </main>
    )
}

export default CreateRoomPage