"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { motion } from "framer-motion"
import { ImagePlus } from "lucide-react"
import { signIn, useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const { data: session } = useSession()

  if (session) {
    router.push("/dashboard")
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Gradient background inspired by the image */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-pink-500">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -left-20 top-1/4 w-96 h-96 rounded-full bg-pink-300/40 blur-xl"></div>
          <div className="absolute -left-10 top-1/3 w-72 h-72 rounded-full bg-purple-300/30 blur-xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-orange-300/30 blur-xl"></div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="bg-white shadow-xl overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1/3 overflow-hidden">
            <div className="absolute -left-10 top-1/4 w-40 h-40 rounded-full bg-pink-400/40 blur-xl"></div>
            <div className="absolute -left-5 top-1/3 w-32 h-32 rounded-full bg-purple-400/30 blur-xl"></div>
            <div className="absolute bottom-10 left-5 w-24 h-24 rounded-full bg-orange-400/30 blur-xl"></div>
          </div>

          <CardHeader className="relative z-10 text-center pt-8 pb-2">
            <div className="flex items-center gap-2 justify-center mb-6">
              <div className="flex items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 p-2">
                <ImagePlus className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <span className="text-xl font-semibold tracking-tight bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Insta Curator
              </span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Welcome !</CardTitle>
          </CardHeader>

          <CardContent className="relative z-10 px-8 py-6 space-y-6">
            <Button
              size="lg"
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 transition-all duration-200"
              onClick={() => signIn.social({ provider: "google" })}
            >
              <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-2" />
              Continue with Google
            </Button>

            {/* <div className="text-center">
              <p className="text-sm text-gray-500">
                Forgot your login details?{" "}
                <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
                  Get help
                </a>
              </p>
            </div> */}

            <div className="pt-2">
              <p className="text-center text-xs text-gray-500">
                By continuing, you agree to our{" "}
                <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
