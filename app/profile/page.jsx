'use client'
import React from 'react'
import { useAuth } from "../../lib/useauth";
import { useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter()
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // Redirect to login page if no user
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">User Profile</h2>

      {user ? (
        <div className="text-center">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>UID:</strong> {user.uid}</p>
        </div>
      ) : (
        <p className="text-red-500 text-center">No user logged in</p>
      )}
    </div>
  );
}
