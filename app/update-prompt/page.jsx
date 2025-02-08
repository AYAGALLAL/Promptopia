"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getOnePrompt, updatePrompt } from '../../models/prompt'
import Link from "next/link";


import Form from "@components/Form";

const UpdatePrompt = () => {
  const searchParams = useSearchParams();
  const Id = searchParams.get("Id"); // ✅ Correct way to get query params

  const [post, setPost] = useState({ prompt: "", tag: "", });
  const [submitting, setIsSubmitting] = useState(false);
  const router = useRouter()

  

  useEffect(() => {
    

    const getPromptDetails = async () => {
      const data = await getOnePrompt(Id)
      console.log(data)
      setPost(data)
    };

    if (Id) getPromptDetails();
  }, [Id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!Id) return alert("Missing PromptId!");

    try {
      console.log(post)
      const response = await updatePrompt(Id, post.prompt, post.tag)
      console.log(response)
      

      if (response) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className='w-full max-w-full flex-start flex-col'>
    <h1 className='head_text text-left'>
      <span className='blue_gradient'> Edit Post</span>
    </h1>
    <form
      onSubmit={handleSubmit}
      className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism'
    >
      <label>
        <span className='font-satoshi font-semibold text-base text-gray-700'>
          Your AI Prompt
        </span>

        <textarea
          value={post.prompt}
          onChange={(e) => setPost({ ...post, prompt: e.target.value })}
          placeholder='Write your post here'
          required
          className='form_textarea '
        />
      </label>

      <label>
        <span className='font-satoshi font-semibold text-base text-gray-700'>
          Field of Prompt{" "}
          <span className='font-normal'>
            (#product, #webdevelopment, #idea, etc.)
          </span>
        </span>
        <input
          value={post.tag}
          onChange={(e) => setPost({ ...post, tag: e.target.value })}
          type='text'
          placeholder='#Tag'
          required
          className='form_input'
        />
      </label>

      <div className='flex-end mx-3 mb-5 gap-4'>
        <Link href='/' className='text-gray-500 text-sm'>
          Cancel
        </Link>

        <button
          type='submit'
          disabled={submitting}
          className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'
        >
          {submitting ? `$ng...` : 'UPDATE'}
        </button>
      </div>
    </form>
  </section>
  );
};

export default UpdatePrompt;