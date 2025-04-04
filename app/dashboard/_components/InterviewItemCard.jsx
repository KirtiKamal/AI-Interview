"use client"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Briefcase } from 'lucide-react'

function InterviewItemCard({interview}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-lg">
          <Briefcase className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            {interview?.jobPosition}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{interview?.jobExperience} Years Exp.</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{interview?.createdAt}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {interview?.jobDesc}
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <Link href={"/dashboard/interview/"+interview?.mockId+"/feedback"} className="flex-1">
          <Button 
            variant="outline" 
            className="w-full border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            View Feedback
          </Button>
        </Link>
        <Link href={"/dashboard/interview/"+interview?.mockId} className="flex-1">
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Interview
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

export default InterviewItemCard
