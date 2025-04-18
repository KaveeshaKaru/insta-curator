import Link from "next/link"
import { ArrowLeft, ChevronRight, Mail, MessageSquare, Shield, Lock, Database, Cookie, Baby, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type Section = {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  list?: string[];
};

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Privacy Policy
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
              <h2 className="text-2xl font-semibold tracking-tight">Contact Us</h2>
              <p className="text-muted-foreground">Reach out with any privacy concerns</p>
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
          className="group rounded-lg bg-gradient-to-r from-primary to-blue-600 px-8 py-6 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
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
          At Instagram Curator, we respect your privacy and are committed to protecting your personal data. This
          Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
          service.
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please
          do not access the application.
        </p>
      </>
    )
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: "Information We Collect",
    content: (
      <>
        <h3 className="text-xl font-semibold">Personal Data</h3>
        <p>When you register for an account, we may collect:</p>
        <List items={[
          "Name",
          "Email address",
          "Instagram account information",
          "Profile pictures"
        ]} />
        
        <h3 className="text-xl font-semibold mt-6">Usage Data</h3>
        <p>We may also collect information on service usage:</p>
        <List items={[
          "IP address",
          "Browser type and version",
          "Visited pages",
          "Time and date of visits",
          "Time spent on pages",
          "Diagnostic data"
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
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>,
    title: "How We Use Your Information",
    content: (
      <>
        <p>We use the collected data for various purposes:</p>
        <List items={[
          "Provide and maintain our service",
          "Notify about changes",
          "Enable interactive features",
          "Provide customer support",
          "Gather analysis for improvements",
          "Monitor usage",
          "Detect and prevent technical issues"
        ]} />
      </>
    )
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: "Data Storage and Security",
    content: (
      <>
        <p className="text-lg leading-relaxed text-muted-foreground">
          The security of your data is important to us, but remember that no method of transmission over the Internet
          is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we
          cannot guarantee absolute security.
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground mt-4">
          Your data is stored securely and only accessible by authorized personnel. We implement appropriate technical
          and organizational measures to ensure security.
        </p>
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
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>,
    title: "Third-Party Services",
    content: (
      <>
        <p className="text-lg leading-relaxed text-muted-foreground">
          We may employ third-party companies and individuals to facilitate our service ("Service Providers"), who
          have access to your Personal Data only to perform tasks on our behalf.
        </p>
        <h3 className="text-xl font-semibold mt-6">Instagram Integration</h3>
        <p className="text-lg leading-relaxed text-muted-foreground">
          When connecting your Instagram account, we access only necessary information in accordance with Instagram's
          terms and privacy policy.
        </p>
      </>
    )
  },
  {
    icon: <Cookie className="h-5 w-5" />,
    title: "Cookies and Tracking",
    content: (
      <>
        <p className="text-lg leading-relaxed text-muted-foreground">
          We use cookies and similar tracking technologies to track activity on our service. Cookies are files with
          small amounts of data that may include an anonymous unique identifier.
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground mt-4">
          You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
        </p>
      </>
    )
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Your Data Protection Rights",
    content: (
      <>
        <p>Every user is entitled to the following rights:</p>
        <List items={[
          "Right to access - Request copies of your personal data",
          "Right to rectification - Correct inaccurate information",
          "Right to erasure - Delete your data under certain conditions",
          "Right to restrict processing - Limit data processing",
          "Right to object to processing - Oppose data processing",
          "Right to data portability - Transfer your data"
        ]} />
      </>
    )
  },
  {
    icon: <Baby className="h-5 w-5" />,
    title: "Children's Privacy",
    content: (
      <p className="text-lg leading-relaxed text-muted-foreground">
        Our service does not address anyone under 13. We do not knowingly collect personal information from children.
        Parents/guardians should contact us if they believe their child has provided Personal Data.
      </p>
    )
  },
  {
    icon: <RefreshCw className="h-5 w-5" />,
    title: "Changes to This Policy",
    content: (
      <>
        <p className="text-lg leading-relaxed text-muted-foreground">
          We may update our Privacy Policy periodically. We will notify you of changes by updating the "Last updated"
          date and posting the new policy.
        </p>
        <p className="text-lg leading-relaxed text-muted-foreground mt-4">
          You should review this policy regularly. Changes are effective when posted.
        </p>
      </>
    )
  }
];

const contactMethods = [
  { icon: Mail, text: "privacy@instagramcurator.com" },
  { icon: MessageSquare, text: "Contact Page" }
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