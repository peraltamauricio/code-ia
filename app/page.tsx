import ScrollFx from "@/components/ScrollFx";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StatusBar from "@/components/StatusBar";
import Niveles from "@/components/Niveles";
import Clases from "@/components/Clases";
import Programa from "@/components/Programa";
import Metodo from "@/components/Metodo";
import Info from "@/components/Info";
import Talleristas from "@/components/Talleristas";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <div className="bg-grid" />
      <ScrollFx />
      <Nav />
      <Hero />
      <StatusBar />
      <Niveles />
      <Clases />
      <Programa />
      <Metodo />
      <Info />
      <Talleristas />
      <Cta />
      <Footer />
    </>
  );
}
