"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { db } from "@/utils/db";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(jobPosition, jobDesc, jobExperience);

      if (!jobPosition || !jobDesc || !jobExperience) {
        console.error("All fields are required");
        setLoading(false);
        return;
      }

      const InputPrompt =
        `Job Position: ${jobPosition}, Job Description: ${jobDesc}, ` +
        `Years of Experience: ${jobExperience}, Depends on Job Position, ` +
        `Job Description and Years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} ` +
        `Interview questions along with Answer in JSON format, Give us questions and answer field on JSON`;

      const result = await chatSession.sendMessage(InputPrompt);

      // Ensure result.response.text() is awaited properly
      const responseText = await result.response.text();

      // Log the raw response for debugging
      console.log("Raw response:", responseText);

      // Clean the response to remove unexpected characters
      const cleanedResponse = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // Log the cleaned response for debugging
      console.log("Cleaned response:", cleanedResponse);

      // Attempt to parse the JSON
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        console.error("Response received:", cleanedResponse);
        setLoading(false);
        return;
      }

      console.log(parsedResponse);
      setJsonResponse(parsedResponse);

      if (parsedResponse) {
        const resp = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: JSON.stringify(parsedResponse), // Convert object to string
            jobPosition,
            jobDescription: jobDesc, // Ensure correct field name
            jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-YYYY"),
          })
          .returning({ mockId: MockInterview.mockId });

        console.log("Inserted ID:", resp);

        if (resp) {
          setOpenDialog(false);
          router.push("/dashboard/interview/" + resp[0]?.mockId);
        }
      } else {
        console.log("ERROR: No valid response from AI");
      }
    } catch (error) {
      console.error("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all">
      <Dialog>
        <DialogTrigger className="text-lg text-center md:ml-24 ">
          + Add New
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add details about your job position/role, Job description
                    and years of experience
                  </h2>

                  <div className="mt-7 my-2">
                    <label>Job Role</label>
                    <Input
                      className="mt-2"
                      placeholder="Ex. Software Engineer"
                      required
                      value={jobPosition}
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>
                  <div className="mt-7 my-2">
                    <label>Job Description</label>
                    <Textarea
                      className="mt-2"
                      placeholder="Ex. React, Nodejs, Docker"
                      required
                      value={jobDesc}
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>
                  <div className="mt-7 my-2">
                    <label>Years of experience</label>
                    <Input
                      className="mt-2"
                      placeholder="Ex.5"
                      type="number"
                      required
                      value={jobExperience}
                      onChange={(event) => setJobExperience(event.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  {/* <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  
                  >
                    Cancel
                  </Button> */}
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Generating
                        from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
