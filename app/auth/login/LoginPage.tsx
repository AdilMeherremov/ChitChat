'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Controller, useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { LoginSchema, LoginSchemaType } from '@/ZodSchemas/ZodSchemas'
import { LoginUser } from '@/app/actions'
import {
    Field,
    FieldLabel,
} from '@/components/ui/field'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function SignupPage() {

    const router = useRouter()

    const [showPassword, setShowPassword] = useState<boolean>(false)

    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const LogUserIn = async (values: LoginSchemaType) => {
        const { success, message } = await LoginUser(values)

        if (!success) {
            toast.error(message, {
                position: 'top-right'
            })
            return
        }

        router.push('/')
        location.reload()
        toast.success('Logged in successfully', {
            position: 'top-right'
        })
    }

    return (
        <main className="flex w-full h-[92vh] items-center justify-center">
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 100, y: 0 }}
                method='POST' onSubmit={form.handleSubmit(LogUserIn)}>
                <div className="flex flex-col items-center gap-y-5">
                    <h1 className='text-xl'>Log into your account</h1>

                    <Controller
                        name='email'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Email*</FieldLabel>
                                <Input {...field} placeholder='Enter your Email' />
                                {fieldState.error && <small className='text-red-500 font-bold'>{fieldState.error.message}</small>}
                            </Field>
                        )}
                    />

                    <Controller
                        name='password'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Password*</FieldLabel>
                                <div className='flex gap-x-2'>
                                    <Input
                                        {...field}
                                        placeholder='Enter your Password'
                                        type={showPassword ? 'text' : 'password'}
                                    />
                                    <button type='button' onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <Eye /> : <EyeOff />}
                                    </button>
                                </div>

                                {fieldState.error && <small className='text-red-500 font-bold'>{fieldState.error.message}</small>}
                            </Field>
                        )}
                    />

                    <Button className='w-full bg-gray-200 text-black hover:bg-gray-300'>Log in</Button>
                </div>
            </motion.form>
        </main>
    )
}

export default SignupPage