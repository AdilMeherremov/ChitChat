'use server'

import { createClient } from "@/lib/supabase/server"
import {
    ChangeUsernameType,
    CreateRoomType,
    LoginSchemaType,
    SignupSchemaType
} from "@/ZodSchemas/ZodSchemas"

export async function SignUpUser(data: SignupSchemaType) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                username: data.username
            }
        }
    })

    if (error) {
        return { success: false, message: error?.message }
    }

    return { success: true }
}

export async function LoginUser(data: LoginSchemaType) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
    })

    if (error) {
        return { success: false, message: error.message }
    }

    return { success: true }
}

export async function FetchUserData() {
    const supabase = await createClient()
    const { data: UserData } = await supabase.auth.getUser()

    const { error, data } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', UserData.user?.id)
        .single()

    if (error) {
        return { message: error.message }
    }

    return { Username: data.username, user_id: UserData.user?.id }
}

export async function ChangeUsername(data: ChangeUsernameType) {
    const supabase = await createClient()
    const { data: UserData } = await supabase.auth.getUser()

    const { error } = await supabase
        .from('profiles')
        .update({
            username: data.username
        })
        .eq('user_id', UserData.user?.id)

    if (error) {
        return { message: error.message }
    }

    return { success: true }
}

export async function CreateRoom(data: CreateRoomType) {
    const supabase = await createClient()
    const { data: UserData } = await supabase.auth.getUser()

    const { error } = await supabase
        .from('room')
        .insert([
            {
                room_name: data.room_name,
                created_by: UserData.user?.id
            }
        ])

    if (error) {
        return { success: false, message: error.message }
    }

    return { success: true }
}

export async function GetRooms() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('room')
        .select('room_name, id, created_by')

    if (error) {
        return { success: false, message: error.message }
    }

    return { success: true, data }
}

export async function FetchAllMessages(roomId: number) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('messages')
        .select('content, user_id, username')
        .eq('room_id', roomId)

    if (error) {
        return { success: false, ErrorMessage: error.message }
    }

    return { success: true, data }
}

export async function SendMessage(message: string, roomId: number) {
    const supabase = await createClient()
    const { data: UserData } = await supabase.auth.getUser()

    const { Username } = await FetchUserData()

    const { error } = await supabase
        .from('messages')
        .insert({
            content: message,
            room_id: roomId,
            user_id: UserData.user?.id,
            username: Username
        })

    if (error) {
        return { message: error.message }
    }

    return { success: true }
}

export async function FetchRoomName(RoomId: number) {
    const supabase = await createClient()

    const { error, data } = await supabase
        .from('room')
        .select('room_name')
        .eq('id', RoomId)
        .single()

    if (error) {
        return { message: error.message, success: false }
    }

    return { success: true, data }
}