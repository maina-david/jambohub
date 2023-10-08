import Image from 'next/image'
import React from 'react'

export const metadata = {
  title: "Chats",
}

function ChatsPage() {
  return (
    <div className="container mx-auto rounded-lg shadow-lg">
      <div className="flex flex-row justify-between">
        {/* left sidebar */}
        <div className="flex w-2/5 flex-col overflow-y-auto border-r-2">
        </div>
        {/* left sidebar */}
        {/* chat content */}
        <div className="w-2/5 border-l-2 px-5">
        </div>
        {/* chat content */}
      </div>
    </div>
  )
}

export default ChatsPage
