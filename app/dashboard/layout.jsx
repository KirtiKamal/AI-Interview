"use client"
import React from 'react'
import Header from './_components/Header'

function DashboardLayout({children}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Blurred background elements */}
            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Main content */}
            <div className="relative">
                <Header/>
                <main className="pt-20">
                    <div className="mx-5 md:mx-20 lg:mx-36">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout
