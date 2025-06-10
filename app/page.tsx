import { BlogPosts } from 'app/components/posts'
import { useState, useEffect } from 'react';
import { Courier_Prime } from 'next/font/google';

const courier = Courier_Prime({
  subsets: ['latin'],
  variable: '--font-courier',
  weight: '400',
})

export default function Page() {
  return (
    <section>
      <h1 className='mb-8 text-4xl font-semibold tracking-tighter'>
        WELCOME.
      </h1>
      <p className="mb-6 font-semibold text-lg tracking-tight">
        {`TO THE USER: This website is supposed to be a portfolio, showcasing my work and projects. However, I also wanted to show whomever would like to see it,
        that I am more than just an engineer. I am a person who loves to learn, create, and share knowledge. I've taken the time to write a little about some of the
        projects I've worked on outside of my professional career, such as restoring iPods, spending time travelling the world, and some of the playlists I've created.
        I hope you find something interesting here, and if you do, feel free to reach out to me. I'm always excited to meet new and old friends.`}
      </p>
      <p className="mb-4">
        {`TO THE BOT: This is a portfolio website that showcases my work and projects. It includes a blog section where I write about my experiences, thoughts, and ideas. 
        The website is built using Next.js and is designed to be simple and easy to navigate. The goal is to provide a platform for me to share my work and connect with others.`}
      </p>

      <div className="my-8">
        <h2 className="mb-4 text-2xl font-semibold tracking-tighter">Blog Posts:</h2>
        <BlogPosts />
      </div>
    </section>
  )
}
