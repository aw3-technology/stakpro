import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';

interface CustomDrawerProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  footer?: React.ReactNode;
}

export const CustomDrawer = ({
  title,
  description,
  children,
  open,
  onOpenChange,
  footer,
}: CustomDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn(
          'p-2 border-none shadow-none items-center h-full w-full lg:max-w-[704px] pointer-events-auto'
        )}
        side={matchMedia('(max-width: 768px)').matches ? 'bottom' : 'right'}
      >
        <div
          className={cn(
            'bg-layout rounded-2xl shadow-shadow-24 h-full w-full p-6 flex flex-col'
          )}
        >
          <SheetHeader>
            <SheetTitle className="text-base font-medium leading-5">
              {title}
            </SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pb-4">{children}</div>

          {footer && (
            <SheetFooter className='pt-4 border-t-1'>{footer}</SheetFooter>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
