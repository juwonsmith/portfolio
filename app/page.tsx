import Scene from "@/components/Scene";
import Preloader from "@/components/ui/Preloader";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Marquee from "@/components/ui/Marquee";

export default function Home() {
  return (
    <>
      <Preloader />
      <Scene />
      <main className="relative z-10">
        <Hero />
        <About />
        <Marquee />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
