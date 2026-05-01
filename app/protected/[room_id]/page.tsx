import { Suspense } from "react"
import RoomPage from "./RoomPage"

function page() {
    return (
        <Suspense>
            <RoomPage />
        </Suspense>
    )
}

export default page