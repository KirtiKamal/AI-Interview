"use client"
import React from "react";
import { UserButton } from "@clerk/nextjs";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";
import { motion } from "framer-motion";

function DashboardLayout() {
  return (
    <div className="p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-10"
      >
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Dashboard
        </h2>
        <h2 className="text-gray-600 mt-2">Create and Start your AI Interview</h2>
      </motion.div>
     
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 my-5"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-gray-100">
          <AddNewInterview/>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <InterviewList/>
      </motion.div>
    </div>
  );
}

export default DashboardLayout;
