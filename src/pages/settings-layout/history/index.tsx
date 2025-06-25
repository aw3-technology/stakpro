import { ContentHeader } from '@/components/custom/content-header';
import { Button } from '@/components/ui/button';
import { Ellipsis, Trash2 } from 'lucide-react';

export const History = () => {
  return (
    <>
      <ContentHeader
        title="History"
        description="Review past AI-generated itineraries and edits"
      />
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-8 bg-card-solid rounded-2xl px-4 py-4">
          <div className="flex flex-col gap-3">
            <span className="text-base font-medium text-foreground leading-5 px-2">
              Yesterday
            </span>
            <div className="group">
              <div className="flex flex-row gap-2 justify-between items-center p-2 rounded-md group-hover:bg-card-solid transition-all">
                <span className="text-sm text-foreground/60 leading-5">
                  Plan a week-long trip to Paris with iconic landmarks and local
                  cuisine.
                </span>
                  <Ellipsis className="size-4 hidden group-hover:flex transition-all cursor-pointer" />
              </div>
            </div>
            <div className="group">
              <div className="flex flex-row gap-2 justify-between items-center p-2 rounded-md group-hover:bg-card-solid  transition-all">
                <span className="text-sm text-foreground/60 leading-5">
                  Create a California road trip with coastal drives and hidden
                  gems.
                </span>
                <Ellipsis className="size-4 hidden group-hover:flex transition-all cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-base font-medium text-foreground leading-5 px-2">
              Previous 7 Days
            </span>
            <div className="group">
              <div className="flex flex-row gap-2 justify-between items-center p-2 rounded-md group-hover:bg-card-solid  transition-all">
                <span className="text-sm text-foreground/60 leading-5">
                  Arrange a Bali beach escape with resort relaxation.
                </span>
                <Ellipsis className="size-4 hidden group-hover:flex transition-all cursor-pointer" />
              </div>
            </div>
            <div className="group">
              <div className="flex flex-row gap-2 justify-between items-center p-2 rounded-md group-hover:bg-card-solid  transition-all">
                <span className="text-sm text-foreground/60 leading-5">
                  Organize an Iceland adventure with scenic hikes and natural
                </span>
                <Ellipsis className="size-4 hidden group-hover:flex transition-all cursor-pointer" />
              </div>
            </div>
            <div className="group">
              <div className="flex flex-row gap-2 justify-between items-center p-2 rounded-md group-hover:bg-card-solid  transition-all ">
                <span className="text-sm text-foreground/60 leading-5">
                  Create a California road trip with coastal drives and hidden
                  gems.
                </span>
                <Ellipsis className="size-4 hidden group-hover:flex transition-all" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-base font-medium text-foreground leading-5 px-2">
              Previous 30 Days
            </span>
            <div className="group">
              <div className="flex flex-row gap-2 justify-between items-center p-2 rounded-md group-hover:bg-card-solid  transition-all ">
                <span className="text-sm text-foreground/60 leading-5">
                  Design a 5-day Tokyo tour featuring modern and traditional
                  culture.
                </span>
                <Ellipsis className="size-4 hidden group-hover:flex transition-all" />
              </div>
            </div>
            <div className="group">
              <div className="flex flex-row gap-2 justify-between items-center p-2 rounded-md group-hover:bg-card-solid  transition-all ">
                <span className="text-sm text-foreground/60 leading-5">
                  Organize an Iceland adventure with scenic hikes and natural
                  wonders.
                </span>
                <Ellipsis className="size-4 hidden group-hover:flex transition-all cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <Button variant="outline" className="text-foreground/70">
            <Trash2 className="size-3.5" />
            Clear History
          </Button>
        </div>
      </div>
    </>
  );
};
