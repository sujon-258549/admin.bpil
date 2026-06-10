import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { HeroSliderTab } from "./home/HeroSliderTab";
import { AboutTab } from "./home/AboutTab";
import { ProductsTab } from "./home/ProductsTab";
import { IndustriesTab } from "./home/IndustriesTab";
import { WhyChooseTab } from "./home/WhyChooseTab";
import { ComprehensiveTab } from "./home/ComprehensiveTab";
import { ServicesVideoTab } from "./home/ServicesVideoTab";
import { GalleryTab } from "./home/GalleryTab";
import { FaqTab } from "./home/FaqTab";
import { ContactTab } from "./home/ContactTab";
import { CtaTab } from "./home/CtaTab";
// Force re-evaluation of imports
import { useSearchParams } from "react-router-dom";
import { useCurrentUser } from "@/hooks/use-permission";
import { hasAction, isSuperAdmin } from "@/lib/permissions";

export default function ContentHome() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "hero-slider";

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const user = useCurrentUser();

  const allSections = [
    { id: "hero-slider", key: "content.home.hero-slider", label: "Hero Slider" },
    { id: "about", key: "content.home.about", label: "About Section" },
    { id: "products", key: "content.home.products", label: "Products" },
    { id: "industries", key: "content.home.industries", label: "Industries" },
    { id: "why-choose", key: "content.home.why-choose", label: "Why Choose Us" },
    { id: "comprehensive", key: "content.home.comprehensive", label: "Comprehensive Services" },
    { id: "services-video", key: "content.home.services-video", label: "Services Video" },
    { id: "gallery", key: "content.home.gallery", label: "Gallery" },
    { id: "contact", key: "content.home.contact", label: "Contact" },
    { id: "faq", key: "content.home.faq", label: "FAQ" },
    { id: "cta", key: "content.home.cta", label: "CTA" },
  ];

  const sections = allSections.filter(
    (s) => isSuperAdmin(user) || hasAction(user, s.key, "read")
  );

  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-4">Home Content Management</h1>
      <p className="text-muted-foreground mb-6">
        Manage all dynamic sections for the Home page.
      </p>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="relative flex items-center w-full mb-2">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-md transition-colors hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div
            ref={scrollRef}
            className="w-full overflow-x-auto mx-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <TabsList className="inline-flex h-10 w-max min-w-full items-center justify-start gap-1 rounded-md bg-muted p-1 text-muted-foreground">
              {sections.map((section) => (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="whitespace-nowrap px-3 py-1.5 text-sm font-medium"
                >
                  {section.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-background shadow-md transition-colors hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {sections.map((section) => (
          <TabsContent
            key={section.id}
            value={section.id}
            className="mt-4 outline-none"
          >
            {section.id === "hero-slider" ? (
              <HeroSliderTab />
            ) : section.id === "about" ? (
              <AboutTab />
            ) : section.id === "products" ? (
              <ProductsTab />
            ) : section.id === "industries" ? (
              <IndustriesTab />
            ) : section.id === "why-choose" ? (
              <WhyChooseTab />
            ) : section.id === "comprehensive" ? (
              <ComprehensiveTab />
            ) : section.id === "services-video" ? (
              <ServicesVideoTab />
            ) : section.id === "gallery" ? (
              <GalleryTab />
            ) : section.id === "faq" ? (
              <FaqTab />
            ) : section.id === "contact" ? (
              <ContactTab />
            ) : section.id === "cta" ? (
              <CtaTab />
            ) : (
              <div className="rounded-lg border bg-card text-card-foreground p-6">
                <h2 className="text-lg font-medium mb-4">{section.label}</h2>
                <p className="text-sm text-muted-foreground">
                  Configuration and content fields for the {section.label}{" "}
                  section will go here.
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
