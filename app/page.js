import { Button } from "@/components/ui/button";
import Image from "next/image";
import HeroSection from "./home/_components/HeroSection";
import HowItWorks from "./home/_components/HowItWorks";
import Header from "./dashboard/_components/Header";
import Footer from "./home/_components/Footer";


export default function Home() {
  return (
    <div>
      <Header/>
      <HeroSection/>
      <HowItWorks/>
      {/* <Button>Login</Button> */}
      <Footer/>
    </div>
  );
}
