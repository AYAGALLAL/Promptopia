'use client'
import React from 'react'
import { useAuth } from "../../lib/useauth";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { getUserPrompts } from '../../models/prompt'
import PromptCard from "../../components/PromptCard";




const PromptCardList = ({ data }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post.id}
          post={post}
        />
      ))}
    </div>
  );
};

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter()
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirect to login page if no user
    }else {
    getUserData() 
    }
    async function getUserData() {
      const response = await getUserPrompts()
      console.log(response) 
      setAllPosts(response)
    }

  }, [user, loading, router]);



  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-4">User Profile</h2>

      {user ? (
        <PromptCardList data={allPosts} />
      ) : (
        <p className="text-red-500 text-center">No user logged in</p>
      )}
    </>
  );
}
