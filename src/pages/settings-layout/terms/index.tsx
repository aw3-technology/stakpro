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
          Welcome to Software Tool Discovery Platform (the "Service"). These Terms & Conditions
          ("Terms") govern your access to and use of our software tool discovery
          and comparison platform, including any content, functionality, and services
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
                Our Platform provides:
              </span>
              <ul className="list-disc list-inside">
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Software tool discovery and comparison services
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  User-submitted tool reviews and ratings
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Tool collections and saved lists for registered users
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  AI-powered tool recommendations based on your requirements
                </li>
              </ul>
              <span className="text-sm text-foreground/60 leading-5 font-normal">
                We strive to provide accurate and up-to-date information, but we
                do not guarantee the accuracy, completeness, or reliability of
                any tool information or recommendations provided through the
                Platform.
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              3. User Accounts
            </span>
            <div className="flex flex-col gap-3">
              <span className="text-sm text-foreground/60 leading-5 font-normal">
                To access certain features of the Platform, you may need to
                create an account. You agree to:
              </span>
              <ul className="list-disc list-inside">
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Provide accurate and complete information when creating your
                  account.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Keep your account credentials secure and confidential.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Notify us immediately of any unauthorized use of your
                  account.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Be responsible for all activities that occur under your
                  account.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              4. User Content and Submissions
            </span>
            <div className="flex flex-col gap-3">
              <span className="text-sm text-foreground/60 leading-5 font-normal">
                By submitting tools, reviews, or other content to the Platform,
                you:
              </span>
              <ul className="list-disc list-inside">
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Grant us a non-exclusive, worldwide, royalty-free license to
                  use, display, and distribute your content.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Warrant that you have the right to submit the content and
                  that it does not infringe any third-party rights.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Agree not to submit false, misleading, or malicious content.
                </li>
                <li className="text-sm text-foreground/60 leading-5 font-normal">
                  Understand that we may moderate or remove content at our
                  discretion.
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              5. Privacy and Data Protection
            </span>
            <span className="text-sm text-foreground/60 leading-5 font-normal">
              Your use of the Platform is also governed by our{' '}
              <Link
                to="/privacy-policy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </Link>
              , which explains how we collect, use, and protect your personal
              information. By using the Service, you consent to our data
              practices as described in the Privacy Policy.
            </span>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              6. Intellectual Property
            </span>
            <span className="text-sm text-foreground/60 leading-5 font-normal">
              All content on the Platform, including text, graphics, logos,
              and software, is the property of the Platform or its licensors
              and is protected by intellectual property laws. You may not
              reproduce, distribute, or create derivative works without our
              express written permission.
            </span>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              7. Limitation of Liability
            </span>
            <span className="text-sm text-foreground/60 leading-5 font-normal">
              To the fullest extent permitted by law, we shall not be liable
              for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of the Platform,
              including but not limited to damages for loss of profits, data,
              or other intangibles.
            </span>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              8. Contact Information
            </span>
            <span className="text-sm text-foreground/60 leading-5 font-normal">
              If you have any questions about these Terms, please contact us
              at support@stakpro.com.
            </span>
          </div>
        </div>
      </CustomCard>
    </>
  );
};