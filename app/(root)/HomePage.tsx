'use client'

import {
    Card,
    CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { motion } from 'motion/react'
import { GetRooms } from '../actions'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { useRouter } from 'next/navigation'

function HomePage() {

    const router = useRouter()

    const [Rooms, setRooms] = useState<{ room_name: string, id: number, created_by: string }[] | undefined>([])
    const [loading, setLoading] = useState<boolean>(true)

    const VerifyGetRoom = async () => {
        const { success, data, message } = await GetRooms()

        if (!success) {
            toast.error(message, {
                position: 'top-right'
            })
            return
        }

        setRooms(data)
        setLoading(false)
    }

    useEffect(() => {
        VerifyGetRoom()
    }, [])

    return (
        <main className="flex w-full h-[92vh] items-center justify-center overflow-x-hidden ">
            <div className="flex flex-col w-full h-full items-center gap-y-4 py-5">
                <h1 className='text-xl'>Join a room to start chatting!</h1>
                <span className='opacity-50'>or</span>
                <Link
                    href={'/protected/create-room'}
                    className='w-[75%] p-2 mb-5 text-center rounded-2xl lg:w-[45%]
                    bg-blue-500 text-white hover:bg-blue-600 transition'
                >
                    Create a room
                </Link>
                <div className='flex flex-col w-[80%] gap-4 mx-5 px-3 py-3'>
                    <div className='flex items-center gap-3'>
                        <span className='w-full h-px bg-black' />
                        <h1 className='text-xl'>Rooms</h1>
                        <span className='w-full h-px bg-black' />
                    </div>

                    {loading ?
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 100 }}
                            className='flex w-full p-5 justify-center items-center'>
                            <Spinner className='size-10' />
                        </motion.div>
                        :
                        <>
                            {Rooms?.map((Room) => (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 100 }}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: .95 }}
                                    onClick={() => router.push('/protected/' + Room.id)}
                                    key={Room.id}
                                >
                                    <Card className='flex items-center'>
                                        <CardTitle>{Room.room_name}</CardTitle>
                                    </Card>
                                </motion.button>
                            ))}
                        </>
                    }
                </div>
            </div>
        </main>
    )
}

export default HomePage