import { CustomCard } from '@/components/custom/custom-card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PlansCardsProps {
  billingPeriod: 'annual' | 'monthly';
}

// Pricing data for different billing periods
const pricingData = {
  annual: {
    basic: {
      price: 89,
      period: 'year',
      originalPrice: 108, // 9 * 12
      savings: 19
    },
    business: {
      price: 149,
      period: 'year',
      originalPrice: 228, // 19 * 12
      savings: 79
    }
  },
  monthly: {
    basic: {
      price: 9,
      period: 'month',
      originalPrice: 9,
      savings: 0
    },
    business: {
      price: 19,
      period: 'month',
      originalPrice: 19,
      savings: 0
    }
  }
};

export const PlansCards = ({ billingPeriod }: PlansCardsProps) => {
  const pricing = pricingData[billingPeriod];

  return (
    <div className="flex w-full flex-col sm:flex-row gap-4">
      <div className="flex pt-7 w-full rounded-2xl p-0.5">
        <CustomCard>
          <span className="text-base font-medium leading-5 text-foreground">
            Free
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-xl font-semibold leading-7 text-foreground">
              $0
            </span>
            <span className="text-xs text-foreground/50 leading-4">
              Free for all users
            </span>
          </div>
          <Button
            size="sm"
            className="w-full rounded-full text-foreground/70 text-sm leading-5 border-2 border-input px-4"
            variant="outline"
          >
            Current plan
          </Button>
          <div className="flex flex-col gap-3 pt-4">
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              50 free trip plans per month
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              Unlimited AI trips
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              Basic AI (GPT-3.5) with limited edits
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              Travel Story (TikTok/Instagram)
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              Ads
            </span>
          </div>
        </CustomCard>
      </div>
      <div className="flex w-full bg-primary rounded-2xl p-0.5 flex-col">
        <div className="flex flex-col gap-1 p-1 items-center">
          <span className="text-sm text-primary-foreground leading-4">
            🎉 Most Popular
          </span>
        </div>
        <CustomCard className="bg-background-elevated">
          <span className="text-base font-medium leading-5 text-foreground">
            Basic
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-xl font-semibold leading-7 text-foreground">
              ${pricing.basic.price}
              <span className="text-base text-foreground/50 font-medium">
                / {pricing.basic.period}
              </span>
            </span>
            {billingPeriod === 'annual' ? (
              <span className="text-xs text-foreground/50 leading-4">
                Save ${pricing.basic.savings} vs monthly billing
              </span>
            ) : (
              <span className="text-xs text-foreground/50 leading-4">
                Billed monthly
              </span>
            )}
          </div>
          <Button size="sm" className="rounded-full">
            Upgrade
          </Button>
          <div className="flex flex-col gap-3 pt-4">
            <span className="text-sm text-foreground/60 leading-5 font-medium">
              Everything on Free, plus
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              Unlimited trip plans
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              Real-time edits with GPT-4 Turbo
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              Photo Simulation
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              Download pdf
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              Notifications for price drops
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              Budget optimization
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              Enhanced email sending
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              Ad-free
            </span>
          </div>
        </CustomCard>
      </div>
      <div className="flex pt-7 w-full rounded-2xl p-0.5">
        <CustomCard>
          <span className="text-base font-medium leading-5 text-foreground">
            Business
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-xl font-semibold leading-7 text-foreground">
              ${pricing.business.price}
              <span className="text-base text-foreground/50 font-medium">
                / {pricing.business.period} / user
              </span>
            </span>
            {billingPeriod === 'annual' ? (
              <span className="text-xs text-foreground/50 leading-4">
                Save ${pricing.business.savings} vs monthly billing
              </span>
            ) : (
              <span className="text-xs text-foreground/50 leading-4">
                Billed monthly per user
              </span>
            )}
          </div>
          <Button
            size="sm"
            className="w-full rounded-full text-foreground/70 text-sm leading-5 border-2 border-input px-4"
            variant="outline"
          >
            Upgrade
          </Button>
          <div className="flex flex-col gap-3 pt-4">
            <span className="text-sm text-foreground/60 leading-5 font-medium">
              Everything on Basic, plus
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              Team Management Up to 10 users
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              API Access
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              Custom AI Model Training
            </span>
            <span className="text-2xs text-foreground/50 leading-4 flex items-center gap-1">
              <Check className="size-3.5" />
              Enhanced email sending
            </span>
          </div>
        </CustomCard>
      </div>
    </div>
  );
};
