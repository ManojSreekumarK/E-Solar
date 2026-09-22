import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ReductionStat from "@/components/ReductionStat";
import PanelAnatomy from "@/components/PanelAnatomy";
import Calculator from "@/components/Calculator";
import Process from "@/components/Process";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <div id="features" className="scroll-mt-24">
          {/* One stacking context for all three: each pins in turn and the
              next slides up over it, so a neighbouring section is never
              revealed as a sliver at the edge of the viewport. Must not gain
              `overflow-hidden`, which would kill the sticky behaviour. */}
          <div className="relative">
            <About />
            <ReductionStat />
            {/* Dwell space: ReductionStat is `sticky h-screen`, so its own
                flow height gives it no time on screen before the next section
                arrives. This scrolls past while it stays pinned. */}
            <div aria-hidden className="h-[15vh]" />
            <PanelAnatomy />
          </div>
        </div>
        <Calculator />
        <Process />
      </main>
      <Footer />
    </>
  );
}
