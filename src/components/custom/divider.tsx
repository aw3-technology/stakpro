import { cn } from '@/lib/utils';

interface DividerProps {
  className?: string;
  size?: 'none' | 'xsmall' | 'small' | 'large' | 'middle';
}

export const Divider = ({ className, size = 'none' }: DividerProps) => {
  return (
    <div
      className={cn('w-full', className, {
        'py-0': size === 'none',
        'py-1': size === 'xsmall',
        'py-2': size === 'small',
        'py-4': size === 'middle',
        'py-6': size === 'large',
      })}
    >
      <div className="h-[1px] bg-border" />
    </div>
  );
};
