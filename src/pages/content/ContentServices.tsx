import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ServicesBannerTab } from "./services/ServicesBannerTab";
import { ServicesIntroTab } from "./services/ServicesIntroTab";
import { ServicesMaintenanceTab } from "./services/ServicesMaintenanceTab";
import { ServicesSmartTab } from "./services/ServicesSmartTab";
import { ServicesProcessTab } from "./services/ServicesProcessTab";
import { ServicesHighlightsTab } from "./services/ServicesHighlightsTab";
import { ServicesConsultLineTab } from "./services/ServicesConsultLineTab";
import { ServicesCtaTab } from "./services/ServicesCtaTab";

const sections = [
  { id: "banner", label: "Page Banner", component: ServicesBannerTab },
  { id: "intro", label: "Intro Section", component: ServicesIntroTab },
  { id: "maintenance", label: "Maintenance", component: ServicesMaintenanceTab },
  { id: "smart", label: "Smart Solutions", component: ServicesSmartTab },
  { id: "process", label: "Our Process", component: ServicesProcessTab },
  { id: "highlights", label: "Highlights", component: ServicesHighlightsTab },
  { id: "consult", label: "Consultation Line", component: ServicesConsultLineTab },
  { id: "cta", label: "Call To Action", component: ServicesCtaTab },
];

export default function ContentServices() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeTab = searchParams.get("tab") || sections[0].id;

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

  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-4">Services Page Content Management</h1>
      <p className="text-muted-foreground mb-6">Manage all dynamic sections for the Services page.</p>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                <TabsTrigger key={section.id} value={section.id} className="whitespace-nowrap px-3 py-1.5 text-sm font-medium">
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

        {sections.map((section) => {
          const Component = section.component;
          return (
            <TabsContent key={section.id} value={section.id} className="mt-4 outline-none">
              <Component />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
