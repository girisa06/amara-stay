import Hero from "../components/home/Hero";
import WhyChoose from "../components/home/WhyChoose";
import Amenities from "../components/home/Amenities";
import SafetyFeatures from "../components/home/SafetyFeatures";
import FoodDining from "../components/home/FoodDining";
import RoomCategories from "../components/home/RoomCategories";
import Testimonials from "../components/home/Testimonials";
import FAQ from "../components/home/FAQ";
import ContactSection from "../components/home/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChoose />
      <RoomCategories />
      <Amenities />
      <SafetyFeatures />
      <FoodDining />
      <Testimonials />
      <FAQ />
      <ContactSection />
    </>
  );
}
