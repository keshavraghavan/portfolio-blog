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

        My name is Keshav. When people ask me, what do you do – I instinctively turn towards my professional job.
        However, when it comes to the truth of what I do, it is far more complex. 
        Outside of my professional job, I classify myself as a writer, a musician (albiet a very poor one), and an engineer – 
        I wanted to make this page to not showcase my technical talent, but rather my talent and passion for things outside of my career, 
        and as a place for me to improve my writing, my skills as an engineer, and my ability to be a musician. More importantly, I want to use this as
        a place to reflect - rather to find meaning in the things I do, and to find a place to express myself.
        I hope that you enjoy this page and find something of value in here, for whatever reason you may have come here.

        {/* this is horrible, i need to recall how to add spacing without using breaks. */}
        <br /> <br />
       
       Thank you for visiting my page, and I hope you find something that resonates with you - and if you do please reach out to me, I would love to talk to you about it.
      
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
