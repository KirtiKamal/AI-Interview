"use client"
import React, { act, useEffect, useState } from 'react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import QuestionsSection from './_components/QuestionsSection'
import RecordAnswerSection from './_components/RecordAnswerSection'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState()
  const [interviewQuestion, setInterviewQuestion] = useState()
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getInterviewDetails()
  }, [])

  const getInterviewDetails = async () => {
    try {
      setLoading(true)
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId))

      console.log('Database result:', result)
      
      if (!result || result.length === 0) {
        throw new Error('No interview data found')
      }

      const jsonMockResp = JSON.parse(result[0].jsonMockResp)
      console.log('Raw JSON response:', jsonMockResp)
      
      // Handle different possible JSON structures
      let questionsArray
      if (Array.isArray(jsonMockResp)) {
        questionsArray = jsonMockResp
      } else if (jsonMockResp.questions && Array.isArray(jsonMockResp.questions)) {
        questionsArray = jsonMockResp.questions
      } else if (jsonMockResp.interviewQuestions && Array.isArray(jsonMockResp.interviewQuestions)) {
        questionsArray = jsonMockResp.interviewQuestions
      } else {
        console.error('Unexpected JSON structure:', jsonMockResp)
        throw new Error('Invalid question format: Expected an array of questions')
      }

      // Validate each question has the required fields
      const validQuestions = questionsArray.map((q, index) => {
        if (!q.question) {
          console.warn(`Question at index ${index} is missing the 'question' field`)
          return { ...q, question: 'Question not available' }
        }
        return q
      })

      console.log('Processed questions:', validQuestions)
      setInterviewQuestion(validQuestions)
      setInterviewData(result[0])
    } catch (err) {
      console.error('Error fetching interview details:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="text-red-500 font-bold">Error: {error}</div>
            <div className="mt-2 text-sm text-gray-600">
              Please check if the interview questions are properly formatted in the database.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Questions Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100 p-6"
          >
            <QuestionsSection 
              interviewQuestion={interviewQuestion}
              activeQuestionIndex={activeQuestionIndex}
            />
          </motion.div>

          {/* Video and Audio recording */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100 p-6"
          >
            <RecordAnswerSection
              interviewQuestion={interviewQuestion}
              activeQuestionIndex={activeQuestionIndex}
              interviewData={interviewData}
            />
          </motion.div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          {activeQuestionIndex > 0 && (
            <Button
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Previous Question
            </Button>
          )}
          {activeQuestionIndex !== interviewQuestion?.length - 1 && (
            <Button
              onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Next Question
            </Button>
          )}
          {activeQuestionIndex === interviewQuestion?.length - 1 && (
            <Link href={'/dashboard/interview/' + interviewData?.mockId + "/feedback"}>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                End Interview
              </Button>
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default StartInterview
