import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl py-12 px-4 md:px-6">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: April 17, 2025</p>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p>
            At Instagram Curator, we respect your privacy and are committed to protecting your personal data. This
            Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our
            service.
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please
            do not access the application.
          </p>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <h3 className="text-xl font-medium mb-2">Personal Data</h3>
          <p>When you register for an account, we may collect the following types of information:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Name</li>
            <li>Email address</li>
            <li>Instagram account information</li>
            <li>Profile pictures</li>
          </ul>

          <h3 className="text-xl font-medium mb-2">Usage Data</h3>
          <p>We may also collect information on how the service is accessed and used. This Usage Data may include:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your computer's Internet Protocol address (IP address)</li>
            <li>Browser type and version</li>
            <li>Pages of our service that you visit</li>
            <li>Time and date of your visit</li>
            <li>Time spent on those pages</li>
            <li>Other diagnostic data</li>
          </ul>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p>We use the collected data for various purposes:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To allow you to participate in interactive features of our service when you choose to do so</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Storage and Security</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet
            or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to
            protect your Personal Data, we cannot guarantee its absolute security.
          </p>
          <p>
            Your data is stored securely in our database and is only accessible by authorized personnel. We implement
            appropriate technical and organizational measures to ensure a level of security appropriate to the risk.
          </p>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
          <p>
            We may employ third-party companies and individuals to facilitate our service ("Service Providers"), to
            provide the service on our behalf, to perform service-related services, or to assist us in analyzing how our
            service is used.
          </p>
          <p>
            These third parties have access to your Personal Data only to perform these tasks on our behalf and are
            obligated not to disclose or use it for any other purpose.
          </p>
          <h3 className="text-xl font-medium mb-2">Instagram Integration</h3>
          <p>
            Our service integrates with Instagram to provide content curation and scheduling features. When you connect
            your Instagram account, we access only the information necessary to provide our services, in accordance with
            Instagram's terms of service and privacy policy.
          </p>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our service and hold certain
            information.
          </p>
          <p>
            Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are
            sent to your browser from a website and stored on your device. You can instruct your browser to refuse all
            cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Data Protection Rights</h2>
          <p>
            We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled
            to the following:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <strong>The right to access</strong> – You have the right to request copies of your personal data.
            </li>
            <li>
              <strong>The right to rectification</strong> – You have the right to request that we correct any
              information you believe is inaccurate. You also have the right to request that we complete information you
              believe is incomplete.
            </li>
            <li>
              <strong>The right to erasure</strong> – You have the right to request that we erase your personal data,
              under certain conditions.
            </li>
            <li>
              <strong>The right to restrict processing</strong> – You have the right to request that we restrict the
              processing of your personal data, under certain conditions.
            </li>
            <li>
              <strong>The right to object to processing</strong> – You have the right to object to our processing of
              your personal data, under certain conditions.
            </li>
            <li>
              <strong>The right to data portability</strong> – You have the right to request that we transfer the data
              that we have collected to another organization, or directly to you, under certain conditions.
            </li>
          </ul>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
          <p>
            Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable
            information from anyone under the age of 13. If you are a parent or guardian and you are aware that your
            child has provided us with Personal Data, please contact us.
          </p>
        </section>

        <Separator className="my-8" />

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
            are effective when they are posted on this page.
          </p>
        </section>

        <Separator className="my-8" />

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>By email: privacy@instagramcurator.com</li>
            <li>By visiting the contact page on our website</li>
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

