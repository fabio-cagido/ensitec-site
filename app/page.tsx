import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import TechStackSection from "@/components/TechStackSection";
import VideoSection from "@/components/VideoSection";
import Image from "next/image";

export default function Home() {
  return (
    <main>
    <Hero />
    <VideoSection />
    <ServicesSection />
    <ProcessSection />
    <TechStackSection />
    
    </main>
    
  );
}
