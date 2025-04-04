"use client"
import React, { act, useEffect, useState } from 'react'
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from "drizzle-orm";
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
function StartInterview({params}) {
    const [interviewData, setInterviewData] = useState();
    const [interviewQuestion, setInterviewQuestion] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getInterviewDetails();
    }, []);

    const getInterviewDetails = async () => {
        try {
            setLoading(true);
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));

            console.log('Database result:', result);
            
            if (!result || result.length === 0) {
                throw new Error('No interview data found');
            }

            const jsonMockResp = JSON.parse(result[0].jsonMockResp);
            console.log('Raw JSON response:', jsonMockResp);
            
            // Handle different possible JSON structures
            let questionsArray;
            if (Array.isArray(jsonMockResp)) {
                questionsArray = jsonMockResp;
            } else if (jsonMockResp.questions && Array.isArray(jsonMockResp.questions)) {
                questionsArray = jsonMockResp.questions;
            } else if (jsonMockResp.interviewQuestions && Array.isArray(jsonMockResp.interviewQuestions)) {
                questionsArray = jsonMockResp.interviewQuestions;
            } else {
                console.error('Unexpected JSON structure:', jsonMockResp);
                throw new Error('Invalid question format: Expected an array of questions');
            }

            // Validate each question has the required fields
            const validQuestions = questionsArray.map((q, index) => {
                if (!q.question) {
                    console.warn(`Question at index ${index} is missing the 'question' field`);
                    return { ...q, question: 'Question not available' };
                }
                return q;
            });

            console.log('Processed questions:', validQuestions);
            setInterviewQuestion(validQuestions);
            setInterviewData(result[0]);
        } catch (err) {
            console.error('Error fetching interview details:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-5">Loading interview questions...</div>;
    }

    if (error) {
        return (
            <div className="p-5">
                <div className="text-red-500 font-bold">Error: {error}</div>
                <div className="mt-2 text-sm text-gray-600">
                    Please check if the interview questions are properly formatted in the database.
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Questions */}
                <QuestionsSection 
                    interviewQuestion={interviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                />

                {/* Video and Audio recording */}
                <RecordAnswerSection
                    interviewQuestion={interviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                />
            </div>
            <div className="flex justify-end gap-6 mt-5">
                {activeQuestionIndex > 0 && (
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
                        Previous Question
                    </Button>
                )}
                {activeQuestionIndex !== interviewQuestion?.length - 1 && (
                    <Button onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
                        Next Question
                    </Button>
                )}
                {activeQuestionIndex === interviewQuestion?.length - 1 && (
                    <Link href={'/dashboard/interview/' + interviewData?.mockId + "/feedback"}>
                        <Button>End Interview</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default StartInterview;
