'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useAuth } from "../lib/useauth";
import { auth, signOut } from '../firebase.config'
import { useRouter } from 'next/navigation';



const Nav = () => {

  const [toggleDropDown, settoggleDropDown] = useState(false)
  const { user } = useAuth();
  const router = useRouter()

  useEffect(() => {
    
    },[])

    const logout = async () => {
      try {
        await signOut(auth);
        console.log("User signed out successfully!");
        router.push('/register') 
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };

  return (
    <nav className='flex-between w-full mb-16 pt-3'>
      <Link href='/' className='flex gap-2 flex-center'>
      <Image 
      src="/assets/images/logo.svg" 
      alt="Promptopia Logo"
      width={30}
      height={30}
      className='object-contain'
      />
      <p className='logo_text'>Promptopia</p>
      </Link>



      {/*Desktop Navigation*/}
      <div className='sm:flex hidden'>
      {user ? (
        <div className='flex gap-3 md:gp-5'>
          <Link href='/create-prompt' className='black_btn'>
          Create Prompt
          </Link>
          <button type="button" className='outline_btn' onClick={logout}>
          Sign Out
          </button>

          <Link href='/profile'>
                                                                              {/* khasha thyed?*/}
          <Image 
          src='/assets/images/logo.svg' 
          width={37} height={37} className='rounded-full' alt='profile' /> 
          </Link>

        </div>
      ):(
        <>
          
            <button type='button'  className='black_btn'>
              Sign In
            </button>
          
        </>
      )}
      </div>

      {/*Mobile Navigation*/}
      <div className='sm:hidden flex relative'>
        {user ? (
          <div className='flex'>
            <Image 
              src='/assets/images/logo.svg' 
              width={37} 
              height={37} 
              className='rounded-full' 
              alt='profile'
              onClick={() => {settoggleDropDown((prev) => !prev)}} 
            />
            {toggleDropDown && (
              <div className='dropdown'>
                <Link href='/profile' className='dropdown_link' onClick={() => settoggleDropDown(false)}>
                  My Profile
                </Link>
                <Link href='/create-prompt' className='dropdown_link' onClick={() => settoggleDropDown(false)}>
                  Create Prompt
                </Link>
                <button 
                    type='button'
                    onClick={() => {
                      settoggleDropDown(false); // Close dropdown first
                      logout(); // Then log out the user
                    }}
                    className='mt-5 w-full black_btn'
                  >
                  Sign Out
                </button>
                
              </div>
            )}

          </div>
        ):(
          <>
          
            <button type='button' className='black_btn'>
              Sign In
            </button>
        </>
        )}
      </div>

    </nav>
  )
}

export default Nav