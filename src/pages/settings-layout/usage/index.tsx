import { ContentHeader } from '@/components/custom/content-header';
import { CustomCard } from '@/components/custom/custom-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check } from 'lucide-react';

export const Usage = () => {
  return (
    <>
      <ContentHeader
        title="Usage"
        description="Track your AI travel planning resources"
      />
      <div className="flex flex-col gap-9">
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 justify-between">
            <span className="text-base font-medium leading-5 text-foreground/60">
              Monthly Usage Summary
            </span>
            <span className="text-sm font-normal leading-5 text-foreground/60">
              May 2025 Usage
            </span>
          </div>
          <div className="flex gap-4 w-full overflow-x-auto">
            <CustomCard className="w-full min-w-[320px]">
              <div className="flex gap-2 justify-between">
                <span className="text-xs font-normal leading-4 text-foreground/50">
                  Trip Generations
                </span>
                <span className="text-xs font-normal leading-4 text-foreground/50">
                  18/50
                </span>
              </div>
              <Progress value={36} />
              <span className="text-xs font-normal leading-4 text-foreground/50">
                You've used 18 requests out of your 50 monthly quota.
              </span>
            </CustomCard>
            <CustomCard className="w-full min-w-[320px]">
              <div className="flex gap-2 justify-between">
                <span className="text-xs font-normal leading-4 text-foreground/50">
                  PDF Exports
                </span>
                <span className="text-xs font-normal leading-4 text-foreground/50">
                  8/10
                </span>
              </div>
              <Progress value={80} />
              <span className="text-xs font-normal leading-4 text-foreground/50">
                You've used 8 requests out of your 10 monthly quota.
              </span>
            </CustomCard>
          </div>
        </div>
        <CustomCard className="gap-3">
          <div className="flex gap-1 justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-base font-medium leading-5 text-foreground">
                Hit Your Limit?
              </span>
              <span className="text-base font-medium leading-5 text-foreground/60">
                Upgrade to unlock full potential
              </span>
            </div>
            <Button size="sm">Upgrade to Basic</Button>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xl font-semibold leading-7 text-foreground">
              $9
            </span>
            <span className="text-xs text-foreground/50 leading-4">
              Everything on Free, plus
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
        <div className="flex flex-col gap-4 pt-12 items-center">
          <span className="text-lg font-medium leading-6 text-foreground">
            Usage FAQ
          </span>
          <div className="flex max-w-[480px] w-full">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  What counts as a "trip generation"?
                </AccordionTrigger>
                <AccordionContent className="text-foreground/60 text-sm font-normal leading-5">
                  Each time you ask the AI to create a new itinerary (even if
                  you edit it later).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  Do free trials count toward my monthly limits?
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  Any withdrawal fees?
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  When does my usage reset?
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  Can I upgrade mid-cycle?
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  Do unused credits roll over?
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
