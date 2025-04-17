import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function TermsOfServicePage() {
  return (
    <div className="container max-w-4xl py-12 px-4 md:px-6">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: April 17, 2025</p>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
            Welcome to Instagram Curator! These Terms of Service govern your use of our application and services. By accessing or using our service, you agree to be bound by these terms.
          </p>
          <p>
            Please read these Terms carefully before using our service. If you disagree with any part of these terms, you may not access the application.
          </p>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
          <h3 className="text-xl font-medium mb-2">Account Creation</h3>
          <p>To access certain features, you must create an account. You agree to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your password</li>
            <li>Accept all risks of unauthorized access</li>
          </ul>

          <h3 className="text-xl font-medium mb-2">Login Requirements</h3>
          <p>When using the login dialog, you must:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Use only your own credentials</li>
            <li>Not share your account with others</li>
            <li>Immediately notify us of any security breaches</li>
          </ul>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">App Details & Use</h2>
          <h3 className="text-xl font-medium mb-2">Service Description</h3>
          <p>
            Instagram Curator provides tools for content curation, scheduling, and analytics for Instagram accounts. Features may include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Content planning and scheduling</li>
            <li>Performance analytics</li>
            <li>Collaboration tools</li>
            <li>Third-party integrations</li>
          </ul>

          <h3 className="text-xl font-medium mb-2">Acceptable Use</h3>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Use the service for illegal purposes</li>
            <li>Violate Instagram's terms of service</li>
            <li>Reverse engineer or hack the application</li>
            <li>Upload harmful or malicious content</li>
          </ul>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
          <p>
            All content and functionality of the application, including text, graphics, logos, and software, are the exclusive property of Instagram Curator and its licensors.
          </p>
          <p>
            You retain ownership of your user-generated content but grant us a worldwide, non-exclusive license to use it for service operation.
          </p>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Disclaimers</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Uninterrupted or error-free service</li>
            <li>Accuracy of analytics or predictions</li>
            <li>Results from using the service</li>
          </ul>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
          <p>
            We shall not be liable for any indirect, incidental, or consequential damages arising from:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Use or inability to use the service</li>
            <li>Unauthorized access to your data</li>
            <li>Third-party actions or content</li>
          </ul>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Termination</h2>
          <p>
            We may terminate or suspend your account immediately for:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Violation of these terms</li>
            <li>Requests from law enforcement</li>
            <li>Unexpected technical issues</li>
          </ul>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance. We will notify users of significant changes through:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>In-app notifications</li>
            <li>Email to registered users</li>
            <li>Updated date at the top of this page</li>
          </ul>
        </section>

        <Separator className="my-8" />

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p>For questions about these Terms of Service, contact us:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>By email: legal@instagramcurator.com</li>
            <li>Through our support portal</li>
            <li>Via mail: 123 Business Street, Tech City, TX 75001</li>
          </ul>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}