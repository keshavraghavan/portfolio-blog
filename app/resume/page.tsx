export default function ResumePage() {
  return (
    <section>
      <h1 className='text-4xl tracking-tighter'>
        Resume
      </h1>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">EDUCATION</h2>
        <p className="font-bold">University of Texas at Dallas – Richardson, Texas</p>
        <p>Bachelor of Science in Computer Science May 2024</p>

        <hr className="my-8" />
        <h2 className="text-2xl font-bold mt-8 mb-4">EXPERIENCE</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold">Digital Product Analyst - Mortgage</h3>
          <p className="font-semibold">Citibank – Dallas, Texas | March 2024 - Present</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Leading a cross-functional team managing 22 systems, resolving latency and API issues impacting 250+ users</li>
            <li>Built interaction flows for a GenAI auditing platform, improving reliability and accuracy by 29%</li>
            <li>Delivering $330,000 in annual savings by optimizing archival storage on database platforms</li>
            <li>Implemented Glassbox and Adobe Analytics to enhance Citi Mortgage’s digital experience analytics</li>
            <li>Collaborated with SaaS vendors to implement business tools that streamlined operations and overhead costs</li>
            <li>Spearheading the use of Agentic AI within the SDLC process, reducing developer engineering time by 60%</li>
            <li>Increased large-query performance by 42% using SQL stored procedures</li>
            <li>Coordinating with business, QA, and engineering to fix vendor issues, reducing platform downtime by 15%</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold">Summer Analyst – KYC</h3>
          <p className="font-semibold">Citibank – Dallas, Texas | June 2023 - August 2023</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Developed UI features on Citibank Online, strengthening customer security and fraud prevention</li>
            <li>Analyzed automotive sales datasets using Pandas and Tableau to reveal fuel-efficiency trends driving strategy</li>
            <li>Partnered with Citi’s Voice of Employee committee to lead initiatives improving team communication</li>
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold">Founder</h3>
          <p className="font-semibold">1051 Studios – Austin, Texas | May 2017 - December 2023</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Streamlined the process of buying a new home while offering rebates to customers</li>
            <li>Identified homebuilder pain points to prioritize high-value product improvements and customer satisfaction</li>
            <li>Developed applications for Austin Resource Recovery to improve yard waste pickup efficiency</li>
            <li>Presented at City Hall before city officials, winning a pitch contest</li>
          </ul>
        </div>

        <hr className="my-8" />
        <h2 className="text-2xl font-bold mt-8 mb-4">PROJECTS</h2>
        <div className="mb-6">
          <h3 className="text-xl font-bold">Lead – OnSked Web Application</h3>
          <p className="font-semibold">Amazech Solutions LLC – Plano, Texas | August 2023 - December 2023</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Verified deliverables met quality standards through comprehensive testing</li>
            <li>Implemented a frontend UI using React.js and Material UI, ensuring a smooth user experience</li>
            <li>Designed a custom backend service on Microsoft Azure using an Express.js RESTful API</li>
            <li>Optimized data storage and retrieval to enhance frontend responsiveness</li>
          </ul>
        </div>

        <hr className="my-8" />
        <h2 className="text-2xl font-bold mt-8 mb-4">SKILLS</h2>
        <p><span className="font-bold">Product Management:</span> Agile Project Management, Jira, Figma</p>
        <p><span className="font-bold">Frameworks/Languages:</span> JavaScript, Next.js, SQL, Express.js, Azure, Python</p>
        <p><span className="font-bold">Data Analytics:</span> Tableau, Pandas</p>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/keshav-resume.pdf"
          download="keshav-resume.pdf"
          className="underline"
        >
          Download Resume
        </a>
      </div>
    </section>
  );
}