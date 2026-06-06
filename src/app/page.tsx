"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BloodInventory from "@/components/BloodInventory";
import DonorRegistration from "@/components/DonorRegistration";
import EmergencyRequests from "@/components/EmergencyRequests";
import DashboardPreview from "@/components/DashboardPreview";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import ContactFooter from "@/components/ContactFooter";
import SectionDivider from "@/components/SectionDivider";
import AIChatbot from "@/components/AIChatbot";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";

// Lazy-load 3D background (heavy Three.js bundle)
const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative">
      <CustomCursor />
      <ThreeBackground />
      <Navbar />
      <Hero />
      <SectionDivider />
      <BloodInventory />
      <SectionDivider />
      <DonorRegistration />
      <SectionDivider />
      <EmergencyRequests />
      <SectionDivider />
      <DashboardPreview />
      <SectionDivider />
      <Features />
      <SectionDivider />
      <Testimonials />
      <SectionDivider />
      <ContactFooter />
      <PageTransition />
      <AIChatbot />
    </main>
  );
}
