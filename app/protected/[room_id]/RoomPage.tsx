'use client'

import { FetchAllMessages, FetchRoomName, FetchUserData, SendMessage } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Send } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { motion } from 'motion/react'
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/client"

function RoomPage() {

  const router = useRouter()
  const { room_id } = useParams()

  const [RoomName, setRoomName] = useState<string>('')
  const [userData, setUserData] = useState<{ username: string, user_id: string }>()
  const [NewMessage, setNewMessage] = useState<string>('')
  const [Messages, setMessages] = useState<{content: any, user_id: any, username: any}[] | undefined>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [UsernameLoading, setUsernameLoading] = useState<boolean>(true)
  const [RoomNameLoading, setRoomNameLoading] = useState<boolean>(true)

  const ScrollRef = useRef<HTMLDivElement>(null)
  const InputRef = useRef<HTMLInputElement>(null)

  const AddNewMessage = async (msg: string, roomId: number) => {
    const { success, message } = await SendMessage(msg, roomId)

    if (!success) {
      toast.error(message, {
        position: 'top-right'
      })
      return
    }
    setNewMessage('')
  }

  const GetMessages = async (RoomId: number) => {
    const { success, ErrorMessage, data } = await FetchAllMessages(RoomId)

    if (!success) {
      toast.error(ErrorMessage, {
        position: 'top-right'
      })
      return
    }
    setMessages(data)
  }

  const GetUserData = async () => {
    const { Username, user_id, message } = await FetchUserData()

    if (message) {
      toast.error(message, {
        position: 'top-right'
      })
      return
    }
    setUserData({
      username: Username,
      user_id: user_id!,
    })
    setUsernameLoading(false)
  }

  const GetRoomName = async (RoomId: number) => {
    const { message, success, data } = await FetchRoomName(RoomId)

    if (!success) {
      toast.error(message, {
        position: 'top-right'
      })
    }

    setRoomName(data?.room_name)
    setRoomNameLoading(false)
  }

  const HandleSendMessage = async () => {
    if (!NewMessage.trim()) return

    const MsgToSend = NewMessage
    setNewMessage('')
    InputRef.current?.focus()

    await AddNewMessage(MsgToSend, Number(room_id))
  }

  useEffect(() => {
    const supabase = createClient()

    GetMessages(Number(room_id))
    GetUserData()
    GetRoomName(Number(room_id))
    setLoading(false)

    const channel = supabase
      .channel(`room-${room_id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${Number(room_id)}`
        },
        (payload) => {
          const New_Message = payload.new as { content: any; user_id: any; username: any }
          setMessages((prev) => (prev ? [...prev, New_Message] : [New_Message]))
        }
      ).subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [room_id])

  useEffect(() => {
    if (ScrollRef.current) {
      ScrollRef.current.scrollTop = ScrollRef.current.scrollHeight
    }
  }, [Messages])

  return (
    <main className="flex flex-col w-full h-[92vh] p-3 pt-5 justify-center items-center">
      {loading ?
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 100 }}
        >
          <Spinner className="size-8" />
        </motion.span>
        :
        <>
          <div className="flex w-[90%] mb-2 justify-between items-end">
            {RoomNameLoading ? <Skeleton className="h-5 w-[35%]" /> : <small className="text-sm opacity-75">Room: {RoomName}</small>}
            <Button
              onClick={() => router.push('/')}
              className="bg-red-500 hover:bg-red-600"
            >
              <LogOut />
            </Button>
          </div>
          <div className="flex flex-col w-[90%] h-full rounded-xl p-3 justify-between bg-gray-200">
            <div ref={ScrollRef} className="flex flex-col w-full max-h-[93%] gap-y-3 rounded-md overflow-y-scroll">
              {Messages?.map((msg, index) => (
                <span key={index}>
                  {msg.user_id == userData?.user_id ?
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 100 }}
                      className="flex flex-col p-2 rounded-lg gap-y-2 break-words text-white bg-blue-500"
                    >
                      <div className="flex items-center justify-between *:opacity-75">
                        {UsernameLoading ? <Skeleton className="h-5 w-[35%]" /> : <small>{msg.username}</small>}
                      </div>
                      {msg.content}
                    </motion.div>
                    :
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 100 }}
                      className="flex flex-col w-full p-2 rounded-lg gap-y-2 break-words bg-gray-300"
                    >
                      <div className="flex items-center justify-between *:opacity-75">
                        <small>{msg.username}</small>
                      </div>
                      {msg.content}
                    </motion.div>
                  }
                </span>
              ))}
            </div>
            <div className="flex gap-x-3">
              <Input
                ref={InputRef}
                value={NewMessage}
                className="bg-white"
                placeholder="Enter your message"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
              />
              <Button
                onClick={HandleSendMessage}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send />
              </Button>
            </div>
          </div>
        </>
      }
    </main>
  )
}

export default RoomPage