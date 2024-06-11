import Link from "next/link";
import { Button } from "@/components/ui/button";
const HowItWorks = () => {
  return (
    <section className="text-center py-20 bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold mb-12">How it Works?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-100 rounded-lg shadow">
            <h3 className="text-2xl font-bold mb-4">Write Prompt for Your Interview</h3>
            <p>Describe the job position, requirements, and any specific areas you want to focus on during the interview.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow">
            <h3 className="text-2xl font-bold mb-4">Review and Customize Your Interview</h3>
            <p>Edit the generated interview questions and customize them according to your preferences and needs.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow">
            <h3 className="text-2xl font-bold mb-4">Start Conducting Mock Interviews</h3>
            <p>Share your interview form with candidates and start accepting responses. Conduct mock interviews anytime, anywhere!</p>
          </div>
        </div>
        <Link href={'/dashboard'}>
            <Button className="bg-emerald-600 hover:bg-teal-700 text-white py-2 px-4 rounded mt-8">Get Started Today</Button>
          </Link>
      </div>
    </section>
  );
};

export default HowItWorks;
