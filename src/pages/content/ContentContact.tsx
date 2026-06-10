import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactBannerTab } from "./contact/ContactBannerTab";
import { ContactInfoTab } from "./contact/ContactInfoTab";
import { ContactFaqTab } from "./contact/ContactFaqTab";

import { useCurrentUser } from "@/hooks/use-permission";
import { hasAction, isSuperAdmin } from "@/lib/permissions";

const allSections = [
  { id: "banner", key: "content.contact.banner", label: "Page Banner", component: ContactBannerTab },
  { id: "info", key: "content.contact.info", label: "Contact Info & Map", component: ContactInfoTab },
  { id: "faq", key: "content.contact.faq", label: "FAQ Section", component: ContactFaqTab },
];

export default function ContentContact() {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useCurrentUser();
  
  const sections = allSections.filter(
    (s) => isSuperAdmin(user) || hasAction(user, s.key, "read")
  );

  const activeTab = searchParams.get("tab") || sections[0]?.id;

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-4">Contact Content Management</h1>
      <p className="text-muted-foreground mb-6">Manage dynamic content for the Contact page.</p>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-4 flex flex-wrap h-auto justify-start gap-1 p-1">
          {sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="whitespace-nowrap">
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => {
          const Component = section.component;
          return (
            <TabsContent key={section.id} value={section.id} className="outline-none">
              <Component />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
