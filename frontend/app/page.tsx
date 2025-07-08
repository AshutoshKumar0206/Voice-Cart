import AllProductsPage from "@/components/Hero/AllProductsPage";
import Footer from "@/components/Hero/Footer";
import Hero from "@/components/Hero/Hero";
import HowItWorks from "@/components/Hero/HowItWorks";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Hero/Newsletter";
import TopDealsSlider from "@/components/Hero/TopDeals";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <TopDealsSlider />
      <AllProductsPage />
      <HowItWorks />
      <Newsletter />
      <Footer />
    </>
  );
}
