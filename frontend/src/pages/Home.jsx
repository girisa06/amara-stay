import Hero from "../components/home/Hero";
import WhyChoose from "../components/home/WhyChoose";
import Amenities from "../components/home/Amenities";
import FoodDining from "../components/home/FoodDining";
import RoomCategories from "../components/home/RoomCategories";
import FAQ from "../components/home/FAQ";
import ContactSection from "../components/home/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyChoose />
      <RoomCategories />
      <Amenities />
      <FoodDining />
      <FAQ />
      <ContactSection />
    </>
  );
}
