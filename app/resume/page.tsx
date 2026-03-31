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
    title: 'Application Manager — Mortgage',
    company: 'Citibank · Dallas, TX',
    period: 'March 2024 — Present',
    current: true,
    bullets: [
      'Owned a 22-system mortgage portfolio, driving cross-functional collaboration across engineering, QA, and stakeholders',
      'Led user stories and acceptance criteria for a GenAI platform, building an evaluation framework that improved accuracy by 29%',
      'Delivering $330,000 in annual savings by optimizing archival storage on database platforms',
      'Implemented Glassbox and Adobe Analytics to enhance digital user experience with data-driven product recommendations',
      'Spearheaded Agentic AI and prompt engineering adoption within the SDLC, reducing engineering time by 60%',
      'Increased large-query performance by 42% through SQL stored procedures and API endpoint optimization',
      'Managed support escalations and client issues end-to-end, coordinating engineering resolutions that reduced downtime by 15%',
      'Authored API specs, technical documentation, and release notes while leading agile rituals including backlog grooming and sprints',
    ],
  },
  {
    title: 'Founder',
    company: 'POSED',
    period: 'November 2025 — Present',
    current: true,
    bullets: [
      'Founded an ML-powered POS for thrift stores, defining MVP scope, user stories, and acceptance criteria from user feedback',
      'Built an unstructured data pipeline with object detection and embedding models to generate vectorized price suggestions',
      'Integrated product lookup via LLMs and prompt engineering to surface market-aligned pricing at checkout',
      'Designed API endpoints and integrated Square Payments API with a custom price override system and model feedback loop',
      'Wrote OpenAPI-compliant technical specs and architected MCP-compatible tooling for AI-assisted pricing workflows',
      'Built the full-stack app in React, TypeScript, and PostgreSQL while managing Git, CI/CD, sprint milestones, and the product roadmap',
    ],
  },
  {
    title: 'Summer Analyst — KYC',
    company: 'Citibank · Dallas, TX',
    period: 'June 2023 — August 2023',
    bullets: [
      'Developed UI features on Citibank Online, strengthening customer security and fraud prevention',
      'Analyzed automotive sales datasets using Pandas and Tableau to reveal fuel-efficiency trends driving strategy',
      'Partnered with Citi’s Voice of Employee committee to lead initiatives improving team communication',
    ],
  },
  {
    title: 'Lead — OnSked Web Application',
    company: 'Amazech Solutions LLC · Plano, TX',
    period: 'August 2023 — December 2023',
    bullets: [
      'Implemented a frontend UI using React.js and Material UI, ensuring a smooth user experience',
      'Designed a custom backend service on Microsoft Azure using an Express.js RESTful API',
      'Verified deliverables met quality standards and optimized data storage and retrieval for frontend responsiveness',
    ],
  },
  {
    title: 'Founder',
    company: '1051 Studios · Austin, TX',
    period: 'May 2017 — December 2023',
    bullets: [
      'Streamlined homebuying with customer rebates and identified builder pain points to drive product improvements',
      'Developed applications for Austin Resource Recovery to improve yard waste pickup efficiency',
      'Presented at City Hall before city officials, winning a pitch contest',
    ],
  },
]

const skills: { category: string; items: string[] }[] = [
  {
    category: 'Product Management',
    items: [
      'Agile',
      'User Stories',
      'Acceptance Criteria',
      'Backlog Grooming',
      'Sprint Coordination',
      'Release Tracking',
      'Jira',
      'Confluence',
    ],
  },
  {
    category: 'Frameworks / Languages',
    items: ['TypeScript', 'JavaScript', 'React', 'Next.js', 'Express.js', 'Python', 'SQL', 'OpenAPI'],
  },
  {
    category: 'Tools & Infrastructure',
    items: ['Git', 'Postman', 'PostgreSQL', 'Azure', 'Vercel', 'MCP', 'YAML/JSON'],
  },
  {
    category: 'Data & Analytics',
    items: ['Tableau', 'Pandas', 'Adobe Analytics', 'Prompt Engineering'],
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
            <p className="text-sm text-accent mt-0.5">{entry.company}</p>
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
          href="/document_pdf.pdf"
          download="document_pdf.pdf"
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
