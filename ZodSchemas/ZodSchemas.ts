import z from 'zod'

export const SignupSchema = z.object({
    username: z
        .string()
        .min(1, 'You must enter a username')
        .max(25, 'Username must be less than 25 characters'),

    email: z
        .email('You must enter a valid email address'),

    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long'),

    ConfirmPassword: z.string()
}).refine((data) => data.password == data.ConfirmPassword, {
    message: 'Passwords do not match',
    path: ['ConfirmPassword']
})

export const LoginSchema = z.object({
    email: z
        .email('You must enter a valid email address'),

    password: z
        .string()
        .min(1, 'You must enter a password'),
})

export const ChangeUsernameSchema = z.object({
    username: z
        .string()
        .min(1, 'You must enter a new username')
        .max(25, 'Username must be less than 25 characters')
})

export const CreateRoomSchema = z.object({
    room_name: z
    .string()
    .min(1, 'You must enter a room name')
    .max(25, 'Room name must be less than 25 characters')
})

export type SignupSchemaType = z.infer<typeof SignupSchema>
export type LoginSchemaType = z.infer<typeof LoginSchema>
export type ChangeUsernameType = z.infer<typeof ChangeUsernameSchema>
export type CreateRoomType = z.infer<typeof CreateRoomSchema>