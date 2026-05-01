'use client'

import { createClient } from '@/lib/supabase/client'
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerTitle,
    DrawerClose
} from '@/components/ui/drawer'
import { Menu } from "lucide-react"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

function Header() {

    const router = useRouter()

    const [UserLoggedIn, setUserLoggedIn] = useState<boolean>(false)
    const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false)

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
        const supabase = createClient()

        if (screen.width >= 1024) {
            setIsLargeScreen(true)
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                setUserLoggedIn(true)
            }
            else {
                setUserLoggedIn(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <header className="flex w-full h-[8vh] items-center justify-between px-5">
            <Link href={'/'} className="text-2xl">ChitChat</Link>

            {isLargeScreen ?
                <nav className='flex w-[19%]'>
                    {UserLoggedIn ?
                        <>
                            <Link href={'/protected/profile'} className='p-5 w-full'>
                                Profile
                            </Link>

                            <button onClick={UserSignOut} className='p-5 w-full text-red-600'>
                                Sign out
                            </button>
                        </>
                        :
                        <>
                            <Link href={'/auth/login'} className='p-5 w-full'>
                                Login
                            </Link>

                            <Link href={'/auth/sign-up'} className='p-5 w-full'>
                                Sign up
                            </Link>
                        </>}
                </nav>
                :
                <Drawer direction="top">
                    <DrawerTrigger asChild>
                        <Menu className='size-8 cursor-pointer' />
                    </DrawerTrigger>

                    <DrawerContent>
                        <DrawerTitle />
                        <div className='flex flex-col w-full items-center text-center gap-y-2 '>
                            {UserLoggedIn ?
                                <>
                                    <DrawerClose asChild>
                                        <Link href={'/protected/profile'} className='p-5 w-full'>
                                            Profile
                                        </Link>
                                    </DrawerClose>

                                    <DrawerClose asChild>
                                        <button onClick={UserSignOut} className='p-5 w-full text-red-600'>
                                            Sign out
                                        </button>
                                    </DrawerClose>
                                </>
                                :
                                <>
                                    <DrawerClose asChild>
                                        <Link href={'/auth/login'} className='p-5 w-full'>
                                            Login
                                        </Link>
                                    </DrawerClose>

                                    <DrawerClose asChild>
                                        <Link href={'/auth/sign-up'} className='p-5 w-full'>
                                            Sign up
                                        </Link>
                                    </DrawerClose>
                                </>}
                        </div>
                    </DrawerContent>
                </Drawer>
            }
        </header>
    )
}

export default Header