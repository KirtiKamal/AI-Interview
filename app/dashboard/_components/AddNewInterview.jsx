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
import { Loader2, PlusCircle, Sparkles } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { db } from "@/utils/db";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(jobPosition, jobDescription, jobExperience);

      if (!jobPosition || !jobDescription || !jobExperience) {
        console.error("All fields are required");
        setLoading(false);
        return;
      }

      const InputPrompt =
        `Job Position: ${jobPosition}, Job Description: ${jobDescription}, ` +
        `Years of Experience: ${jobExperience}, Depends on Job Position, ` +
        `Job Description and Years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} ` +
        `Interview questions along with Answer in JSON format, Give us questions and answer field on JSON`;

      const result = await chatSession.sendMessage(InputPrompt);
      const mockJsonResp = (await result.response.text())
        .replace("```json", "")
        .replace("```", "")
        .trim();
      const jsonFeedbackResp = JSON.parse(mockJsonResp);

      const mockId = uuidv4();
      const resp = await db.insert(MockInterview)
        .values({
          mockId: mockId,
          jobPosition: jobPosition,
          jobDescription: jobDescription,
          jobExperience: jobExperience,
          jsonMockResp: JSON.stringify(jsonFeedbackResp),
          createdBy: user?.primaryEmailAddress.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning();

      if (resp) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + mockId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 hover:border-blue-500 transition-all duration-300 cursor-pointer"
        >
          <PlusCircle className="w-12 h-12 text-blue-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">Add New Interview</h3>
          <p className="text-gray-500 text-center mt-2">Create a new mock interview session</p>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">Create New Interview</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobPosition" className="text-gray-700">Job Position</Label>
            <Input
              id="jobPosition"
              placeholder="e.g., Software Engineer"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
              className="bg-white/80 backdrop-blur-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobExperience" className="text-gray-700">Years of Experience</Label>
            <Input
              id="jobExperience"
              type="number"
              placeholder="e.g., 3"
              value={jobExperience}
              onChange={(e) => setJobExperience(e.target.value)}
              className="bg-white/80 backdrop-blur-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobDescription" className="text-gray-700">Job Description</Label>
            <Textarea
              id="jobDescription"
              placeholder="Enter job description..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="bg-white/80 backdrop-blur-xl min-h-[100px]"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Interview"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewInterview;
