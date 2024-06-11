"use client";
import { UserAnswer } from "@/utils/schema";
import { db } from "@/utils/db";
import React, { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);
  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);

    console.log(result);
    setFeedbackList(result);
  };
  return (
    <div className="p-10">
      {feedbackList?.length == 0 ? (
        <h2 className="font-bold text-xl text-gray-500">
          No Interview Feedback Record Found
        </h2>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-green-500">
            Congratulations!!
          </h2>
          <h2 className="text-3xl font-bold">
            Here is your interview feedback
          </h2>
          <h2 className="text-lg text-primary my-3">
            Your overall interview rating: <strong>7/10</strong>
          </h2>

          <h2 className="text-sm text-gray-500">
            Find below interview question with correct answer, Your answer and
            feedback for improvement
          </h2>
          {feedbackList &&
            feedbackList.map((item, index) => (
              <Collapsible className="mt-7" key={index}>
                <CollapsibleTrigger className="p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full">
                  {item.question} <ChevronsUpDown className="h-5 w-5" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-red-500 p-2 border rounded-lg">
                      <strong>Rating:</strong>
                      {item.rating}
                    </h2>
                    <h2 className="text-sm bg-red-50 text-red-950 p-2 border rounded-lg">
                      <strong>Your Answer: </strong>
                      {item.UserAns}
                    </h2>
                    <h2 className="text-sm bg-green-50 text-green-950 p-2 border rounded-lg">
                      <strong>Correct Answer: </strong>
                      {item.correctAns}
                    </h2>
                    <h2 className="text-sm bg-blue-50 text-primary p-2 border rounded-lg">
                      <strong>Feedback: </strong>
                      {item.feedback}
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
        </>
      )}
      <Button onClick={() => router.replace("/dashboard")}>GO Home</Button>
    </div>
  );
}

export default Feedback;
