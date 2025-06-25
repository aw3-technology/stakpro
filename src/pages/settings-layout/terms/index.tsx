import { ContentHeader } from '@/components/custom/content-header';
import { CustomCard } from '@/components/custom/custom-card';
import { Link } from 'react-router';
export const Terms = () => {
  return (
    <>
      <ContentHeader
        title="Terms and Conditions"
        description="How we protect your data and the rules of using our service"
      />
      <CustomCard className="p-6">
        <span className="text-base text-foreground font-medium leading-5">
          Last updated: 02.13.2025
        </span>
        <span className="text-sm text-foreground/60 leading-5 font-normal">
          Welcome to Travel Planner (the "Service"). These Terms & Conditions
          ("Terms") govern your access to and use of our AI-powered trip
          planning platform, including any content, functionality, and services
          offered through our website or mobile application (collectively, the
          "Platform"). By accessing or using the Service, you agree to be bound
          by these Terms. If you do not agree to these Terms, you must not use
          the Service.
        </span>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              1. Acceptance of Terms
            </span>
            <div className="flex flex-col gap-3">
              <span className="text-sm text-foreground/60 leading-5 font-normal">
                By using the Service, you confirm that:
              </span>
              <ul className="list-disc list-inside">
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  You are at least 18 years old or have the legal capacity to
                  enter into a binding agreement.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  You agree to comply with these Terms and all applicable laws
                  and regulations.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              2. Description of Service
            </span>
            <div className="flex flex-col gap-4">
              <span className="text-sm text-foreground/60 leading-5 font-normal">
                Our Service provides an AI-powered trip planning platform that
                allows users to:
              </span>
              <ul className="list-disc list-inside">
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Generate personalized travel itineraries.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Search for flights, hotels, and activities.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Access AI-generated photo simulations and cultural tips.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Export travel plans in PDF or other formats.
                </li>
              </ul>
              <span className="text-sm text-foreground/60 leading-5 font-normal">
                We reserve the right to modify, suspend, or discontinue any part
                of the Service at any time without notice.
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              3. User Responsibilities
            </span>
            <div className="flex flex-col gap-4">
              <span className="text-sm text-foreground/60 leading-5 font-normal">
                You agree to:
              </span>
              <ul className="list-disc list-inside">
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Provide accurate and complete information when using the
                  Service.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Use the Service only for lawful purposes.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Not misuse the Service by interfering with its operation or
                  attempting to access it through unauthorized means.
                </li>
              </ul>
              <span className="text-sm text-foreground/60 leading-5 font-normal">
                You are solely responsible for:
              </span>
              <ul className="list-disc list-inside">
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Any content you upload, share, or generate using the Service.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Ensuring your travel plans comply with local laws,
                  regulations, and health advisories.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              4. Intellectual Property
            </span>
            <div className="flex flex-col gap-4">
              <ul className="list-disc list-inside flex flex-col gap-4">
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Your Content: You retain ownership of any content you upload
                  or create using the Service. However, by using the Service,
                  you grant us a non-exclusive, worldwide, royalty-free license
                  to use, reproduce, and display your content for the purpose of
                  providing the Service.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Our Content: All intellectual property rights in the Service,
                  including but not limited to software, designs, logos, and
                  AI-generated content, are owned by or licensed to us. You may
                  not copy, modify, or distribute any part of the Service
                  without our prior written consent.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              5. AI-Generated Content
            </span>
            <div className="flex flex-col gap-4">
              <ul className="list-disc list-inside flex flex-col gap-4">
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  The Service uses artificial intelligence to generate travel
                  plans, photos, and cultural tips. While we strive for
                  accuracy, we do not guarantee the correctness, completeness,
                  or reliability of AI-generated content.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  You acknowledge that AI-generated content is for informational
                  purposes only and should not be considered professional advice
                  (e.g., legal, medical, or financial).
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              6. Data Privacy
            </span>
            <span className="text-sm text-foreground/60 leading-5 font-normal">
              Your use of the Service is subject to our Privacy Policy, which
              explains how we collect, use, and protect your personal data. By
              using the Service, you consent to the collection and use of your
              data as outlined in the{' '}
              <Link
                to="/privacy-policy"
                className="text-primary hover:underline text-sm"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              7. Subscription Plans and Payments
            </span>
            <div className="flex flex-col gap-4">
              <ul className="list-disc list-inside flex flex-col gap-4">
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Free Plan: Limited access to features. Includes ads and
                  watermarked exports.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Paid Plans: Subscription fees are billed monthly or annually.
                  You can cancel your subscription at any time, but no refunds
                  will be provided for partial billing periods.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Automatic Renewal: Subscriptions automatically renew unless
                  canceled at least 24 hours before the end of the current
                  billing period.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              8. Limitation of Liability
            </span>
            <div className="flex flex-col gap-4">
              <span className="text-sm text-foreground/60 leading-5 font-normal">
                To the fullest extent permitted by law, we shall not be liable
                for:
              </span>
              <ul className="list-disc list-inside">
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Any indirect, incidental, or consequential damages arising
                  from your use of the Service.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Errors, inaccuracies, or omissions in AI-generated content.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Travel-related issues, including but not limited to flight
                  delays, cancellations, or accommodation problems.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              9. Indemnification
            </span>
            <div className="flex flex-col gap-4">
              <span className="text-sm text-foreground/60 leading-5 font-normal">
                You agree to indemnify and hold harmless [Your Company Name],
                its affiliates, and their respective officers, directors,
                employees, and agents from any claims, liabilities, damages, or
                expenses (including legal fees) arising out of:
              </span>
              <ul className="list-disc list-inside">
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Your use of the Service.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Your violation of these Terms.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Your infringement of any third-party rights.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              10. Termination
            </span>
            <div className="flex flex-col gap-4">
              <span className="text-sm text-foreground/60 leading-5 font-normal">
                We reserve the right to suspend or terminate your access to the
                Service at any time, with or without notice, for any reason,
                including but not limited to:
              </span>
              <ul className="list-disc list-inside">
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Violation of these Terms.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Fraudulent or abusive behavior.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Non-payment of subscription fees.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              11. Governing Law
            </span>
            <div className="flex flex-col gap-4">
              <span className="text-sm text-foreground/60 leading-5 font-normal">
                These Terms are governed by and construed in accordance with the
                laws of [Your Country/State]. Any disputes arising from these
                Terms shall be resolved exclusively in the courts of [Your
                Jurisdiction].
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              12. Changes to These Terms
            </span>
            <div className="flex flex-col gap-4">
              <span className="text-sm text-foreground/60 leading-5 font-normal">
                We may update these Terms from time to time. If we make material
                changes, we will notify you by email or through the Service.
                Your continued use of the Service after such changes constitutes
                your acceptance of the revised Terms.
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              13. Contact Us
            </span>
            <div className="flex flex-col gap-4">
              <span className="text-sm text-foreground/60 leading-5 font-normal">
                If you have any questions about these Terms, please contact us
                at:
              </span>
              <ul className="list-decimal list-inside ">
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Email: legal@travelplanner.io
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Address: 123 Travel Lane, Suite 100 San Francisco, CA 94107
                </li>
              </ul>
            </div>
          </div>
          <span className="text-sm text-foreground/60 leading-5 font-normal">
            By using [Your Product Name], you acknowledge that you have read,
            understood, and agree to these Terms & Conditions.
          </span>
        </div>
      </CustomCard>
    </>
  );
};
