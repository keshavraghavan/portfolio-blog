export const metadata = {
  title: 'Resume',
  description: 'Digital Product Analyst and engineer.',
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
    title: 'Digital Product Analyst — Mortgage',
    company: 'Citibank · Dallas, TX',
    period: 'March 2024 — Present',
    current: true,
    bullets: [
      'Leading a cross-functional team managing 22 systems, resolving latency and API issues impacting 250+ users',
      'Built interaction flows for a GenAI auditing platform, improving reliability and accuracy by 29%',
      'Delivering $330,000 in annual savings by optimizing archival storage on database platforms',
      'Implemented Glassbox and Adobe Analytics to enhance Citi Mortgage digital experience analytics',
      'Collaborated with SaaS vendors to implement business tools that streamlined operations and overhead costs',
      'Spearheading the use of Agentic AI within the SDLC process, reducing developer engineering time by 60%',
      'Increased large-query performance by 42% using SQL stored procedures',
      'Coordinating with business, QA, and engineering to fix vendor issues, reducing platform downtime by 15%',
    ],
  },
  {
    title: 'Summer Analyst — KYC',
    company: 'Citibank · Dallas, TX',
    period: 'June 2023 — August 2023',
    bullets: [
      'Developed UI features on Citibank Online, strengthening customer security and fraud prevention',
      'Analyzed automotive sales datasets using Pandas and Tableau to reveal fuel-efficiency trends',
      'Partnered with the Voice of Employee committee to lead initiatives improving team communication',
    ],
  },
  {
    title: 'Founder',
    company: '1051 Studios · Austin, TX',
    period: 'May 2017 — December 2023',
    bullets: [
      'Streamlined the process of buying a new home while offering rebates to customers',
      'Identified homebuilder pain points to prioritize high-value product improvements',
      'Developed applications for Austin Resource Recovery to improve yard waste pickup efficiency',
      'Presented at City Hall before city officials, winning a pitch contest',
    ],
  },
]

const projects: TimelineEntry[] = [
  {
    title: 'Lead — OnSked Web Application',
    company: 'Amazech Solutions LLC · Plano, TX',
    period: 'August 2023 — December 2023',
    bullets: [
      'Verified deliverables met quality standards through comprehensive testing',
      'Implemented a frontend UI using React.js and Material UI',
      'Designed a custom backend service on Microsoft Azure using an Express.js RESTful API',
      'Optimized data storage and retrieval to enhance frontend responsiveness',
    ],
  },
]

const skills: { category: string; items: string[] }[] = [
  {
    category: 'Product Management',
    items: ['Agile', 'Jira', 'Figma'],
  },
  {
    category: 'Frameworks / Languages',
    items: ['JavaScript', 'Next.js', 'React', 'SQL', 'Express.js', 'Azure', 'Python'],
  },
  {
    category: 'Data Analytics',
    items: ['Tableau', 'Pandas'],
  },
]

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div>
      {entries.map((entry, index) => (
        <div key={index} className="flex gap-4 mb-8">
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
          Product-minded engineer who bridges business and technology.
        </p>
        <a
          href="/keshav-resume.pdf"
          download="keshav-resume.pdf"
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
