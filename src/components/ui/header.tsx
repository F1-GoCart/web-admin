import React from 'react'
import Image from 'next/image'
import { UserButton } from '@/components/ui/user-button'

function Header() {
  return (
    <div className="flex justify-between items-center">
      <Image
        src="/gocart_logo.png"
        width={200}
        height={0}
        className="p-4"
        alt="logo"
      />
      <div className=" mr-4 ">
        <UserButton />
      </div>
    </div>
  )
}

export default Header
