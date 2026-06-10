import HeroSection         from "./sections/HeroSection"
import StatsSection        from "./sections/StatsSection"
import ServicesSection     from "./sections/ServicesSection"
import HowItWorksSection   from "./sections/HowItWorksSection"
import TopDecoratorsSection from "./sections/TopDecoratorsSection"
import TestimonialsSection  from "./sections/TestimonialsSection"
import NewsletterSection    from "./sections/NewsletterSection"
import CTASection           from "./sections/CTASection"
import MapSection           from "./sections/MapSection"

const Home = () => (
  <main className="overflow-hidden">
    <HeroSection />          {/* 1 */}
    <StatsSection />         {/* 2 */}
    <ServicesSection />      {/* 3 */}
    <HowItWorksSection />    {/* 4 */}
    <TopDecoratorsSection /> {/* 5 */}
    <TestimonialsSection />  {/* 6 */}
    <NewsletterSection />    {/* 7 */}
    <CTASection />           {/* 8 */}
    <MapSection />           {/* 9 */}
  </main>
)

export default Home