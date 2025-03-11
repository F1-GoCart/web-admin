import Image from 'next/image'

export default function Page() {
  return (
    <div className="flex flex-grow gap-2">
      <div className="w-[20%]  bg-green-500">Sidebar</div>
      <div className="grow  bg-blue-500">Content</div>
    </div>
  )
}
