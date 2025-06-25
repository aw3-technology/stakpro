/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '../ui/carousel';
import { useEffect, useState } from 'react';
import { FavoriteIcon } from './favorite-icon';
import { StarIcon } from './icons/star-icon';
import { ArrowUpRight, BadgePercentIcon, MapPin } from 'lucide-react';
import { Tag } from './tag';
import { Button } from '../ui/button';
import { BookingIcon } from './icons/booking-icon';

export const HotelCard = ({
  className,
  data,
}: {
  className?: string;
  data: any;
}) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (api) {
      api.on('select', () => {
        setCurrent(api.selectedScrollSnap());
      });
    }
  }, [api]);

  return (
    <div className="flex flex-col items-end w-full h-full gap-2">
      <div
        className={cn(
          'bg-card flex flex-col md:flex-row text-foreground justify-between w-full rounded-2xl overflow-hidden',
          className
        )}
      >
        <Carousel setApi={setApi} className="w-full md:max-w-[212px]">
          <div
            onClick={() => setIsFavorite((prev) => !prev)}
            className={
              'absolute top-2 right-2 z-10 w-[30px] cursor-pointer hover:opacity-80 transition-opacity duration-300'
            }
          >
            <FavoriteIcon
              className={
                isFavorite ? 'fill-rose-500' : 'fill-foreground-light-solid/40'
              }
            />
          </div>
          <CarouselContent>
            {data?.images?.map((image: string, index: number) => (
              <CarouselItem key={index} className="user-select-none overflow-hidden p-0">
                <img
                  src={image}
                  alt="Hotel"
                  className="object-cover w-full aspect-square h-[212px] md:h-full"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 ">
            {data?.images?.map((_: string, idx: number) => (
              <span
                key={idx}
                className={`w-[6px] h-[6px] rounded-full ${
                  current === idx ? 'bg-white' : 'bg-white/40'
                }`}
                style={{ display: 'inline-block' }}
              />
            ))}
          </div>
        </Carousel>

        <div className="flex flex-col md:flex-row w-full  justify-between p-4 gap-3">
          <div className="flex flex-col gap-2 flex-3/4 items-start">
            <div className="flex flex-col md:flex-row-reverse gap-1 items-start md:items-center">
              <div className="flex">
                {Array.from({ length: data?.stars }).map((_, index) => (
                  <StarIcon key={index} className="size-4 text-yellow-500" />
                ))}
              </div>
              <p className="font-medium text-foreground">{data?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="bg-review-card rounded-md py-1 px-2 text-sm text-foreground-light-solid">
                {`${data?.rating?.value}/${data?.rating?.count}`}
              </Tag>
              <span className="text-sm font-bold text-foreground/70">
                Very Good
              </span>
              <p className="text-sm text-foreground/40">
                {data?.reviews} reviews
              </p>
            </div>
            <div className="flex items-center gap-2 py-1">
              <MapPin className="w-4 h-4 text-foreground/50" />
              <p className="text-sm text-foreground/50">{data?.location}</p>
            </div>
            <div className="flex gap-2 py-2 flex-col items-start">
              <span className="text-foreground/60">
                {data?.roomType.join(' or ')}
              </span>

              <span className="text-sm text-foreground/60">
                {`Breakfast included • `}
                {data?.freeCancellation && (
                  <span className="text-green-500">Free cancellation</span>
                )}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 flex-1/4 md:items-end">
            <div className="flex">
              <Tag className="bg-fuchsia-200 dark:bg-fuchsia-900 text-sm">
                <div className="flex gap-1 items-center">
                  <BadgePercentIcon className="w-[14px] h-[14px]  text-fuchsia-900 dark:text-fuchsia-100" />
                  <span className="text-xs text-fuchsia-900 dark:text-fuchsia-100">
                    {`${data?.price?.discountType}`}
                  </span>
                </div>
              </Tag>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="text-sm text-foreground/60">
                  {`${data?.price?.currency}${data?.price?.amount}`}
                </span>
                <span className="text-4xl text-foreground/60">
                  {`${data?.price?.currency}${data?.price?.discountedAmount}`}
                </span>
              </div>
              <span className="text-sm text-foreground/60">
                {`Total price: ${data?.price?.currency}${data?.price?.totalPrice}`}
              </span>
            </div>
            <Button className="w-full">
              Check Availability <ArrowUpRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <BookingIcon />
        <span className="text-xs text-foreground/40">
          Powered by Booking.com
        </span>
      </div>
    </div>
  );
};
