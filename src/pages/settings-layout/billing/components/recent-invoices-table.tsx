import { Tag } from '@/components/custom/tag';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, Download, Info, X } from 'lucide-react';

export const RecentInvoicesTable = () => {
  return (
    <div className='border-1 border-border rounded-md'>
      <Table>
        <TableHeader>
          <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Invoice</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentInvoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.amount}</TableCell>
            <TableCell>{invoice.date}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.invoice}</TableCell>
          </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const recentInvoices = [
  {
    id: '1',
    amount: <span className="font-normal text-foreground/70">$9.00</span>,
    date: <span className="font-normal text-foreground/70">24th Feb 2025</span>,
    status: (
      <div className="flex flex-row gap-1 items-center">
        <Tag small className="bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100 rounded w-fit px-1">
          <div className="flex flex-row gap-1 items-center">
            <X className="size-3.5" />
            <span className="text-xs">Rejected</span>
          </div>
        </Tag>
        <Info className="size-3.5 text-foreground/60" />
      </div>
    ),
    invoice: (
      <span className=" font-normal text-foreground/70">2044100-22</span>
    ),
  },
  {
    id: '2',
    amount: <span className="font-normal text-foreground/70">$9.00</span>,
    date: <span className="font-normal text-foreground/70">24th Feb 2025</span>,
    status: (
      <div className="flex flex-row gap-1 items-center">
        <Tag small className="bg-emerald-900 text-emerald-100 dark:bg-emerald-950 dark:text-emerald-100 rounded-md w-fit">
          <div className="flex flex-row gap-1 items-center">
            <Check className="size-3.5" />
            <span className="text-xs">Paid</span>
          </div>
        </Tag>
        <Download className="size-3.5 text-foreground/60" />
      </div>
    ),
    invoice: (
      <span className=" font-normal text-foreground/70">4092122-04</span>
    ),
  },
  {
    id: '3',
    amount: <span className="font-normal text-foreground/70">$9.00</span>,
    date: <span className="font-normal text-foreground/70">24th Feb 2025</span>,
    status: (
      <div className="flex flex-row gap-1 items-center">
        <Tag small className="bg-emerald-900 text-emerald-100 dark:bg-emerald-950 dark:text-emerald-100 rounded-md w-fit">
          <div className="flex flex-row gap-1 items-center">
            <Check className="size-3.5" />
            <span className="text-xs">Paid</span>
          </div>
        </Tag>
        <Download className="size-3.5 text-foreground/60" />
      </div>
    ),
    invoice: (
      <span className=" font-normal text-foreground/70">3341200-42</span>
    ),
  },
];
