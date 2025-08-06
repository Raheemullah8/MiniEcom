// components/ClerkHeader.tsx
import React from 'react'
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Button } from './ui/button'

function ClerkHeader() {
  return (
    <div className="flex items-center">
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-4">
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8",
              }
            }}
          />
        </div>
      </SignedIn>
    </div>
  )
}

export default ClerkHeader