import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { Pricing } from '../components/Pricing';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <main className="relative z-10 w-full">
      <Hero />
      <Features />
      <Pricing />
      <div className="min-h-[50vh] flex flex-col justify-end">
        <Footer />
      </div>
    </main>
  );
}
