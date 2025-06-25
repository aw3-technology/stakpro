import { ContentHeader } from '@/components/custom/content-header';
import { CustomCard } from '@/components/custom/custom-card';
import { Tag } from '@/components/custom/tag';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  Check,
  CheckIcon,
  CopyIcon,
  Instagram,
  Loader,
  TrendingDown,
  TrendingUp,
  Twitter,
} from 'lucide-react';
import { useId, useRef, useState } from 'react';

export const AffiliateProgram = () => {
  const inviteLinkId = useId();
  const inviteCodeId = useId();

  const [inviteLinkCopied, setInviteLinkCopied] = useState<boolean>(false);
  const [inviteCodeCopied, setInviteCodeCopied] = useState<boolean>(false);
  const inviteLinkInputRef = useRef<HTMLInputElement>(null);
  const inviteCodeInputRef = useRef<HTMLInputElement>(null);

  const handleInviteLinkCopy = () => {
    if (inviteLinkInputRef.current) {
      navigator.clipboard.writeText(inviteLinkInputRef.current.value);
      setInviteLinkCopied(true);
      setTimeout(() => setInviteLinkCopied(false), 1500);
    }
  };

  const handleInviteCodeCopy = () => {
    if (inviteCodeInputRef.current) {
      navigator.clipboard.writeText(inviteCodeInputRef.current.value);
      setInviteCodeCopied(true);
      setTimeout(() => setInviteCodeCopied(false), 1500);
    }
  };

  return (
    <>
      <ContentHeader
        title="Affiliate Program"
        description="Earn 20% commission on every referral"
        extra={
          <Button className="text-primary-foreground font-medium leading-5 text-sm rounded-full">
            Withdraw $292
          </Button>
        }
      />
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium leading-5 text-foreground/60">
              Live Performance
            </span>
            <Select defaultValue="today">
              <SelectTrigger
                size="sm"
                className="border-none shadow-none bg cursor-pointer text-sm text-foreground/60 dark:dark:bg-transparent dark:dark:hover:bg-transparent"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row gap-4">
            <CustomCard>
              <span className="text-sm font-normal text-foreground/50 leading-5">
                Clicks
              </span>
              <div className="flex gap-1 items-center">
                <TrendingUp className="size-4 text-success" />
                <span className="text-lg font-semibold text-foreground/70 leading-6">
                  24
                </span>
              </div>
            </CustomCard>
            <CustomCard>
              <span className="text-sm font-normal text-foreground/50 leading-5">
                Signups
              </span>
              <div className="flex gap-1 items-center">
                <TrendingDown className="size-4 text-destructive" />
                <span className="text-lg font-semibold text-foreground/70 leading-6">
                  3
                </span>
              </div>
            </CustomCard>
            <CustomCard>
              <span className="text-sm font-normal text-foreground/50 leading-5">
                Earnings
              </span>
              <div className="flex gap-1 items-center">
                <TrendingUp className="size-4 text-success" />
                <span className="text-lg font-semibold text-foreground/70 leading-6">
                  $7.20
                </span>
              </div>
            </CustomCard>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-base font-medium leading-5 text-foreground/60">
            My Referrals
          </span>
          <div className="border-1 border-border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm font-normal text-foreground/50">
                    Date
                  </TableHead>
                  <TableHead className="text-sm font-normal text-foreground/50">
                    User
                  </TableHead>
                  <TableHead className="text-sm font-normal text-foreground/50">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myReferrals.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.user}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Share */}
        <CustomCard>
          <span className="font-medium text-foreground leading-5">Share</span>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor={inviteLinkId}
                  className="text-sm font-normal text-foreground"
                >
                  Invite Link
                </Label>
                <div className="relative">
                  <Input
                    ref={inviteLinkInputRef}
                    id={inviteLinkId}
                    className="pe-9"
                    type="text"
                    defaultValue="https://travelplanner.io/ref/944122"
                    readOnly
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleInviteLinkCopy}
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
                        aria-label={
                          inviteLinkCopied ? 'Copied' : 'Copy to clipboard'
                        }
                        disabled={inviteLinkCopied}
                      >
                        <div
                          className={cn(
                            'transition-all',
                            inviteLinkCopied
                              ? 'scale-100 opacity-100'
                              : 'scale-0 opacity-0'
                          )}
                        >
                          <CheckIcon
                            className="stroke-emerald-500"
                            size={16}
                            aria-hidden="true"
                          />
                        </div>
                        <div
                          className={cn(
                            'absolute transition-all',
                            inviteLinkCopied
                              ? 'scale-0 opacity-0'
                              : 'scale-100 opacity-100'
                          )}
                        >
                          <CopyIcon size={16} aria-hidden="true" />
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="px-2 py-1 text-xs">
                      Copy to clipboard
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="*:not-first:mt-2">
                <Label
                  htmlFor={inviteCodeId}
                  className="text-sm font-normal text-foreground"
                >
                  Invite Code
                </Label>
                <div className="relative">
                  <Input
                    ref={inviteCodeInputRef}
                    id={inviteCodeId}
                    className="pe-9"
                    type="text"
                    defaultValue="BTSD13J"
                    readOnly
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleInviteCodeCopy}
                        className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
                        aria-label={
                          inviteCodeCopied ? 'Copied' : 'Copy to clipboard'
                        }
                        disabled={inviteCodeCopied}
                      >
                        <div
                          className={cn(
                            'transition-all',
                            inviteCodeCopied
                              ? 'scale-100 opacity-100'
                              : 'scale-0 opacity-0'
                          )}
                        >
                          <CheckIcon
                            className="stroke-emerald-500"
                            size={16}
                            aria-hidden="true"
                          />
                        </div>
                        <div
                          className={cn(
                            'absolute transition-all',
                            inviteCodeCopied
                              ? 'scale-0 opacity-0'
                              : 'scale-100 opacity-100'
                          )}
                        >
                          <CopyIcon size={16} aria-hidden="true" />
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="px-2 py-1 text-xs">
                      Copy to clipboard
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </CustomCard>
        {/* Missions */}
        <CustomCard>
          <span className="font-medium text-foreground leading-5">
            Missions
          </span>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex gap-3 flex-1">
              <Instagram className="size-5 text-foreground/70" />
              <div className="flex flex-col gap-1 flex-grow">
                <span className="text-sm font-normal text-foreground/70">
                  Follow us on Instagram
                </span>
                <span className="text-sm font-normal text-foreground/70">
                  Claim $5
                </span>
              </div>
              <Button
                size="sm"
                className="text-sm rounded-full font-normal text-foreground/70"
              >
                Claim
              </Button>
            </div>
            <div className="flex gap-3 flex-1">
              <Twitter className="size-5 text-foreground/70" />
              <div className="flex flex-col gap-1 flex-grow">
                <span className="text-sm font-normal text-foreground/70">
                  Follow us on Twitter
                </span>
                <span className="flex items-center gap-1 text-sm font-normal text-foreground/70">
                  <Check className="size-3 text-emerald-500" /> $5
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-sm rounded-full font-normal text-foreground/70"
              >
                Claimed
              </Button>
            </div>
          </div>
        </CustomCard>
        <div className="flex flex-col gap-4 pt-12 items-center">
          <span className="text-lg font-medium leading-6 text-foreground">
            Affiliate Program FAQ
          </span>
          <div className="flex max-w-[480px] w-full">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  How often can I withdraw earnings?
                </AccordionTrigger>
                <AccordionContent className="text-foreground/60 text-sm font-normal leading-5">
                  Monthly (processed every 5th) or when you hit $50+.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  Why is my payout "Pending"?
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
                  Do cookie-less referrals count?
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  Why do my clicks/signups not match?
                </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                  Can I see who signed up?
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

const myReferrals = [
  {
    id: '1',
    date: (
      <span className="text-sm font-normal text-foreground/70">
        23 May 2025
      </span>
    ),
    user: (
      <span className="text-sm font-normal text-foreground/70">
        U2iidkmkk24
      </span>
    ),
    status: (
      <Tag small className="bg-emerald-900 text-emerald-100 rounded-md w-fit">
        <div className="flex flex-row gap-1 items-center">
          <Check className="size-2.5" />
          <span className="text-xs">Paid</span>
        </div>
      </Tag>
    ),
  },
  {
    id: '2',
    date: (
      <span className="text-sm font-normal text-foreground/70">
        12 May 2025
      </span>
    ),
    user: (
      <span className="text-sm font-normal text-foreground/70">
        Udklamdkd11
      </span>
    ),
    status: (
      <Tag small className="bg-yellow-900 text-yellow-100 rounded-md w-fit">
        <div className="flex flex-row gap-1 items-center">
          <Loader className="size-2.5" />
          <span className="text-xs">Pending</span>
        </div>
      </Tag>
    ),
  },
  {
    id: '3',
    date: (
      <span className="text-sm font-normal text-foreground/70">
        04 Apr 2025
      </span>
    ),
    user: (
      <span className="text-sm font-normal text-foreground/70">
        Uskklolld49
      </span>
    ),
    status: (
      <Tag small className="bg-emerald-900 text-emerald-100 rounded-md w-fit">
        <div className="flex flex-row gap-1 items-center">
          <Check className="size-2.5" />
          <span className="text-xs">Paid</span>
        </div>
      </Tag>
    ),
    invoice: (
      <span className=" font-normal text-foreground/70">3341200-42</span>
    ),
  },
];
