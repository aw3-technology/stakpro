import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
type ModalFooterProps = {
  cancelButtonProps?: React.ComponentProps<typeof Button>;
  cancelButtonText?: string;
  onCancel?: () => void;
  cancelButtonIcon?: React.ReactNode | IconName;
  okayButtonProps?: React.ComponentProps<typeof Button> & {
    type?: 'button' | 'submit' | 'reset';
    text?: string;
    icon?: React.ReactNode | IconName;
    onClick?: () => void;
    loading?: boolean;
  };
};

type ModalProps = {
  size?: 'small' | 'default' | 'large' | 'xlarge';
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footerProps?: ModalFooterProps;
  className?: string;
};

export const Modal = ({
  open,
  setOpen,
  title,
  description,
  children,
  footerProps,
  className,
  size = 'large',
}: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen} modal={true}>
      <DialogContent
        className={cn(
          'flex flex-col gap-0 p-4 max-h-[80vh] sm:max-w-lg bg-background-elevated shadow-lg border-border [&>button:last-child]:top-3.5',
          size === 'small' && 'sm:max-w-sm',
          size === 'default' && 'sm:max-w-md',
          size === 'large' && 'sm:max-w-lg',
          size === 'xlarge' && 'sm:max-w-xl',
          className
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto py-4">{children}</div>
        {footerProps && (
          <DialogFooter className="border-t pt-4">
            {footerProps?.cancelButtonProps ? (
              <Button
                type="button"
                variant="outline"
                onClick={footerProps.onCancel}
                {...footerProps.cancelButtonProps}
              >
                {footerProps.cancelButtonText}
              </Button>
            ) : (
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
            )}
            {footerProps?.okayButtonProps && (
              <Button
                onClick={footerProps?.okayButtonProps?.onClick}
                {...footerProps?.okayButtonProps}
              >
                {footerProps?.okayButtonProps?.loading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <>
                    {typeof footerProps?.okayButtonProps?.icon === 'string' ? (
                      <DynamicIcon
                        name={footerProps?.okayButtonProps?.icon as IconName}
                        className="size-3.5"
                      />
                    ) : footerProps?.okayButtonProps?.icon ? (
                      footerProps.okayButtonProps.icon
                    ) : null}
                  </>
                )}
                {footerProps?.okayButtonProps?.text}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
