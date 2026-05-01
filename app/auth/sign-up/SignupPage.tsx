'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Controller, useForm } from "react-hook-form"
import { Button } from '@/components/ui/button'
import { SignupSchema, SignupSchemaType } from '@/ZodSchemas/ZodSchemas'
import { SignUpUser } from '@/app/actions'
import { toast } from 'sonner'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import {
    Field,
    FieldLabel,
} from '@/components/ui/field'

function SignupPage() {


    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

    const form = useForm<SignupSchemaType>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            ConfirmPassword: ''
        }
    })

    const SignUp = async (values: SignupSchemaType) => {
        const { success, message } = await SignUpUser(values)

        if (!success) {
            toast.error(message, {
                position: 'top-right'
            })
            return
        }

        location.href = '/'
        toast.success('Signed up successfully', {
            position: 'top-right'
        })
    }

    return (
        <main className="flex w-full h-[92vh] items-center justify-center">
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 100, y: 0 }}
                method='POST' onSubmit={form.handleSubmit(SignUp)}>
                <div className="flex flex-col items-center gap-y-5">
                    <h1 className='text-xl'>Create your account</h1>
                    <Controller
                        name='username'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Username*</FieldLabel>
                                <Input {...field} placeholder='Enter your username' />
                                {fieldState.error && <small className='text-red-500 font-bold'>{fieldState.error.message}</small>}
                            </Field>
                        )}
                    />

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

                    <Controller
                        name='ConfirmPassword'
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Confirm Password*</FieldLabel>
                                <div className='flex gap-x-2'>
                                    <Input
                                        {...field}
                                        placeholder='Confirm your Password'
                                        type={showConfirmPassword ? 'text' : 'password'}
                                    />
                                    <button type='button' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <Eye /> : <EyeOff />}
                                    </button>
                                </div>
                                {fieldState.error && <small className='text-red-500 font-bold'>{fieldState.error.message}</small>}
                            </Field>
                        )}
                    />
                    <Button className='w-full bg-gray-200 text-black hover:bg-gray-300'>Sign in</Button>
                </div>
            </motion.form>
        </main>
    )
}

export default SignupPage