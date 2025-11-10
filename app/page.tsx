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
        My name is Keshav. When people ask what I do, I instinctively mention my professional role. 
        But the truth is far more complex.Beyond my career, I'm a writer, a musician, and an engineer. 
        I created this page not to showcase technical expertise, but to explore the passions that exist outside my job title. 

        This is my space to sharpen my writing, develop my engineering skills, and grow as a musician.
        More than anything, though, this is a place for reflection—to find meaning in what I do and to express myself freely. 
        I hope you find something valuable here, whatever brought you to this page.
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
