import { ContentHeader } from '@/components/custom/content-header';
import { CustomCard } from '@/components/custom/custom-card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { RecentInvoicesTable } from './components/recent-invoices-table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useBillingDetailsDrawer } from './hooks/use-billing-detail-drawer-store';
import { BillingDetailsDrawer } from './components/billing-details-drawer';
export const Billing = () => {
  const { setOpen } = useBillingDetailsDrawer();
  return (
    <>
      <BillingDetailsDrawer />
      <ContentHeader
        title="Billing"
        description="Manage your subscription, update payment methods, and view invoices"
      />
      <div className="flex flex-col gap-9">
        {/* Plans */}
        <div className="inline-flex flex-col md:flex-row gap-4 ">
          <CustomCard className="h-fit">
            <div className="flex flex-col gap-3">
              <span className="text-base leading-5 text-foreground">Free</span>
              <div className="flex flex-col gap-1">
                <span className="text-xl text-foreground leading-7">$0</span>
                <span className="text-xs text-foreground/50 leading-4">
                  Free for all users
                </span>
              </div>
            </div>
            <div className="flex">
              <Button
                size="sm"
                className="rounded-full text-foreground/70 text-sm leading-5 border-2 border-input px-4"
                variant="outline"
              >
                Current plan
              </Button>
            </div>
          </CustomCard>
          <CustomCard className="flex-row gap-0 justify-between">
            <div className="flex flex-col gap-3">
              <span className="text-base font-medium leading-5 text-foreground">
                Basic
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-xl font-semibold leading-7 text-foreground">
                  $9
                </span>
                <span className="text-xs text-foreground/50 leading-4">
                  Everything on Free, plus
                </span>
              </div>
              <div className="flex flex-col gap-3 pt-4">
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
            </div>
            <Button size="sm" className="rounded-full">
              Upgrade Plan
            </Button>
          </CustomCard>
        </div>
        {/* Billing Details */}
        <div className="inline-flex flex-col gap-6">
          <div className="flex gap-4 justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm md:text-base font-medium leading-5 text-popover-foreground">
                Billing Details
              </span>
              <span className="text-sm md:text-base font-medium leading-5 text-muted-foreground">
                Manage your payment methods and billing information.
              </span>
            </div>
            <Button
              size="sm"
              className="rounded-full text-foreground/70 text-sm leading-5 border-2 border-input px-4"
              variant="outline"
              onClick={() => setOpen(true)}
            >
              Update billing details
            </Button>
          </div>
          <CustomCard>
            <div className="inline-flex gap-4">
              <div className="inline-flex flex-col gap-1 w-full">
                <span className="text-sm text-popover-foreground leading-5 font-medium">
                  Billing Email
                </span>
                <span className="text-base text-foreground/60 leading-5">
                  me@gjohnson.com
                </span>
              </div>
              <div className="inline-flex flex-col gap-1 w-full">
                <span className="text-sm text-popover-foreground leading-5 font-medium">
                  Company Name
                </span>
                <span className="text-base text-foreground/60 leading-5">
                  Travel Planner Inc.
                </span>
              </div>
            </div>
            <div className="inline-flex gap-4">
              <div className="inline-flex flex-col gap-1 w-full">
                <span className="text-sm text-popover-foreground leading-5 font-medium">
                  Address
                </span>
                <span className="text-base text-foreground/60 leading-5">
                  82787 Bins Mountain Apt. 703
                </span>
              </div>
              <div className="inline-flex flex-col gap-1 w-full">
                <span className="text-sm text-popover-foreground leading-5 font-medium">
                  VAT Number
                </span>
                <span className="text-base text-foreground/60 leading-5">
                  Not provided
                </span>
              </div>
            </div>
          </CustomCard>
        </div>
        {/* Recent Invoices */}
        <div className="inline-flex flex-col gap-6">
          <div className="flex gap-4 justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm md:text-base font-medium leading-5 text-popover-foreground">
                Recent Invoices
              </span>
              <span className="text-sm md:text-base font-medium leading-5 text-muted-foreground">
                Includes productivity stats and tasks due today. Sent every
                morning.
              </span>
            </div>
            <Button
              size="sm"
              className="rounded-full text-foreground/70 text-sm leading-5 border-2 border-input px-4"
              variant="outline"
            >
              Cancel subscription
            </Button>
          </div>
          <RecentInvoicesTable />
        </div>
        <div className="flex flex-col gap-4 pt-12 items-center">
          <span className="text-lg font-medium leading-6 text-foreground">
            Billing FAQ
          </span>
          <div className="flex max-w-[480px] w-full">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  When will I be charged?
                </AccordionTrigger>
                <AccordionContent className="text-foreground/60 text-sm font-normal leading-5">
                  On your renewal date (e.g., if you joined on May 15, next
                  charge is June 15).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  Can I pause my subscription?
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  Why was I charged more than the advertised price?
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  Can I switch from monthly to annual?
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  What’s your refund policy?
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  Why isn’t my local payment method accepted?
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <Button
            variant="outline"
            className="text-foreground/70 rounded-full border-input"
            size="sm"
          >
            Need help?
          </Button>
        </div>
      </div>
    </>
  );
};
