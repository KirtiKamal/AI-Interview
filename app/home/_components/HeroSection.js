import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative text-center py-20 bg-gray-50 overflow-hidden">
      <div className="relative container mx-auto">
        <h1 className="text-5xl font-bold mb-4">Your Personal AI Interview Coach</h1>
        <p className="text-xl mb-8">Double your chances of landing that job offer with our AI-powered interview prep</p>
        <div className="flex justify-center space-x-4 mb-8">
          <Link href={'/dashboard'}>
            <Button className="bg-blue-600 text-white hover:bg-sky-500 py-2 px-4 rounded">Get Started</Button>
          </Link>
          <button className="bg-white text-blue-600 border border-blue-600 py-2 px-4 rounded">Watch Video</button>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <span className="text-2xl text-gray-500">FEATURED IN</span>
          <div className="flex justify-center space-x-6 mt-3 p-4 gap-12">
            <img src="/linkedin.png" alt="LinkedIn" className="h-8 sm:h-10 md:h-12" />
            <img src="/producthunt.png" alt="Product Hunt" className="h-8 sm:h-10 md:h-12" />
            <img src="/yc.png" alt="YC" className="h-8 sm:h-10 md:h-12" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
