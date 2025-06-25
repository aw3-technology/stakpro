import { CustomDrawer } from '@/components/custom/custom-drawer';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAllAccomodationDrawer } from '../../hooks/use-all-accomodation-drawer';
import { StarIcon } from '@/components/custom/icons/star-icon';
import { hotelData } from '@/temp-data/hotel-data';
import { HotelCard } from '@/components/custom/hotel-card';

export const AllAccomodationDrawer = () => {
  const [sortBy, setSortBy] = useState<'breakfast' | 'freeCancellation' | 'ShowAll'>();
  const [loadMore, setLoadMore] = useState<number>(5);

  const { open, setOpen } = useAllAccomodationDrawer();

  useEffect(() => {
    if (!open) {
      setLoadMore(5);
      setSortBy(undefined);
    }
  }, [open]);

  return (
    <CustomDrawer
      title={
        <>
          All accomodations <span className="text-muted-foreground">(34)</span>
        </>
      }
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 overflow-x-auto py-1">
          <Select defaultValue={'all'}>
            <SelectTrigger>
              Stars: <SelectValue placeholder="Select a stars" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="1">
                <StarIcon className="size-4 text-yellow-500" />
              </SelectItem>
              <SelectItem value="2">
                <StarIcon className="size-4 text-yellow-500" />
                <StarIcon className="size-4 text-yellow-500" />
              </SelectItem>
              <SelectItem value="3">
                <StarIcon className="size-4 text-yellow-500" />
                <StarIcon className="size-4 text-yellow-500" />
                <StarIcon className="size-4 text-yellow-500" />
              </SelectItem>
              <SelectItem value="4">
                <StarIcon className="size-4 text-yellow-500" />
                <StarIcon className="size-4 text-yellow-500" />
                <StarIcon className="size-4 text-yellow-500" />
                <StarIcon className="size-4 text-yellow-500" />
              </SelectItem>
              <SelectItem value="5">
                <StarIcon className="size-4 text-yellow-500" />
                <StarIcon className="size-4 text-yellow-500" />
                <StarIcon className="size-4 text-yellow-500" />
                <StarIcon className="size-4 text-yellow-500" />
                <StarIcon className="size-4 text-yellow-500" />
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setSortBy('breakfast')}
            variant={sortBy === 'breakfast' ? 'default' : 'outline'}
          >
            {sortBy === 'breakfast' && <CheckIcon className="size-4" />}
            Breakfast included (25)
          </Button>
          <Button
            onClick={() => setSortBy('freeCancellation')}
            variant={sortBy === 'freeCancellation' ? 'default' : 'outline'}
          >
            {sortBy === 'freeCancellation' && <CheckIcon className="size-4" />}
            Free cancellation (18)
          </Button>
          <Button
            onClick={() => setSortBy('ShowAll')}
            variant={sortBy === 'ShowAll' ? 'default' : 'outline'}
          >
            {sortBy === 'ShowAll' && <CheckIcon className="size-4" />}
            Show all
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {hotelData.map((hotel, index) => (
            <HotelCard key={index} data={hotel} />
          ))}
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="px-4 h-8.5 text-sm text-foreground/70"
              onClick={() => setLoadMore(loadMore + 5)}
            >
              Load More
            </Button>
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
};
