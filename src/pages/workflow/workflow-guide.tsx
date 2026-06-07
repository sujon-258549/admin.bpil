import { useState } from "react"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  KeyRound,
  LogIn,
  Sparkles,
  UserCog,
  Users,
  Newspaper,
  MessageSquare,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Lang = "en" | "bn"

type Step = {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  path?: string
}

type Copy = {
  pageTitle: string
  pageSubtitle: string
  langEnglish: string
  langBangla: string

  hierarchy: {
    heading: string
    platform: { title: string; desc: string }
    branch: { title: string; desc: string }
    admin: { title: string; desc: string }
    employees: { title: string; desc: string }
  }

  platformFlow: {
    heading: string
    subtitle: string
    steps: Step[]
  }

  branchFlow: {
    heading: string
    subtitle: string
    steps: Step[]
  }

  permission: {
    heading: string
    rows: { who: string; sees: string }[]
  }

  tip: { title: string; lines: string[] }
}

const EN: Copy = {
  pageTitle: "System Workflow Guide",
  pageSubtitle: "How the platform is structured, set up, and operated.",
  langEnglish: "English",
  langBangla: "বাংলা",

  hierarchy: {
    heading: "The Hierarchy",
    platform: {
      title: "Super Admin",
      desc: "Full access to the entire system. Can configure roles, employees, and settings.",
    },
    branch: {
      title: "Department",
      desc: "Organizes employees into logical groups (e.g., Content, Sales, HR).",
    },
    admin: {
      title: "Managers",
      desc: "Users with elevated roles to oversee specific modules like Blogs or Inquiries.",
    },
    employees: {
      title: "Employees",
      desc: "Standard users with access limited by their assigned Role.",
    },
  },

  platformFlow: {
    heading: "Initial Setup Workflow",
    subtitle: "Steps to configure the system before adding employees.",
    steps: [
      {
        icon: Building2,
        title: "1. Departments",
        desc: "Create logical groupings for your team (e.g., Sales, Marketing).",
        path: "/employees/departments",
      },
      {
        icon: Sparkles,
        title: "2. Designations",
        desc: "Add job titles for your employees (e.g., Executive, Manager).",
        path: "/employees/designations",
      },
      {
        icon: KeyRound,
        title: "3. Roles & Permissions",
        desc: "Define roles and decide exactly what each role can see and do.",
        path: "/employees/roles",
      },
    ],
  },

  branchFlow: {
    heading: "Employee & Operations",
    subtitle: "Adding the team and running daily tasks.",
    steps: [
      {
        icon: Users,
        title: "1. Add Employees",
        desc: "Create employee accounts and assign them to roles and departments.",
        path: "/employees",
      },
      {
        icon: Newspaper,
        title: "2. Content Management",
        desc: "Write and publish blog posts, and manage the media library.",
        path: "/blog",
      },
      {
        icon: MessageSquare,
        title: "3. Inquiries",
        desc: "Handle incoming customer inquiries and contacts.",
        path: "/inquiries/contacts",
      },
      {
        icon: Activity,
        title: "4. Audit Logs",
        desc: "Track system activities and errors for security and debugging.",
        path: "/logs",
      },
      {
        icon: LogIn,
        title: "5. Employee Login",
        desc: "Employees log in and perform only their allowed tasks.",
        path: "/login",
      },
      {
        icon: CheckCircle2,
        title: "6. Daily Operations",
        desc: "The system is now fully operational and ready for daily use.",
      },
    ],
  },

  permission: {
    heading: "Who sees what",
    rows: [
      {
        who: "Super Admin",
        sees: "Every module, every setting, and all data across the platform.",
      },
      {
        who: "Department Managers",
        sees: "Modules relevant to their department (e.g., Marketing sees Blogs).",
      },
      {
        who: "Employees",
        sees: "Only the specific modules and actions allowed by their Role.",
      },
    ],
  },

  tip: {
    title: "Things you should not forget",
    lines: [
      "Always set up Departments, Designations, and Roles before adding Employees.",
      "Be careful when assigning the 'Super Admin' role to any user.",
      "Use the Action Logs to audit who made changes in the system.",
    ],
  },
}

const BN: Copy = {
  pageTitle: "সিস্টেম ওয়ার্কফ্লো গাইড",
  pageSubtitle: "প্ল্যাটফর্মটি কীভাবে সাজানো, সেটআপ এবং পরিচালিত হয়।",
  langEnglish: "English",
  langBangla: "বাংলা",

  hierarchy: {
    heading: "হায়ারার্কি (কে কোথায়)",
    platform: {
      title: "Super Admin",
      desc: "সিস্টেমের সম্পূর্ণ অ্যাক্সেস। Role, Employee এবং Settings কনফিগার করতে পারেন।",
    },
    branch: {
      title: "Department",
      desc: "কর্মচারীদের কাজের ভিত্তিতে আলাদা করা (যেমন: Content, Sales, HR)।",
    },
    admin: {
      title: "Managers",
      desc: "Blog বা Inquiries এর মতো নির্দিষ্ট মডিউল পরিচালনা করার জন্য বিশেষ Role।",
    },
    employees: {
      title: "Employees",
      desc: "সাধারণ ব্যবহারকারী, যাদের অ্যাক্সেস Role এর উপর নির্ভর করে।",
    },
  },

  platformFlow: {
    heading: "প্রাথমিক সেটআপ",
    subtitle: "কর্মচারী যুক্ত করার আগে সিস্টেম কনফিগার করার ধাপসমূহ।",
    steps: [
      {
        icon: Building2,
        title: "১. Departments",
        desc: "আপনার টিমের জন্য বিভাগ তৈরি করুন (যেমন: Sales, Marketing)।",
        path: "/employees/departments",
      },
      {
        icon: Sparkles,
        title: "২. Designations",
        desc: "কর্মচারীদের পদবি যুক্ত করুন (যেমন: Executive, Manager)।",
        path: "/employees/designations",
      },
      {
        icon: KeyRound,
        title: "৩. Roles & Permissions",
        desc: "Role তৈরি করুন এবং ঠিক করুন কে কী দেখতে ও করতে পারবে।",
        path: "/employees/roles",
      },
    ],
  },

  branchFlow: {
    heading: "কর্মচারী এবং দৈনন্দিন কাজ",
    subtitle: "টিম যুক্ত করা এবং অপারেশন শুরু করা।",
    steps: [
      {
        icon: Users,
        title: "১. Add Employees",
        desc: "কর্মচারী অ্যাকাউন্ট তৈরি করুন এবং তাদের Role ও Department নির্ধারণ করুন।",
        path: "/employees",
      },
      {
        icon: Newspaper,
        title: "২. Content Management",
        desc: "ব্লগ পোস্ট লিখুন এবং মিডিয়া লাইব্রেরি পরিচালনা করুন।",
        path: "/blog",
      },
      {
        icon: MessageSquare,
        title: "৩. Inquiries",
        desc: "গ্রাহকদের জিজ্ঞাসা এবং যোগাযোগ পরিচালনা করুন।",
        path: "/inquiries/contacts",
      },
      {
        icon: Activity,
        title: "৪. Audit Logs",
        desc: "সিস্টেমের অ্যাক্টিভিটি এবং এরর ট্র্যাক করুন।",
        path: "/logs",
      },
      {
        icon: LogIn,
        title: "৫. Employee Login",
        desc: "কর্মচারীরা লগইন করে শুধুমাত্র তাদের অনুমোদিত কাজগুলো করবে।",
        path: "/login",
      },
      {
        icon: CheckCircle2,
        title: "৬. Daily Operations",
        desc: "সিস্টেম এখন পুরোপুরি প্রস্তুত এবং দৈনন্দিন কাজ চলবে।",
      },
    ],
  },

  permission: {
    heading: "কে কী দেখবে",
    rows: [
      {
        who: "Super Admin",
        sees: "সিস্টেমের সব মডিউল, সেটিংস এবং সব ডেটা।",
      },
      {
        who: "Department Managers",
        sees: "শুধু তাদের বিভাগের সাথে সম্পর্কিত মডিউল (যেমন: Marketing দেখবে Blog)।",
      },
      {
        who: "Employees",
        sees: "শুধুমাত্র তাদের Role-এ অনুমোদিত মডিউল এবং অ্যাকশনগুলো।",
      },
    ],
  },

  tip: {
    title: "যা ভুলবেন না",
    lines: [
      "কর্মচারী যুক্ত করার আগে সর্বদা Department, Designation এবং Role সেটআপ করুন।",
      "কাউকে 'Super Admin' পারমিশন দেওয়ার আগে সতর্ক থাকুন।",
      "সিস্টেমে কে কী পরিবর্তন করেছে তা দেখতে Action Logs ব্যবহার করুন।",
    ],
  },
}

const COPY: Record<Lang, Copy> = { en: EN, bn: BN }

export function WorkflowGuide() {
  const [lang, setLang] = useState<Lang>("en")
  const t = COPY[lang]

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">{t.pageTitle}</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">{t.pageSubtitle}</p>
        </div>
        <div className="inline-flex shrink-0 rounded-lg border bg-card p-1 shadow-xs">
          <LangButton active={lang === "en"} onClick={() => setLang("en")}>
            {EN.langEnglish}
          </LangButton>
          <LangButton active={lang === "bn"} onClick={() => setLang("bn")}>
            {EN.langBangla}
          </LangButton>
        </div>
      </header>

      <Section heading={t.hierarchy.heading}>
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
          <HierarchyCard
            tone="primary"
            icon={Sparkles}
            title={t.hierarchy.platform.title}
            desc={t.hierarchy.platform.desc}
          />
          <Arrow />
          <HierarchyCard
            tone="indigo"
            icon={Building2}
            title={t.hierarchy.branch.title}
            desc={t.hierarchy.branch.desc}
          />
          <Arrow />
          <HierarchyCard
            tone="emerald"
            icon={UserCog}
            title={t.hierarchy.admin.title}
            desc={t.hierarchy.admin.desc}
          />
          <Arrow />
          <HierarchyCard
            tone="muted"
            icon={Users}
            title={t.hierarchy.employees.title}
            desc={t.hierarchy.employees.desc}
          />
        </div>
      </Section>

      <FlowSection
        heading={t.platformFlow.heading}
        subtitle={t.platformFlow.subtitle}
        steps={t.platformFlow.steps}
        accent="primary"
      />

      <FlowSection
        heading={t.branchFlow.heading}
        subtitle={t.branchFlow.subtitle}
        steps={t.branchFlow.steps}
        accent="emerald"
      />

      <Section heading={t.permission.heading}>
        <div className="overflow-hidden rounded-lg border bg-card">
          {t.permission.rows.map((row, i) => (
            <div
              key={row.who}
              className={cn(
                "grid gap-2 px-4 py-3 sm:grid-cols-[220px_1fr] sm:gap-6 sm:px-6 sm:py-4",
                i !== t.permission.rows.length - 1 && "border-b",
              )}
            >
              <div className="font-medium">{row.who}</div>
              <div className="text-sm text-muted-foreground">{row.sees}</div>
            </div>
          ))}
        </div>
      </Section>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-950/30">
        <h3 className="mb-3 text-sm font-semibold text-amber-900 dark:text-amber-200">
          {t.tip.title}
        </h3>
        <ul className="space-y-2">
          {t.tip.lines.map((line) => (
            <li key={line} className="flex gap-2 text-sm text-amber-900/90 dark:text-amber-100/90">
              <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function LangButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}

function Section({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold tracking-tight">{heading}</h3>
      {children}
    </section>
  )
}

const toneClass: Record<string, string> = {
  primary: "border-primary/30 bg-primary/5",
  indigo: "border-indigo-200 bg-indigo-50 dark:border-indigo-900/40 dark:bg-indigo-950/20",
  emerald: "border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-950/20",
  muted: "border-border bg-muted/40",
}

const iconToneClass: Record<string, string> = {
  primary: "bg-primary/15 text-primary",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  muted: "bg-muted text-muted-foreground",
}

function HierarchyCard({
  tone,
  icon: Icon,
  title,
  desc,
}: {
  tone: keyof typeof toneClass
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-4 shadow-xs",
        toneClass[tone],
      )}
    >
      <div className={cn("flex size-8 items-center justify-center rounded-md", iconToneClass[tone])}>
        <Icon className="size-4" />
      </div>
      <div className="font-semibold leading-tight">{title}</div>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  )
}

function Arrow() {
  return (
    <div className="hidden items-center justify-center text-muted-foreground lg:flex">
      <ArrowRight className="size-4" />
    </div>
  )
}

function FlowSection({
  heading,
  subtitle,
  steps,
  accent,
}: {
  heading: string
  subtitle: string
  steps: Step[]
  accent: "primary" | "emerald"
}) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-base font-semibold tracking-tight">{heading}</h3>
        <p className="max-w-3xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {steps.map((step, i) => (
          <StepCard key={step.title} step={step} index={i + 1} accent={accent} />
        ))}
      </ol>
    </section>
  )
}

const accentBadgeClass: Record<string, string> = {
  primary: "bg-primary text-primary-foreground",
  emerald: "bg-emerald-600 text-white",
}

const accentIconClass: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
}

function StepCard({
  step,
  index,
  accent,
}: {
  step: Step
  index: number
  accent: "primary" | "emerald"
}) {
  const Icon = step.icon
  return (
    <li className="relative flex gap-3 rounded-lg border bg-card p-4 shadow-xs transition-colors hover:bg-muted/30">
      <div className="flex flex-col items-center gap-2">
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-full text-xs font-bold",
            accentBadgeClass[accent],
          )}
        >
          {index}
        </span>
        <div className={cn("flex size-9 items-center justify-center rounded-md", accentIconClass[accent])}>
          <Icon className="size-4" />
        </div>
      </div>
      <div className="min-w-0 space-y-1">
        <div className="font-semibold leading-tight">{step.title}</div>
        <p className="text-xs text-muted-foreground">{step.desc}</p>
        {step.path && (
          <code className="inline-block rounded bg-muted px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground">
            {step.path}
          </code>
        )}
      </div>
    </li>
  )
}
