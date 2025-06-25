import { ContentHeader } from '@/components/custom/content-header';
import { CustomCard } from '@/components/custom/custom-card';

export const PrivacyPolicy = () => {
  return (
    <>
      <ContentHeader
        title="Privacy Policy"
        description="Your privacy matters – here’s how we safeguard your information"
      />
      <CustomCard className="p-6">
        <span className="text-base text-foreground font-medium leading-5">
          Last Updated: 05.13.2025
        </span>
        <span className="text-sm text-foreground/60 leading-5 font-normal">
          Travel Planner ("we," "our," or "us") respects your privacy. This
          policy explains how we collect, use, and protect your information when
          you use our AI travel planning templates and design assets.
        </span>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              1. Information We Collect
            </span>
            <ul className="list-none list-inside">
              <li className="text-sm text-foreground/60 leading-5 font-normal">
                Account Data: Name, email, and payment details when you
                purchase.
              </li>
              <li className="text-sm text-foreground/60 leading-5 font-normal">
                Usage Data: Templates accessed, download frequency, and design
                preferences.
              </li>
              <li className="text-sm text-foreground/60 leading-5 font-normal">
                Automated Data: Cookies and analytics (e.g., Figma plugin
                interactions).
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              2. How We Use Your Data
            </span>
            <ul className="list-none list-inside">
              <li className="text-sm text-foreground/60 leading-5 font-normal">
                To provide and improve our design resources
              </li>
              <li className="text-sm text-foreground/60 leading-5 font-normal">
                To personalize your experience (e.g., recommended templates)
              </li>
              <li className="text-sm text-foreground/60 leading-5 font-normal">
                To communicate updates, security alerts, and offers (opt-out
                anytime)
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              3. Data Sharing
            </span>
            <ul className="list-none list-inside">
              <li className="text-sm text-foreground/60 leading-5 font-normal">
                We never sell your data. Limited sharing occurs with:
              </li>
              <li className="text-sm text-foreground/60 leading-5 font-normal">
                Payment processors (Stripe, PayPal)
              </li>
              <li className="text-sm text-foreground/60 leading-5 font-normal">
                Analytics tools (Google Analytics, anonymized)
              </li>
              <li className="text-sm text-foreground/60 leading-5 font-normal">
                Legal compliance (if required by law)
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              4. Security Measures
            </span>
            <span className="text-base text-foreground font-medium leading-5">
              All data is encrypted (SSL/TLS). Payment info is processed via
              PCI-compliant partners.
            </span>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              5. Your Rights
            </span>
            <ul className="list-none list-inside">
              <li className="text-sm text-foreground/60 leading-5 font-normal">
                Access, correct, or delete your data via [Account Settings]
              </li>
              <li className="text-sm text-foreground/60 leading-5 font-normal">
                Opt out of marketing emails (unsubscribe link in all messages)
              </li>
              <li className="text-sm text-foreground/60 leading-5 font-normal">
                Request data portability (contact [email@001tripplanner.com])
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-base text-foreground font-medium leading-5">
              6. Changes to This Policy
            </span>
            <span className="text-sm text-foreground/60 leading-5 font-normal">
              We’ll notify users of material changes via email or in-app alerts.
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-base text-foreground font-medium leading-5">
              Contact Us:
            </span>
            <span className="text-base text-foreground font-medium leading-5">
              For privacy questions:
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-foreground/60 leading-5 font-normal">
              📧 legal@travelplanner.io
            </span>
            <span className="text-sm text-foreground/60 leading-5 font-normal">
              📍 123 Travel Lane, Suite 100 San Francisco, CA 94107
            </span>
          </div>
        </div>
      </CustomCard>
    </>
  );
};
