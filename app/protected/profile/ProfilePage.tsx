'use client'

import { FetchUserData } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { motion } from 'motion/react'
import { createClient } from "@/lib/supabase/client"

function ProfilePage() {

    const router = useRouter()

    const [username, setUsername] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(true)

    const GetUsername = async () => {
        const { Username, message } = await FetchUserData()

        if (message) {
            toast.error(message, {
                position: 'top-right'
            })
            setLoading(false)
            return
        }
        setUsername(Username)
        setLoading(false)
    }

    const UserSignOut = async () => {
        const supabase = createClient()

        const { error } = await supabase.auth.signOut()

        if (error) {
            toast.error(error.message, {
                position: 'top-right'
            })
            return
        }
        toast.success('Signed out successfully', {
            position: 'top-right'
        })
        router.push('/')
    }

    useEffect(() => {
        GetUsername()
    }, [])

    return (
        <main className="flex flex-col  w-full h-[92vh] items-center justify-center gap-y-1">
            <small className="text-lg">Hello,</small>

            {loading ? <Skeleton className="h-8 w-[300px]" />
                :
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 100 }}
                    className="text-2xl"
                >
                    {username}
                </motion.h1>
            }

            <div className="flex flex-col w-full md:w-[50%] px-5 mt-5 gap-3 items-center">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 100, y: 0 }}
                    className="w-full *:w-full"
                >
                    <Button
                        className="p-1.5 rounded-lg bg-gray-300 hover:bg-gray-200 text-black"
                        onClick={() => router.push('/protected/change-username')}>
                        Change username
                    </Button>
                </motion.span>

                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 100, y: 0 }}
                    transition={{ delay: .1 }}
                    className="w-full *:w-full"
                >
                    <Button onClick={UserSignOut} variant={'destructive'}>Sign out</Button>
                </motion.span>
            </div>
        </main>
    )
}

export default ProfilePage