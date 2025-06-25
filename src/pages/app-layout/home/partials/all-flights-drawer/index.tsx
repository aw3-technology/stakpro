import { CustomDrawer } from '@/components/custom/custom-drawer';
import { FlightCard } from '@/components/custom/flight-card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { flightData } from '@/temp-data/flight-data';
import { CheckIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAllFlightsDrawer } from '../../hooks/use-all-flights-drawer';

export const AllFlightsDrawer = () => {
  const [sortBy, setSortBy] = useState<'best' | 'cheapest' | 'fastest'>('best');
  const [loadMore, setLoadMore] = useState<number>(5);

  const { open, setOpen } = useAllFlightsDrawer();

  useEffect(() => {
    if (!open) {
      setLoadMore(5);
    }
  }, [open]);

  return (
    <CustomDrawer
      title={
        <>
          All flights <span className="text-muted-foreground">(24)</span>
        </>
      }
      open={open}
      onOpenChange={setOpen}

    >
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 sticky top-0 bg-layout z-10 pb-4">
          <Select defaultValue={'1'}>
            <SelectTrigger>
              Stops: <SelectValue placeholder="Select a stops" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Direct</SelectItem>
              <SelectItem value="2">1 stop</SelectItem>
              <SelectItem value="3">2 stops</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue={'1'}>
            <SelectTrigger>
              Airlines: <SelectValue placeholder="Select a airlines" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">All</SelectItem>
              <SelectItem value="2">American Airlines</SelectItem>
              <SelectItem value="3">Swiss</SelectItem>
              <SelectItem value="5">THY</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setSortBy('best')}
            variant={sortBy === 'best' ? 'default' : 'outline'}
          >
            {sortBy === 'best' && <CheckIcon className="size-4" />}
            Best
          </Button>
          <Button
            onClick={() => setSortBy('cheapest')}
            variant={sortBy === 'cheapest' ? 'default' : 'outline'}
          >
            {sortBy === 'cheapest' && <CheckIcon className="size-4" />}
            Cheapest
          </Button>
          <Button
            onClick={() => setSortBy('fastest')}
            variant={sortBy === 'fastest' ? 'default' : 'outline'}
          >
            {sortBy === 'fastest' && <CheckIcon className="size-4" />}
            Fastest
          </Button>
        </div>
        <div className="flex flex-col gap-5 ">
          {flightData.slice(0, loadMore).map((flight, index) => (
            <FlightCard
              key={index}
              data={flight}
            />
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
