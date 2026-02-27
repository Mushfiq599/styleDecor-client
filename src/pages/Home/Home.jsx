import HeroSection from "./sections/HeroSection"
import StatsSection from "./sections/StatsSection"
import ServicesSection from "./sections/ServicesSection"
import HowItWorksSection from "./sections/HowItWorksSection"
import TopDecoratorsSection from "./sections/TopDecoratorsSection"
import MapSection from "./sections/MapSection"

const Home = () => {
  return (
    <main className="overflow-hidden">
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <HowItWorksSection />
      <TopDecoratorsSection />
      <MapSection />
    </main>
  )
}

export default Home