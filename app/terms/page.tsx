import Link from "next/link"
import { ArrowLeft, ChevronRight, Mail, MessageSquare, Shield, MapPin, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type Section = {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  list?: string[];
};

export default function TermsOfServicePage() {
  return (
    <div className="container max-w-4xl py-12 px-4 md:px-6">
      <div className="mb-8 space-y-2">
        <Button variant="outline" size="sm" asChild className="group mb-6">
          <Link href="/" className="flex items-center gap-1 transition-all hover:gap-2">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </Button>
        
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-5 w-5" />
            <p className="font-medium">Last updated: April 17, 2025</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-20" />
        
        <div className="prose prose-gray dark:prose-invert max-w-none relative space-y-12">
          {sections.map((section, index) => (
            <section 
              key={index}
              className="group rounded-xl p-6 transition-all hover:bg-muted/30"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {section.title}
                  </h2>
                </div>
                
                <div className="space-y-4 pl-2">
                  {section.content}
                  {section.list && (
                    <List items={section.list} />
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        <Separator className="my-12 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        <section className="rounded-xl bg-muted/30 p-6 transition-all hover:bg-muted/50">
          <div className="flex items-center gap-4">
            <Mail className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Contact Information</h2>
              <p className="text-muted-foreground">Reach out with any questions</p>
            </div>
          </div>
          
          <ul className="mt-6 space-y-3">
            {contactMethods.map((method, index) => (
              <li 
                key={index}
                className="flex items-center gap-3 rounded-lg p-3 transition-all hover:bg-muted/20"
              >
                <method.icon className="h-5 w-5 text-primary" />
                <span>{method.text}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Button 
          asChild 
          className="group rounded-lg bg-gradient-to-r from-primary to-purple-600 px-8 py-6 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
        >
          <Link href="/" className="flex items-center gap-2">
            Return to Home
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

const sections: Section[] = [
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Introduction",
    content: (
      <>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Welcome to Instagram Curator! These Terms of Service govern your use of our application and services. 
          By accessing or using our service, you agree to be bound by these terms.
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Please read these Terms carefully before using our service. If you disagree with any part of these terms, 
          you may not access the application.
        </p>
      </>
    )
  },
  {
    icon: <User className="h-5 w-5" />,
    title: "User Accounts",
    content: (
      <>
        <h3 className="text-xl font-semibold">Account Creation</h3>
        <p>To access certain features, you must create an account. You agree to:</p>
        <List items={[
          "Provide accurate and complete information",
          "Maintain the security of your password",
          "Accept all risks of unauthorized access"
        ]} />
        
        <h3 className="text-xl font-semibold mt-6">Login Requirements</h3>
        <p>When using the login dialog, you must:</p>
        <List items={[
          "Use only your own credentials",
          "Not share your account with others",
          "Immediately notify us of any security breaches"
        ]} />
      </>
    )
  },
  {
    icon: <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 2v20M2 12h20" />
    </svg>,
    title: "App Details & Use",
    content: (
      <>
        <h3 className="text-xl font-semibold">Service Description</h3>
        <p>Instagram Curator provides tools for content curation, scheduling, and analytics for Instagram accounts. Features include:</p>
        <List items={[
          "Content planning and scheduling",
          "Performance analytics",
          "Collaboration tools",
          "Third-party integrations"
        ]} />
        
        <h3 className="text-xl font-semibold mt-6">Acceptable Use</h3>
        <p>You agree not to:</p>
        <List items={[
          "Use the service for illegal purposes",
          "Violate Instagram's terms of service",
          "Reverse engineer or hack the application",
          "Upload harmful or malicious content"
        ]} />
      </>
    )
  },
  {
    icon: <svg 
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>,
    title: "Intellectual Property",
    content: (
      <>
        <p className="text-lg leading-relaxed text-muted-foreground">
          All content and functionality of the application, including text, graphics, logos, and software, 
          are the exclusive property of Instagram Curator and its licensors.
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground mt-4">
          You retain ownership of your user-generated content but grant us a worldwide, non-exclusive 
          license to use it for service operation.
        </p>
      </>
    )
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Disclaimers",
    content: (
      <>
        <p className="text-lg leading-relaxed text-muted-foreground">
          THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
        </p>
        <List items={[
          "Uninterrupted or error-free service",
          "Accuracy of analytics or predictions",
          "Results from using the service"
        ]} />
      </>
    )
  },
  {
    icon: <svg 
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </svg>,
    title: "Limitation of Liability",
    content: (
      <>
        <p className="text-lg leading-relaxed text-muted-foreground">
          We shall not be liable for any indirect, incidental, or consequential damages arising from:
        </p>
        <List items={[
          "Use or inability to use the service",
          "Unauthorized access to your data",
          "Third-party actions or content"
        ]} />
      </>
    )
  },
  {
    icon: <svg 
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>,
    title: "Termination",
    content: (
      <>
        <p className="text-lg leading-relaxed text-muted-foreground">
          We may terminate or suspend your account immediately for:
        </p>
        <List items={[
          "Violation of these terms",
          "Requests from law enforcement",
          "Unexpected technical issues"
        ]} />
      </>
    )
  },
  {
    icon: <svg 
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 2v4" />
      <path d="m16.24 7.76 2.83-2.83" />
      <path d="M18 12h4" />
      <path d="m16.24 16.24 2.83 2.83" />
      <path d="M12 18v4" />
      <path d="m4.93 19.07 2.83-2.83" />
      <path d="M2 12h4" />
      <path d="m4.93 4.93 2.83 2.83" />
    </svg>,
    title: "Changes to Terms",
    content: (
      <>
        <p className="text-lg leading-relaxed text-muted-foreground">
          We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance. 
          We will notify users of significant changes through:
        </p>
        <List items={[
          "In-app notifications",
          "Email to registered users",
          "Updated date at the top of this page"
        ]} />
      </>
    )
  }
];

const contactMethods = [
  { icon: Mail, text: "legal@instagramcurator.com" },
  { icon: MessageSquare, text: "Support Portal" },
  { icon: MapPin, text: "123 Business Street, Tech City, TX 75001" }
];

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-none space-y-3 pl-0">
      {items.map((item, index) => (
        <li 
          key={index}
          className="flex items-start gap-2 rounded-lg p-3 transition-all hover:bg-muted/20"
        >
          <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}