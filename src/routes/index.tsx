import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { CustomCursor } from "@/components/site/CustomCursor";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Intro } from "@/components/site/Intro";
import { WhatIDo } from "@/components/site/WhatIDo";
import { WhyDifferent } from "@/components/site/WhyDifferent";
import { Work } from "@/components/site/Work";
import { ExperienceList } from "@/components/site/ExperienceList";
import { Community } from "@/components/site/Community";
import { Ecosystem } from "@/components/site/Ecosystem";
import { Metrics } from "@/components/site/Metrics";
import { Internet } from "@/components/site/Internet";
import { About } from "@/components/site/About";
import { Blog } from "@/components/site/Blog";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";

const TITLE = "Shashwat Chauhan — Software Engineer & Web3 Builder";
const DESCRIPTION =
  "Portfolio of Shashwat Chauhan: software engineer, Web3 builder and community builder. Projects include Shepherd, TradeVault Arena, VaraSplit and Flekvar.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Nav />
      <main>
        <Hero />
        <Intro />
        <WhatIDo />
        <WhyDifferent />
        <Work />
        <ExperienceList />
        <Community />
        <Ecosystem />
        <Metrics />
        <Internet />
        <Blog />
        <About />
        <FinalCta />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
