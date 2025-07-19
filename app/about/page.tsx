export default function AboutPage() {
  return (
    <div>
        <h1 className='text-4xl tracking-tighter'>
            About
        </h1> 

        <p className="mb-6 text-lg tracking-tight">
            < br />
            This page contains information about me, my interests, and my work.
            I have a passion for technology, music, and art. I enjoy exploring new ideas and
            sharing my thoughts with others. Below are links to my social media profiles and some of my
            favorite projects. Feel free to connect with me or check out my work!
        </p>

        < br />

        <p className="mb-6 text-lg tracking-tight">
            This is what is currently in my library and what I am currently reading:
            <ul>
                <li>
                    <a href ="/library" className="text-blue-500 hover:underline">Library</a>
                </li>
            </ul>
        </p>
        <p className="mb-6 text-lg tracking-tight">
            You can find me on:
            <ul>
                <li><a href="https://www.instagram.com/raghavankeshav/" className="text-blue-500 hover:underline">Instagram</a></li>
                <li><a href="https://www.linkedin.com/in/raghavankeshav/" className="text-blue-500 hover:underline">LinkedIn</a></li>
            </ul>
        </p>
    </div>
  );
}