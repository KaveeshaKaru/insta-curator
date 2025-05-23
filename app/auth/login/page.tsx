"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, ChevronRight } from "lucide-react"
import { signIn, useSession } from "@/lib/auth-client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Pre-calculated random positions to avoid hydration mismatch
const circles = [
  { width: 200, height: 200, left: 20, top: 25 },
  { width: 300, height: 300, left: 80, top: 15 },
  { width: 250, height: 250, left: 40, top: 10 },
  { width: 180, height: 180, left: 5, top: 15 },
  { width: 220, height: 220, left: 60, top: 40 },
  { width: 280, height: 280, left: 70, top: 35 },
  { width: 190, height: 190, left: 30, top: 45 },
  { width: 240, height: 240, left: 85, top: 20 },
  { width: 270, height: 270, left: 15, top: 30 },
  { width: 230, height: 230, left: 55, top: 50 },
  { width: 210, height: 210, left: 75, top: 55 },
  { width: 260, height: 260, left: 35, top: 60 },
  { width: 320, height: 320, left: 90, top: 65 },
  { width: 290, height: 290, left: 25, top: 70 },
  { width: 310, height: 310, left: 65, top: 75 },
]

// Pre-defined images for the grid
const gridImages = [
  '/images/beach.jpg',
  '/images/coconut.jpg',
  '/images/village.jpg',
  '/images/waves.jpg',
  '/images/surfer.jpg',
  '/images/coconuttrees.jpg',
]

// Pre-defined people for avatars
const people = [
  { image: '/people/emily.jpg', name: 'Emily' },
  { image: '/people/sarah.jpg', name: 'Sarah' },
  { image: '/people/michael.jpg', name: 'Michael' },
  // { image: '/placeholder-user.jpg', name: 'Alex' },
]

export default function LoginPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isHovering, setIsHovering] = useState(false)

  if (session) {
    router.push("/dashboard")
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-white">
      {/* Instagram-inspired background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle gradient patterns */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#f9ce34]/10 via-[#ee2a7b]/10 to-[#6228d7]/10"></div>

        {/* Animated gradient circles */}
        <div className="absolute inset-0">
          {circles.map((circle, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-[#f9ce34]/20 via-[#ee2a7b]/20 to-[#6228d7]/20"
              style={{
                width: circle.width,
                height: circle.height,
                left: `${circle.left}%`,
                top: `${circle.top}%`,
              }}
              initial={{ opacity: 0.1, scale: 0 }}
              animate={{
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.2, 1],
                x: [0, 20, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Instagram gradient accent glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-[#f9ce34]/30 to-[#ee2a7b]/30 blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-gradient-to-r from-[#ee2a7b]/30 to-[#6228d7]/30 blur-[100px]"></div>
      </div>

      {/* Content container */}
      <div className="container max-w-6xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-8 lg:gap-16">
        {/* Left side - Branding/Illustration */}
        <motion.div
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-8 inline-flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-2.5">
              <Camera className="h-6 w-6 text-white" strokeWidth={2} />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] bg-clip-text text-transparent">
              Insta Curator
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Share your{" "}
            <span className="bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] bg-clip-text text-transparent">
              moments
            </span>
          </h1>

          <p className="text-gray-600 text-lg md:text-xl max-w-md mx-auto md:mx-0 mb-8">
            Join our community of creators and share your story through beautiful visuals.
          </p>

          {/* Instagram-style photo grid */}
          <div className="hidden md:grid grid-cols-3 gap-2 max-w-md mb-8">
            {gridImages.map((image, i) => (
              <motion.div
                key={i}
                className="aspect-square rounded-lg overflow-hidden bg-gradient-to-tr from-gray-100 to-gray-200"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={image}
                  alt={`Gallery image ${i + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>

          <div className="hidden md:flex gap-4 items-center">
            <div className="flex -space-x-2">
              {people.map((person, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                >
                  <Image
                    src={person.image}
                    alt={person.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-sm">
              Joined by <span className="text-gray-900 font-medium">10,000+</span> creators
            </p>
          </div>
        </motion.div>

        {/* Right side - Login card */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white border border-gray-100 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>

                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setIsHovering(true)}
                    onHoverEnd={() => setIsHovering(false)}
                  >
                    <Button
                      size="lg"
                      className="w-full h-14 bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:shadow-lg hover:shadow-[#ee2a7b]/20 text-white border-0 transition-all duration-300 rounded-xl relative overflow-hidden group"
                      onClick={() => signIn.social({ provider: "google" })}
                    >
                      <div className="absolute inset-0 w-full h-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex items-center justify-center gap-3 relative z-10">
                        <div className="bg-white rounded-full p-1.5">
                          <Image src="/google.svg" alt="Google" width={18} height={18} />
                        </div>
                        <span className="font-medium">Continue with Google</span>
                        <AnimatePresence>
                          {isHovering && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="absolute right-4"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Button>
                  </motion.div>

                  <div className="pt-4">
                    <p className="text-center text-sm text-gray-500">
                      By continuing, you agree to our{" "}
                      <a href="#" className="text-[#ee2a7b] hover:text-[#6228d7] transition-colors">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#ee2a7b] hover:text-[#6228d7] transition-colors">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
