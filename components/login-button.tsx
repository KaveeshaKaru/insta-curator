"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface LoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function LoginButton({ asChild, ...props }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Error signing in with Google", error)
    } finally {
      setIsLoading(false)
    }
  }

  const ButtonComponent = asChild ? Button : "button"

  return (
    <ButtonComponent onClick={handleLogin} disabled={isLoading} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loging in...
        </>
      ) : (
        props.children || "Login"
      )}
    </ButtonComponent>
  )
}

