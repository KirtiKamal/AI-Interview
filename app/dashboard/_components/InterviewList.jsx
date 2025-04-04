"use client"
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db';
import InterviewItemCard from './InterviewItemCard';
import { motion } from 'framer-motion';
import { Briefcase, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

function InterviewList() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        user && getInterviewList();
    }, [user]);

    const getInterviewList = async () => {
        const result = await db.select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress));
        setInterviewList(result);
    };

    const filteredInterviews = interviewList.filter(interview => 
        interview.jobPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        interview.jobDesc.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-6 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100"
            >
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-lg">
                    <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">My Interviews</h1>
                    <p className="text-gray-500">Manage and track your interview sessions</p>
                </div>
            </motion.div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                    placeholder="Search interviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/80 backdrop-blur-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredInterviews.map((interview, index) => (
                    <motion.div
                        key={interview.mockId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <InterviewItemCard interview={interview} />
                    </motion.div>
                ))}
            </div>

            {filteredInterviews.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100"
                >
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No interviews found</h3>
                    <p className="text-gray-500">Create a new interview to get started</p>
                </motion.div>
            )}
        </div>
    );
}

export default InterviewList;
