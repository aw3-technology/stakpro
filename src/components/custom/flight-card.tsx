import { cn } from '@/lib/utils';
import { FlightModel } from '@/temp-data/flight-data';
import { PlaneIcon } from 'lucide-react';
import { SkyscannerIcon } from './icons/skyscanner-icon';

export const FlightCard = ({
  className,
  classNameInner,
  data,
}: {
  className?: string;
  classNameInner?: string;
  data: FlightModel;
}) => {
  return (
    <div className="flex flex-col items-end w-full gap-2">
      <div
        className={cn(
          'bg-card flex flex-col p-0.5 rounded-2xl text-white justify-between items-center w-full',
          className
        )}
      >
        <div className="flex items-center gap-4 h-11 px-4 justify-between w-full">
          <div className="flex items-center gap-2">
            <img
              src={data?.airline?.logo}
              alt={data?.airline?.name}
              className="w-12 object-fit"
            />
            {data?.airline?.shortName && (
              <span className="text-foreground/40 text-xs">
                {data?.airline?.shortName}
              </span>
            )}
          </div>
          <span className="text-foreground/40 text-lg font-semibold text-right">
            {data?.price?.currency}
            {data?.price?.amount}
          </span>
        </div>

        <div
          className={cn(
            'flex-1 bg-card-inner flex justify-between p-4 items-center rounded-2xl w-full',
            classNameInner
          )}
        >
          <div className="flex flex-col gap-2 ">
            <span className="text-sm text-foreground/60">
              {data?.departure?.city}
            </span>
            <span className="text-lg font-bold text-foreground/60">
              {data?.departure?.code}
            </span>
            <span className="text-sm text-foreground/60">
              {data?.departure?.date} - {data?.departure?.time}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-foreground/60">{data?.duration}</span>
            <PlaneIcon
              className="w-4 h-4 text-foreground/60"
              fill="currentColor"
            />
            <span className="text-sm text-foreground/60">
              {data?.numberOfStops ? `${data?.numberOfStops} stop` : 'Direct'}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm text-foreground/60">
              {data?.arrival?.city}
            </span>
            <span className="text-lg font-bold text-foreground/60">
              {data?.arrival?.code}
            </span>
            <span className="text-sm text-foreground/60">
              {data?.arrival?.date} - {data?.arrival?.time}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SkyscannerIcon className="w-4 h-4 text-foreground/40" />
        <span className="text-xs text-foreground/40">
          Powered by Skyscanner
        </span>
      </div>
    </div>
  );
};
