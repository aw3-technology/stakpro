import { ContentHeader } from '@/components/custom/content-header';
import { Tag } from '@/components/custom/tag';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Info, X } from 'lucide-react';
import { PlansCards } from './components/plans-cards';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

export const Plans = () => {
  const [billingPeriod, setBillingPeriod] = useState<'annual' | 'monthly'>('annual');
  
  return (
    <TooltipProvider>
      <ContentHeader
        title="Plans"
        description="Unlock more AI trips, priority support, and premium features."
      />
      <div className="flex flex-col gap-9">
        <Tabs value={billingPeriod} onValueChange={(value) => setBillingPeriod(value as 'annual' | 'monthly')}>
          <TabsList className="rounded-full p-0.5">
            <TabsTrigger
              value="annual"
              className="rounded-full data-[state=active]:bg-background-elevated dark:data-[state=active]:bg-background-elevated dark:dark:data-[state=active]:bg-background-elevated text-foreground/60 px-1"
            >
              <span className="pl-2 pr-1">Annual</span>
              <Tag className="bg-emerald-900 text-emerald-50 rounded-full">
                <div className="flex flex-row gap-1 items-center">
                  <Check className="size-3.5" />
                  <span className="text-xs">Save 20%</span>
                </div>
              </Tag>
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="rounded-full data-[state=active]:bg-background-elevated dark:data-[state=active]:bg-background-elevated dark:dark:data-[state=active]:bg-background-elevated text-foreground/60 px-1"
            >
              <span className="pl-2 pr-1">Monthly</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <PlansCards billingPeriod={billingPeriod} />
        <div className="flex flex-col gap-4 pt-6 w-full">
          <div className="flex flex-col gap-2">
            <span className="text-base text-popover-foreground leading-5 font-medium">
              Compare all features
            </span>
            <span className="text-base text-muted-foreground leading-5 font-medium">
              Find your perfect fit – whether you're a casual traveler or a
              power user.
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>
                  <span className="text-sm text-foreground/50">Feature</span>
                </TableHead>
                <TableHead className="text-sm text-foreground/50">
                  <span className="text-sm text-foreground/50">Free</span>
                </TableHead>
                <TableHead className="text-sm text-foreground/50">
                  <span className="text-sm text-foreground/50">Basic</span>
                </TableHead>
                <TableHead className="text-sm text-foreground/50">
                  <span className="text-sm text-foreground/50">Business</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.feature}</TableCell>
                  <TableCell>{item.free}</TableCell>
                  <TableCell>{item.basic}</TableCell>
                  <TableCell>{item.business}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col gap-4 pt-12 items-center">
          <span className="text-lg font-medium leading-6 text-foreground">
            FAQ
          </span>
          <div className="flex max-w-[480px] w-full">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  Can I stay on the free plan forever?
                </AccordionTrigger>
                <AccordionContent className="text-foreground/60 text-sm font-normal leading-5">
                  Yes! But Pro unlocks unlimited trips and premium features.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  What happens if I downgrade from Pro to Free?
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  Do all plans include customer support?
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  Are there discounts for students/nonprofits?
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  Can I pay with cryptocurrency?
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  How do I cancel my subscription?
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
    </TooltipProvider>
  );
};

const tableData = [
  {
    id: '1',
    feature: (
      <span className=" font-normal text-foreground/70">
        AI Trip Generations
      </span>
    ),
    free: <span className=" font-normal text-foreground/70">50/month</span>,
    basic: <span className=" font-normal text-foreground/70">Unlimited</span>,
    business: (
      <span className=" font-normal text-foreground/70">
        Unlimited + Team Sharing
      </span>
    ),
  },
  {
    id: '2',
    feature: (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-row gap-1 items-center cursor-help">
            <span className=" font-normal text-foreground/70 underline decoration-1 decoration-foreground/30 decoration-dotted underline-offset-2">
              PDF Exports
            </span>
            <Info className="size-3.5 text-foreground/70" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
            Export your travel plans in various formats. Free plan includes watermarked PDFs, 
            while paid plans offer clean exports in PDF, Excel, and other formats.
        </TooltipContent>
      </Tooltip>
    ),
    free: <span className=" font-normal text-foreground/70">Watermarked</span>,
    basic: (
      <span className=" font-normal text-foreground/70">Clean PDF/Excel</span>
    ),
    business: (
      <span className=" font-normal text-foreground/70">All Formats + API</span>
    ),
  },
  {
    id: '3',
    feature: (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-row gap-1 items-center cursor-help">
            <span className=" font-normal text-foreground/70 underline decoration-1 decoration-foreground/30 decoration-dotted underline-offset-2">
              Photo Simulations
            </span>
            <Info className="size-3.5 text-foreground/70" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
            Generate AI-powered visual simulations of your travel destinations. 
            See how your trip might look before you go with realistic photo previews.
        </TooltipContent>
      </Tooltip>
    ),
    free: <span className="font-normal text-foreground/70">20/month</span>,
    basic: <span className="font-normal text-foreground/70">100/month</span>,
    business: <span className="font-normal text-foreground/70">500/month</span>,
  },
  {
    id: '4',
    feature: <span className="font-normal text-foreground/70 ">Support</span>,
    free: <span className="font-normal text-foreground/70">Email (48h)</span>,
    basic: <span className="font-normal text-foreground/70">Live Chat</span>,
    business: (
      <span className="font-normal text-foreground/70">24/7 Priority</span>
    ),
  },
  {
    id: '5',
    feature: (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-row gap-1 items-center cursor-help">
            <span className="font-normal text-foreground/70 underline decoration-1 decoration-foreground/30 decoration-dotted underline-offset-2">
              Collaboration
            </span>
            <Info className="size-3.5 text-foreground/70" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
            Work together with your team on travel planning. Share itineraries, 
            collaborate on bookings, and manage group trips efficiently.
        </TooltipContent>
      </Tooltip>
    ),
    free: <X className="text-red-600 size-3.5" />,
    basic: <X className="text-red-600 size-3.5" />,
    business: (
      <div className="flex flex-row gap-1 items-center">
        <Check className="text-green-600 size-3.5" />
        <span className="font-normal text-foreground/70">10 Team Members</span>
      </div>
    ),
  },
  {
    id: '6',
    feature: (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-row gap-1 items-center cursor-help">
            <span className="font-normal text-foreground/70 underline decoration-1 decoration-foreground/30 decoration-dotted underline-offset-2">
              Custom AI Training
            </span>
            <Info className="size-3.5 text-foreground/70" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
            Train AI models on your specific travel preferences and company data. 
            Get personalized recommendations that match your unique requirements.
        </TooltipContent>
      </Tooltip>
    ),
    free: <X className="text-red-600 size-3.5" />,
    basic: <X className="text-red-600 size-3.5" />,
    business: <Check className="text-green-600 size-3.5" />,
  },
  {
    id: '7',
    feature: (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-row gap-1 items-center cursor-help">
            <span className=" font-normal text-foreground/70 underline decoration-1 decoration-foreground/30 decoration-dotted underline-offset-2">
              Ad-Free
            </span>
            <Info className="size-3.5 text-foreground/70" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
            Enjoy a clean, distraction-free experience without any advertisements. 
            Focus on planning your perfect trip without interruptions.
        </TooltipContent>
      </Tooltip>
    ),
    free: <X className="text-red-600 size-3.5" />,
    basic: <Check className="text-green-600 size-3.5" />,
    business: <Check className="text-green-600 size-3.5" />,
  },
  {
    id: '8',
    feature: (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-row gap-1 items-center cursor-help">
            <span className=" font-normal text-foreground/70 underline decoration-1 decoration-foreground/30 decoration-dotted underline-offset-2">
              Early Access
            </span>
            <Info className="size-3.5 text-foreground/70" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
            Get early access to new features and beta releases. Business users also get 
            voting power to influence which features we develop next.
        </TooltipContent>
      </Tooltip>
    ),
    free: <X className="text-red-600 size-3.5" />,
    basic: (
      <div className="flex flex-row gap-1 items-center">
        <Check className="text-green-600 size-3.5" />
        <span className="font-normal text-foreground/70">Beta Features</span>
      </div>
    ),
    business: (
      <div className="flex flex-row gap-1 items-center">
        <Check className="text-green-600 size-3.5" />
        <span className="font-normal text-foreground/70">+ Voting Power</span>
      </div>
    ),
  },
];
