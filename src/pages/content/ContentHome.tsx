import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

export default function ContentHome() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }
  const sections = [
    { id: "hero-slider", label: "Hero Slider" },
    { id: "maintenance", label: "Maintenance" },
    { id: "products", label: "Products" },
    { id: "industries", label: "Industries" },
    { id: "why-choose", label: "Why Choose Us" },
    { id: "comprehensive", label: "Comprehensive Services" },
    { id: "services-video", label: "Services Video" },
    { id: "gallery", label: "Gallery" },
    { id: "blog", label: "Blog" },
    { id: "contact", label: "Contact" },
    { id: "faq", label: "FAQ" },
    { id: "cta", label: "CTA" },
  ]

  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-4">Home Content Management</h1>
      <p className="text-muted-foreground mb-6">Manage all dynamic sections for the Home page.</p>

      <Tabs defaultValue="hero-slider" className="w-full">
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

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-4 outline-none">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">{section.label}</h2>
              <p className="text-sm text-muted-foreground">
                Configuration and content fields for the {section.label} section will go here.
              </p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
