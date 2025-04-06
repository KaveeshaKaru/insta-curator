// import Link from "next/link"
// import Image from "next/image"
// import { ArrowRight, Check, Instagram, Grid3X3, User, Calendar, ImageIcon } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { LoginButton } from "../components/login-button"

// export default function LandingPage() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Navigation */}
//       <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
//         <div className="flex items-center gap-2">
//           <Instagram className="h-6 w-6" />
//           <span className="text-xl font-bold">Curator</span>
//         </div>
//         <LoginButton />
//       </header>

//       {/* Hero Section */}
//       <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
//         <div className="container px-4 md:px-6">
//           <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
//             <div className="flex flex-col justify-center space-y-4">
//               <div className="space-y-2">
//                 <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
//                   Curate, Schedule, and Auto-Post to Instagram
//                 </h1>
//                 <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  // The easiest way to manage your Instagram content. Discover and curate photos, organize them into
                  // series, and schedule posts automatically.
//                 </p>
//               </div>
//               <div className="flex flex-col gap-2 min-[400px]:flex-row">
//                 <LoginButton asChild>
//                   <Button size="lg" className="gap-1">
//                     Get Started <ArrowRight className="h-4 w-4" />
//                   </Button>
//                 </LoginButton>
//                 <Link href="#features">
//                   <Button size="lg" variant="outline">
//                     Learn More
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//             <div className="mx-auto lg:mx-0 relative h-[350px] md:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-xl">
//               <Image
//                 src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop"
//                 alt="Instagram Curator Dashboard"
//                 fill
//                 className="object-cover"
//                 priority
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
//         <div className="container px-4 md:px-6">
//           <div className="flex flex-col items-center justify-center space-y-4 text-center">
//             <div className="space-y-2">
//               <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
//                 Everything You Need for Instagram Content Management
//               </h2>
//               <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                 Our platform provides all the tools you need to create a consistent and engaging Instagram presence.
//               </p>
//             </div>
//           </div>
//           <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
//             {features.map((feature) => (
//               <div key={feature.title} className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
//                 <div className="rounded-full bg-primary p-2 text-white">
//                   <feature.icon className="h-6 w-6" />
//                 </div>
//                 <h3 className="text-xl font-bold">{feature.title}</h3>
//                 <p className="text-center text-muted-foreground">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works Section */}
//       <section className="w-full py-12 md:py-24 lg:py-32">
//         <div className="container px-4 md:px-6">
//           <div className="flex flex-col items-center justify-center space-y-4 text-center">
//             <div className="space-y-2">
//               <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How It Works</h2>
//               <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//                 Get started in minutes with our simple workflow.
//               </p>
//             </div>
//           </div>
//           <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
//             {steps.map((step, index) => (
//               <div key={step.title} className="flex flex-col items-center space-y-2 rounded-lg p-4">
//                 <div className="rounded-full bg-primary p-3 text-white font-bold text-xl">{index + 1}</div>
//                 <h3 className="text-xl font-bold">{step.title}</h3>
//                 <p className="text-center text-muted-foreground">{step.description}</p>
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-center mt-12">
//             <LoginButton asChild>
//               <Button size="lg" className="gap-1">
//                 Start Now <ArrowRight className="h-4 w-4" />
//               </Button>
//             </LoginButton>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t py-6 md:py-8">
//         <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row">
//           <div className="flex items-center gap-2">
//             <Instagram className="h-5 w-5" />
//             <span className="text-lg font-semibold">Curator</span>
//           </div>
//           <p className="text-center text-sm text-muted-foreground md:text-left">
//             &copy; {new Date().getFullYear()} Instagram Curator. All rights reserved.
//           </p>
//           <div className="flex gap-4 md:ml-auto">
//             <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
//               Terms
//             </Link>
//             <Link href="#" className="text-sm text-muted-foreground underline underline-offset-4">
//               Privacy
//             </Link>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

// const features = [
//   {
//     title: "Content Curation",
//     description: "Discover and save photos from other creators with proper attribution.",
//     icon: ImageIcon,
//   },
//   {
//     title: "Series Organization",
//     description: "Organize your content into themed series for consistent posting.",
//     icon: Grid3X3,
//   },
//   {
//     title: "Scheduling",
//     description: "Plan your posts in advance and schedule them for optimal times.",
//     icon: Calendar,
//   },
//   {
//     title: "Auto-Posting",
//     description: "Automatically publish your posts to Instagram at scheduled times.",
//     icon: Instagram,
//   },
//   {
//     title: "Analytics",
//     description: "Track performance and engagement of your posts.",
//     icon: Check,
//   },
//   {
//     title: "Multi-Account Support",
//     description: "Manage multiple Instagram accounts from one dashboard.",
//     icon: User,
//   },
// ]

// const steps = [
//   {
//     title: "Connect Your Account",
//     description: "Sign in with Google and connect your Instagram business account.",
//   },
//   {
//     title: "Curate Content",
//     description: "Discover and save photos or upload your own content.",
//   },
//   {
//     title: "Schedule & Automate",
//     description: "Create series, schedule posts, and let the system handle the rest.",
//   },
// ]










import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Instagram, Grid3X3, User, Calendar, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoginButton } from "../components/login-button"


export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold">C</Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">FEATURES</Link>
                <Link href="#templates" className="text-sm font-medium text-gray-600 hover:text-gray-900">TEMPLATES</Link>
                <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">PRICING</Link>
                <Link href="#events" className="text-sm font-medium text-gray-600 hover:text-gray-900">EVENTS</Link>
                <Link href="#docs" className="text-sm font-medium text-gray-600 hover:text-gray-900">DOCS</Link>
                <Link href="#blog" className="text-sm font-medium text-gray-600 hover:text-gray-900">BLOG</Link>
                <Link href="#contact" className="text-sm font-medium text-gray-600 hover:text-gray-900">CONTACT</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <LoginButton></LoginButton>
              <Button variant="default" size="sm" className="bg-black text-white hover:bg-gray-800">
                Sign up, it's Free
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-16">
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
              <div className="max-w-2xl">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                The easiest way to manage your Instagram content.
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                Discover and <span className="font-medium">curate photos, organize</span> them into
                series, and schedule posts automatically.
                </p>
                <div className="space-y-4">
                  <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg">
                    Sign up, it's Free Forever
                  </Button>
                  <p className="text-sm text-gray-500">No credit card required.</p>
                </div>
              </div>

              {/* Social Feed Preview */}
              <div className="relative w-full lg:w-[600px] h-[500px]">
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-4">
                  <div className="col-span-4 row-span-3 bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <Image
                      src="https://images.unsplash.com/photo-1513593771513-7b58b6c4af38"
                      alt="Surfing"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="col-span-2 row-span-4 col-start-5 bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <Image
                      src="https://images.unsplash.com/photo-1505144808419-1957a94ca61e"
                      alt="Palm trees"
                      width={400}
                      height={800}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="col-span-3 row-span-3 row-start-4 bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <Image
                      src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937"
                      alt="Coffee shop"
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Everything You Need for Instagram Content Management
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform provides all the tools you need to create a consistent and engaging Instagram presence.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary p-2 text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-center text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get started in minutes with our simple workflow.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center space-y-2 rounded-lg p-4">
                <div className="rounded-full bg-primary p-3 text-white font-bold text-xl">{index + 1}</div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-center text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <LoginButton asChild>
              <Button size="lg" className="gap-1">
                Start Now <ArrowRight className="h-4 w-4" />
              </Button>
            </LoginButton>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Curator. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "Content Curation",
    description: "Discover and save photos from other creators with proper attribution.",
    icon: ImageIcon,
  },
  {
    title: "Series Organization",
    description: "Organize your content into themed series for consistent posting.",
    icon: Grid3X3,
  },
  {
    title: "Scheduling",
    description: "Plan your posts in advance and schedule them for optimal times.",
    icon: Calendar,
  },
  {
    title: "Auto-Posting",
    description: "Automatically publish your posts to Instagram at scheduled times.",
    icon: Instagram,
  },
  {
    title: "Analytics",
    description: "Track performance and engagement of your posts.",
    icon: Check,
  },
  {
    title: "Multi-Account Support",
    description: "Manage multiple Instagram accounts from one dashboard.",
    icon: User,
  },
]

const steps = [
  {
    title: "Connect Your Account",
    description: "Sign in with Google and connect your Instagram business account.",
  },
  {
    title: "Curate Content",
    description: "Discover and save photos or upload your own content.",
  },
  {
    title: "Schedule & Automate",
    description: "Create series, schedule posts, and let the system handle the rest.",
  },
]
