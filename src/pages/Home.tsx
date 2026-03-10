import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Pricing } from '../components/Pricing';
import { Footer } from '../components/Footer';
import { AdsterraBox } from '../components/AdsterraBox';

export function Home() {
  return (
    <main className="relative z-10 w-full">
      <Hero />
      
      {/* Ad Placement 1 */}
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <AdsterraBox id="ad-top" width={728} height={90} />
      </div>

      <Features />
      
      {/* Ad Placement 2 */}
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <AdsterraBox id="ad-mid" width={300} height={250} />
      </div>

      <Pricing />
      
      <div className="min-h-[50vh] flex flex-col justify-end">
        <Footer />
      </div>
    </main>
  );
}
