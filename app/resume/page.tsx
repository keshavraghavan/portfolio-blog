export const metadata = {
  title: 'Resume',
  description: 'Application manager and product-minded engineer.',
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="editorial-divider mt-8 mb-5">
      <span>{label}</span>
    </div>
  )
}

interface TimelineEntry {
  title: string
  company: string
  period: string
  bullets: string[]
  current?: boolean
}

const experience: TimelineEntry[] = [
  {
    title: ‘Digital Software Analyst, Mortgage Lending’,
    company: ‘Citibank · Dallas, TX’,
    period: ‘March 2024 — Present’,
    current: true,
    bullets: [
      ‘Owned 22 mortgage systems for 800+ users, maintaining 99.3% uptime across platforms’,
      ‘Built Next.js dashboard for senior leadership tracking repository migration adoption and DORA metrics’,
      ‘Redesigned MSSQL archival storage strategy, reducing infrastructure costs by $300k annually’,
      ‘Cut delivery cycles from 3 months to 2.5 weeks, by utilizing Devin AI for SDLC procedures’,
      ‘Scaled AI adoption across retail banking by training 50+ analysts and onboarding 6 teams’,
    ],
  },
  {
    title: ‘Lead — OnSked Web Application’,
    company: ‘Amazech Solutions LLC · Plano, TX’,
    period: ‘August 2023 — December 2023’,
    bullets: [
      ‘Built a scheduling platform for salons and spas, from requirements through launch’,
      ‘Developed React frontend and Express API on Azure, reducing booking confirmation time by 40%’,
    ],
  },
  {
    title: ‘Summer Analyst — KYC’,
    company: ‘Citibank · Dallas, TX’,
    period: ‘June 2023 — August 2023’,
    bullets: [
      ‘Integrated UI features improving KYC verification workflows and fraud detection usability’,
      ‘Analyzed automotive sales with Pandas and Tableau to surface strategy insights’,
      ‘Wrote Jest unit tests for KYC identity verification features across branded card workflows’,
    ],
  },
]

const projects: TimelineEntry[] = [
  {
    title: ‘POSED’,
    company: ‘’,
    period: ‘November 2025 — Present’,
    current: true,
    bullets: [
      ‘Interviewed various thrift store owners and scoped an ML pricing MVP for Square Marketplace’,
      ‘Built pricing engine using SAM3 and Ollama for real-time pricing with 90% accuracy’,
      ‘Shipped ML-powered POS reducing per-item processing time by about 60%’,
      ‘Replaced manual pricing with LLM-based lookup and integrated Square payments’,
      ‘Built APIs and data pipelines for pricing, inventory tracking, and model feedback loops’,
    ],
  },
  {
    title: ‘1051 Studios’,
    company: ‘’,
    period: ‘June 2017 — December 2023’,
    bullets: [
      ‘Won a City of Austin pitch contest for a municipal court chatbot’,
      ‘Built homebuying platform using Austin MLS data, reducing broker fees by 17%’,
      ‘Designed route optimization for Austin Resource Recovery, cutting pickup times by 30%’,
      ‘Developed CapMetro mobile app redesign in React Native, pitching to Austin\’s CTM CIO’,
    ],
  },
]

const skills: { category: string; items: string[] }[] = [
  {
    category: ‘Technical’,
    items: [‘TypeScript’, ‘Next.js’, ‘Express.js’, ‘PostgreSQL’, ‘Java’, ‘Tableau’, ‘Adobe Analytics’, ‘Git’],
  },
  {
    category: ‘AI/ML’,
    items: [‘LLM Applications’, ‘SAM3’, ‘Devin AI’, ‘Model Evaluation’, ‘Pandas’],
  },
  {
    category: ‘Product’,
    items: [‘User Research’, ‘MVP Scoping’, ‘Roadmapping’, ‘Agile’, ‘Jira’, ‘Confluence’, ‘Figma’],
  },
]

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div>
      {entries.map((entry, index) => (
        <div key={`${entry.company}-${entry.period}`} className="flex gap-4 mb-8">
          <div className="flex flex-col items-center pt-1 shrink-0">
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                entry.current ? 'bg-accent' : 'bg-warm-border dark:bg-dark-border'
              }`}
            />
            {index < entries.length - 1 && (
              <div className="w-px flex-1 bg-warm-border dark:bg-dark-border mt-1" />
            )}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex justify-between items-baseline flex-wrap gap-2">
              <p className="font-courier text-sm text-near-black dark:text-cream">
                {entry.title}
              </p>
              <p className="font-courier text-xs text-muted whitespace-nowrap">
                {entry.period}
              </p>
            </div>
            {entry.company && <p className="text-sm text-accent mt-0.5">{entry.company}</p>}
            <ul className="mt-2 space-y-1">
              {entry.bullets.map((b, i) => (
                <li
                  key={i}
                  className="text-xs text-warm-dark dark:text-muted leading-relaxed flex gap-2"
                >
                  <span className="text-muted shrink-0">&mdash;</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ResumePage() {
  return (
    <section className="max-w-2xl mx-auto w-full">
      <div className="mb-2">
        <h1 className="font-courier text-2xl text-near-black dark:text-cream tracking-tight">
          Resume
        </h1>
        <p className="text-sm text-muted mt-1">
          Application manager and product-minded engineer bridging business, AI, and delivery.
        </p>
        <a
          href="/keshav-resume.pdf"
          download="Keshav_Raghavan_Resume.pdf"
          className="text-sm text-accent hover:underline underline-offset-2 transition-colors mt-2 inline-block"
        >
          Download PDF &darr;
        </a>
      </div>

      <SectionDivider label="Education" />
      <div className="card-base p-4">
        <p className="font-courier text-sm text-near-black dark:text-cream">
          BS Computer Science
        </p>
        <p className="text-sm text-accent mt-1">
          University of Texas at Dallas &mdash; May 2024
        </p>
      </div>

      <SectionDivider label="Experience" />
      <Timeline entries={experience} />

      <SectionDivider label="Projects" />
      <Timeline entries={projects} />

      <SectionDivider label="Skills" />
      <div className="space-y-4">
        {skills.map((group) => (
          <div key={group.category}>
            <p className="font-courier text-xs text-muted mb-2 uppercase tracking-wider">
              {group.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
