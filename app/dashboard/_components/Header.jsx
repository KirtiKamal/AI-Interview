"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { motion } from 'framer-motion'

function Header() {
    const path = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            {/* Blurred background */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xl"></div>
            
            {/* Content */}
            <div className="relative flex p-4 items-center justify-between">
                <Link href="/" className="flex items-center">
                    <Image src={'./logo.svg'} width={160} height={100} alt='logo' className="hover:scale-105 transition-transform duration-300" />
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${path === '/dashboard' ? 'text-primary font-bold' : 'text-gray-600'}`}>
                        Dashboard
                    </Link>
                    <Link href="/dashboard/questions" className={`text-sm font-medium transition-colors hover:text-primary ${path === '/dashboard/questions' ? 'text-primary font-bold' : 'text-gray-600'}`}>
                        Questions
                    </Link>
                    <Link href="/dashboard/upgrade" className={`text-sm font-medium transition-colors hover:text-primary ${path === '/dashboard/upgrade' ? 'text-primary font-bold' : 'text-gray-600'}`}>
                        Upgrade
                    </Link>
                    <Link href="/dashboard/how" className={`text-sm font-medium transition-colors hover:text-primary ${path === '/dashboard/how' ? 'text-primary font-bold' : 'text-gray-600'}`}>
                        How it works?
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </header>
    )
}

export default Header
