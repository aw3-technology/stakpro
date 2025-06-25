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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Circle,
  CircleCheck,
  CircleDashed,
  Download,
} from 'lucide-react';

export const Payouts = () => {
  return (
    <>
      <ContentHeader
        title="Payouts"
        description="Earnings ready to transfer – no hidden fees"
        extra={
          <Button className="text-primary-foreground font-medium leading-5 text-sm rounded-full">
            Withdraw $287
          </Button>
        }
      />
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-base font-medium leading-5 text-foreground/60">
            Payout Summary
          </span>
          <div className="flex gap-4 overflow-x-auto w-full">
            <CustomCard className='w-full min-w-[220px]'>
              <span className="text-sm font-normal text-foreground/50 leading-5">
                Available Now
              </span>
              <div className="flex gap-2 items-center">
                <CircleDashed className="size-4 text-success" />
                <span className="text-lg font-semibold text-foreground/70 leading-6">
                  $287
                </span>
              </div>
            </CustomCard>
            <CustomCard className='w-full min-w-[220px]'>
              <span className="text-sm font-normal text-foreground/50 leading-5">
                Pending
              </span>
              <div className="flex gap-2 items-center">
                <Circle className="size-4 text-warning" />
                <span className="text-lg font-semibold text-foreground/70 leading-6">
                  $0
                </span>
              </div>
            </CustomCard>
            <CustomCard className='w-full min-w-[220px]'>
              <span className="text-sm font-normal text-foreground/50 leading-5">
                Minimum Threshold
              </span>
              <div className="flex gap-2 items-center">
                <CircleCheck className="size-4 text-success" />
                <span className="text-lg font-semibold text-foreground/70 leading-6">
                  $50
                </span>
              </div>
            </CustomCard>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-base font-medium leading-5 text-foreground/60">
            Payout History
          </span>
          <div className="border-1 border-border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-sm font-normal text-foreground/50">
                    Period
                  </TableHead>
                  <TableHead className="text-sm font-normal text-foreground/50">
                    Status
                  </TableHead>
                  <TableHead className="text-sm font-normal text-foreground/50">
                    Amount
                  </TableHead>
                  <TableHead colSpan={2} className="text-sm font-normal text-foreground/50">
                    Method
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payoutHistory.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.period}</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{invoice.method}</TableCell>
                    <TableCell>{invoice.action}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      <div className="flex flex-col gap-4 pt-12 items-center">
        <span className="text-lg font-medium leading-6 text-foreground">
          Payout FAQ
        </span>
        <div className="flex max-w-[480px] w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                When will my withdrawal arrive?
              </AccordionTrigger>
              <AccordionContent className="text-foreground/60 text-sm font-normal leading-5">
                PayPal = instant, Bank = 3-5 days.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                Why is my money "pending"?
              </AccordionTrigger>
              <AccordionContent></AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                Which method has lowest fees?
              </AccordionTrigger>
              <AccordionContent></AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                Can I split payments?
              </AccordionTrigger>
              <AccordionContent></AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                Why can't I withdraw?
              </AccordionTrigger>
              <AccordionContent></AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger className="text-foreground/70 text-base font-normal leading-5">
                Is there a yearly maximum?
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

const payoutHistory = [
  {
    id: '1',
    period: (
      <span className="text-sm font-normal text-foreground/70">Apr 5,2025</span>
    ),
    status: (
      <Tag small className="bg-emerald-900 text-emerald-100 rounded-md w-fit">
        <span className="text-xs">Completed</span>
      </Tag>
    ),
    amount: (
      <span className="text-sm font-normal text-foreground/70">$124.50</span>
    ),
    method: (
      <span className="text-sm font-normal text-foreground/70">PayPal</span>
    ),
    action: <Download className="size-4 text-foreground/50 cursor-pointer" />,
  },
  {
    id: '2',
    period: (
      <span className="text-sm font-normal text-foreground/70">Mar 5,2025</span>
    ),
    status: (
      <Tag small className="bg-yellow-900 text-yellow-100 rounded-md w-fit">
        <span className="text-xs">Pending</span>
      </Tag>
    ),
    amount: (
      <span className="text-sm font-normal text-foreground/70">$133.50</span>
    ),
    method: (
      <span className="text-sm font-normal text-foreground/70">PayPal</span>
    ),
    action: <Download className="size-4 text-foreground/50 cursor-pointer" />,
  },
  {
    id: '3',
    period: (
      <span className="text-sm font-normal text-foreground/70">Feb 5,2025</span>
    ),
    status: (
      <Tag small className="bg-emerald-900 text-emerald-100 rounded-md w-fit">
        <span className="text-xs">Completed</span>
      </Tag>
    ),
    amount: (
      <span className="text-sm font-normal text-foreground/70">$56.24</span>
    ),
    method: (
      <span className="text-sm font-normal text-foreground/70">
        Bank Transfer
      </span>
    ),
    action: <Download className="size-4 text-foreground/50 cursor-pointer" />,
  },
];
