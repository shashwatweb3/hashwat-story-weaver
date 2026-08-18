import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { CustomCursor } from "@/components/site/CustomCursor";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { WhyDifferent } from "@/components/site/WhyDifferent";
import { Community } from "@/components/site/Community";
import { Internet } from "@/components/site/Internet";
import { Blog } from "@/components/site/Blog";
import { Work } from "@/components/site/Work";
import { ExperienceList } from "@/components/site/ExperienceList";
import { About } from "@/components/site/About";
import { Footer } from "@/components/site/Footer";
import { listArticles } from "@/lib/api/articles";

const TITLE = "Shashwat Chauhan — Software Engineer & Web3 Builder";
const DESCRIPTION =
  "Portfolio of Shashwat Chauhan: software engineer, Web3 builder and community builder. Projects include Shepherd, TradeVault Arena, VaraSplit and Flekvar.";

export const Route = createFileRoute("/")({
  loader: async () => {
    const articles = await listArticles();
    return { articles };
  },
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
  const { articles } = Route.useLoaderData();
  return (
    <SmoothScroll>
      <CustomCursor />
      <Nav />
      <main>
        <Hero />
        <WhyDifferent />
        <Community />
        <Internet />
        <Blog articles={articles} />
        <Work />
        <ExperienceList />
        <About />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
