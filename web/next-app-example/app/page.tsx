import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Plugins } from "@/components/landing/plugins";
import { CodeExample } from "@/components/landing/code-example";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <Header />
      <main>
        <Hero />
        <Features />
        <Plugins />
        <CodeExample />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
