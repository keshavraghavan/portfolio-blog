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
      <h1 className='text-4xl tracking-tighter'>
        Hello.
      </h1>
      <p className="mb-6 text-lg tracking-tight">
        <br /> 

Hello, I’m Keshav.
Like many of us, when someone asks “What do you do?”, I used to default to the safest, most conventional answer. Yet the fuller picture has always been more colorful: I’m a writer, a musician, and an engineer.
This page isn’t about credentials or titles. It’s a personal playground where I refine my writing, tinker with engineering ideas, and explore music more intentionally.
Most importantly, it’s a space for honest reflection—to uncover meaning in everyday pursuits and to share thoughts freely.
Whatever brought you here, I’m glad you stopped by. I hope you discover something worth carrying with you.
        {/* this is horrible, i need to recall how to add spacing without using breaks. */}
        <br /> <br />
        
        Thank you for visiting.      
       <br /> <br />
       <a href="mailto:raghavankeshav@gmail.com" className="text-white-500 hover:underline">-Keshav</a>
      </p>
      <div className="my-8">
        <h2 className="mb-4 text-2xl font-semibold tracking-tighter">Blog Posts:</h2>
        <BlogPosts />
      </div>
    </section>
  )
}
