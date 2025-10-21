'use client'
import { usePathname } from 'next/navigation'

export default function Classification() {
    const pathname = usePathname()
    return (
        <>
        <h1>Hallo {pathname}</h1>
        </>
    )
}