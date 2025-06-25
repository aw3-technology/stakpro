import { AppLayoutContent } from '@/components/custom/app-layout-content';
import { ExploreContentCard } from '@/components/custom/explore-content-card';
import { InformationHeader } from '@/components/custom/information-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronRightIcon, EarthIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export const Explore = () => {
  const [loadMore, setLoadMore] = useState(false);
  return (
    <AppLayoutContent
      title={
        <h1 className="font-medium leading-8">
          Get Inspired by Fellow Travelers
        </h1>
      }
      description={
        <p className="text-foreground/70 leading-5">
          Browse 10,000+ crowd-sourced itineraries – steal, save, or remix!
        </p>
      }
    >
      <InformationHeader
        className="text-sm"
        title={
          <span className="text-base font-medium text-foreground/60 leading-5">
            This Week's Most-Loved Plans
          </span>
        }
        extra={
          <Link
            to=""
            className="text-foreground/60 text-sm flex items-center gap-1"
          >
            See all
            <ChevronRightIcon className="size-4" />
          </Link>
        }
      />
      <ExploreContentCard
        coverImageUrl="/images/barcelona-cathedral.jpg"
        coverImageAlt="Barcelona Cathedral"
        title="Barcelona in 4 Days"
        description="By @WanderlustSarah | 1.2K saves"
        tags={[
          {
            text: '#Barcelona',
            bgColor: 'bg-fuchsia-100',
            darkBgColor: 'dark:bg-fuchsia-900',
            textColor: 'text-fuchsia-900',
            darkTextColor: 'dark:text-fuchsia-100',
          },
          {
            text: '#Tapas',
            bgColor: 'bg-indigo-100',
            darkBgColor: 'dark:bg-indigo-900',
            textColor: 'text-indigo-900',
            darkTextColor: 'dark:text-indigo-100',
          },
          {
            text: '#Budget',
            bgColor: 'bg-emerald-100',
            darkBgColor: 'dark:bg-emerald-900',
            textColor: 'text-emerald-900',
            darkTextColor: 'dark:text-emerald-100',
          },
        ]}
        footer={
          <div className="flex items-center gap-2">
            <EarthIcon className="size-4 text-foreground/50" />
            <span className="text-sm text-foreground/50 leading-5 font-normal">
              Montserrat hike → Gothic Quarter bike tour → Flamenco night
            </span>
          </div>
        }
      />
      <div className="flex flex-col gap-4">
        <InformationHeader
          title={
            <span className="text-base font-medium text-foreground/60 leading-5">
              Find your perfect template
            </span>
          }
        />
        <div className="flex flex-wrap gap-4">
          <div className="*:not-first:mt-2 grow sm:grow-0 sm:basis-1/2">
            <div className="relative">
              <Input
                className="peer ps-10 pe-4 w-full border border-input shadow-sm shadow-shadow-2"
                placeholder="Try 'Bali with kids' or 'Solo Europe'"
                type="search"
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <SearchIcon className="size-4" />
              </div>
            </div>
          </div>
          <Select defaultValue="trip-type">
            <SelectTrigger className="border border-input shadow-sm shadow-shadow-2 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trip-type">Trip Type</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="duration">
            <SelectTrigger className="border border-input shadow-sm shadow-shadow-2 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="duration">Duration</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="budget">
            <SelectTrigger className="border border-input shadow-sm shadow-shadow-2 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget">Budget</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ExploreContentCard
          coverImageUrl="/images/kyoto.jpg"
          coverImageAlt="kyoto"
          title="Kyoto in 5 Days"
          description="By @ZenTraveler | 2.4K saves"
          tags={[
            {
              text: '#Temples',
              bgColor: 'bg-emerald-100',
              darkBgColor: 'dark:bg-emerald-900',
              textColor: 'text-emerald-900',
              darkTextColor: 'dark:text-emerald-100',
            },
            {
              text: '#CherryBlossoms',
              bgColor: 'bg-indigo-100',
              darkBgColor: 'dark:bg-indigo-900',
              textColor: 'text-indigo-900',
              darkTextColor: 'dark:text-indigo-100',
            },
            {
              text: '#Cultural',
              bgColor: 'bg-lime-100',
              darkBgColor: 'dark:bg-lime-900',
              textColor: 'text-lime-900',
              darkTextColor: 'dark:text-lime-100',
            },
          ]}
          footer={
            <div className="flex items-start gap-2">
              <EarthIcon className="size-4 text-foreground/50" />
              <span className="text-sm text-foreground/50 leading-5 font-normal">
                Fushimi Inari sunrise → Bamboo Forest → Tea ceremony → Gion
                night walk
              </span>
            </div>
          }
        />
        <ExploreContentCard
          coverImageUrl="/images/zanzibar.jpg"
          coverImageAlt="zanzibar"
          title="Safari & Zanzibar Combo"
          description="By @WildlifeChase | 892 saves"
          tags={[
            {
              text: '#Luxury',
              bgColor: 'bg-lime-100',
              darkBgColor: 'dark:bg-lime-900',
              textColor: 'text-lime-900',
              darkTextColor: 'dark:text-lime-100',
            },
            {
              text: '#Adventure',
              bgColor: 'bg-violet-100',
              darkBgColor: 'dark:bg-violet-900',
              textColor: 'text-violet-900',
              darkTextColor: 'dark:text-violet-100',
            },
            {
              text: '#Beach',
              bgColor: 'bg-sky-100',
              darkBgColor: 'dark:bg-sky-900',
              textColor: 'text-sky-900',
              darkTextColor: 'dark:text-sky-100',
            },
          ]}
          footer={
            <div className="flex items-start gap-2">
              <EarthIcon className="size-4 text-foreground/50" />
              <span className="text-sm text-foreground/50 leading-5 font-normal">
                Serengeti hot air balloon → Ngorongoro Crater → Stone Town spice
                tour
              </span>
            </div>
          }
        />
        <ExploreContentCard
          coverImageUrl="/images/mexico.jpg"
          coverImageAlt="mexico-city"
          title="Mexico City Foodie Weekend"
          description="By @TacoNinja | 1.7K saves"
          tags={[
            {
              text: '#StreetFood',
              bgColor: 'bg-blue-100',
              darkBgColor: 'dark:bg-blue-900',
              textColor: 'text-blue-900',
              darkTextColor: 'dark:text-blue-100',
            },
            {
              text: '#History',
              bgColor: 'bg-purple-100',
              darkBgColor: 'dark:bg-purple-900',
              textColor: 'text-purple-900',
              darkTextColor: 'dark:text-purple-100',
            },
            {
              text: '#Weekend',
              bgColor: 'bg-fuchsia-100',
              darkBgColor: 'dark:bg-fuchsia-900',
              textColor: 'text-fuchsia-900',
              darkTextColor: 'dark:text-fuchsia-100',
            },
          ]}
          footer={
              <div className="flex items-start gap-2">
              <EarthIcon className="size-4 text-foreground/50" />
              <span className="text-sm text-foreground/50 leading-5 font-normal">
                Charles Bridge → Ruin bars → Thermal baths → $5 meal guide
              </span>
            </div>
          }
        />
        <ExploreContentCard
          coverImageUrl="/images/budapest.jpg"
          coverImageAlt="budapest"
          title="Prague & Budapest Budget Week"
          description="By @EuroExplorer | 1.5K saves"
          tags={[
            {
              text: '#Hostels',
              bgColor: 'bg-fuchsia-100',
              darkBgColor: 'dark:bg-fuchsia-900',
              textColor: 'text-fuchsia-900',
              darkTextColor: 'dark:text-fuchsia-100',
            },
            {
              text: '#Architecture',
              bgColor: 'bg-sky-100',
              darkBgColor: 'dark:bg-sky-900',
              textColor: 'text-sky-900',
              darkTextColor: 'dark:text-sky-100',
            },
            {
              text: '#TrainTravel',
              bgColor: 'bg-blue-100',
              darkBgColor: 'dark:bg-blue-900',
              textColor: 'text-blue-900',
              darkTextColor: 'dark:text-blue-100',
            },
          ]}
          footer={
            <div className="flex items-start gap-2">
              <EarthIcon className="size-4 text-foreground/50" />
              <span className="text-sm text-foreground/50 leading-5 font-normal">
                Charles Bridge → Ruin bars → Thermal baths → $5 meal guide
              </span>
            </div>
          }
        />
        {loadMore && (
          <>
            <ExploreContentCard
              coverImageUrl="/images/kyoto.jpg"
              coverImageAlt="kyoto"
              title="Kyoto in 5 Days"
              description="By @ZenTraveler | 2.4K saves"
              tags={[
                {
                  text: '#Temples',
                  bgColor: 'bg-emerald-100',
                  darkBgColor: 'dark:bg-emerald-900',
                  textColor: 'text-emerald-900',
                  darkTextColor: 'dark:text-emerald-100',
                },
                {
                  text: '#CherryBlossoms',
                  bgColor: 'bg-indigo-100',
                  darkBgColor: 'dark:bg-indigo-900',
                  textColor: 'text-indigo-900',
                  darkTextColor: 'dark:text-indigo-100',
                },
                {
                  text: '#Cultural',
                  bgColor: 'bg-lime-100',
                  darkBgColor: 'dark:bg-lime-900',
                  textColor: 'text-lime-900',
                  darkTextColor: 'dark:text-lime-100',
                },
              ]}
              footer={
                <div className="flex items-start gap-2">
                  <EarthIcon className="size-4 text-foreground/50" />
                  <span className="text-sm text-foreground/50 leading-5 font-normal">
                    Fushimi Inari sunrise → Bamboo Forest → Tea ceremony → Gion
                    night walk
                  </span>
                </div>
              }
            />
            <ExploreContentCard
              coverImageUrl="/images/zanzibar.jpg"
              coverImageAlt="zanzibar"
              title="Safari & Zanzibar Combo"
              description="By @WildlifeChase | 892 saves"
              tags={[
                {
                  text: '#Luxury',
                  bgColor: 'bg-lime-100',
                  darkBgColor: 'dark:bg-lime-900',
                  textColor: 'text-lime-900',
                  darkTextColor: 'dark:text-lime-100',
                },
                {
                  text: '#Adventure',
                  bgColor: 'bg-violet-100',
                  darkBgColor: 'dark:bg-violet-900',
                  textColor: 'text-violet-900',
                  darkTextColor: 'dark:text-violet-100',
                },
                {
                  text: '#Beach',
                  bgColor: 'bg-sky-100',
                  darkBgColor: 'dark:bg-sky-900',
                  textColor: 'text-sky-900',
                  darkTextColor: 'dark:text-sky-100',
                },
              ]}
              footer={
                <div className="flex items-start gap-2">
                  <EarthIcon className="size-4 text-foreground/50" />
                  <span className="text-sm text-foreground/50 leading-5 font-normal">
                    Serengeti hot air balloon → Ngorongoro Crater → Stone Town
                    spice tour
                  </span>
                </div>
              }
            />
            <ExploreContentCard
              coverImageUrl="/images/mexico.jpg"
              coverImageAlt="mexico-city"
              title="Mexico City Foodie Weekend"
              description="By @TacoNinja | 1.7K saves"
              tags={[
                {
                  text: '#StreetFood',
                  bgColor: 'bg-blue-100',
                  darkBgColor: 'dark:bg-blue-900',
                  textColor: 'text-blue-900',
                  darkTextColor: 'dark:text-blue-100',
                },
                {
                  text: '#History',
                  bgColor: 'bg-purple-100',
                  darkBgColor: 'dark:bg-purple-900',
                  textColor: 'text-purple-900',
                  darkTextColor: 'dark:text-purple-100',
                },
                {
                  text: '#Weekend',
                  bgColor: 'bg-fuchsia-100',
                  darkBgColor: 'dark:bg-fuchsia-900',
                  textColor: 'text-fuchsia-900',
                  darkTextColor: 'dark:text-fuchsia-100',
                },
              ]}
              footer={
                <div className="flex items-start gap-2">
                  <EarthIcon className="size-4 text-foreground/50" />
                  <span className="text-sm text-foreground/50 leading-5 font-normal">
                    Charles Bridge → Ruin bars → Thermal baths → $5 meal guide
                  </span>
                </div>
              }
            />
          </>
        )}
      </div>
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="px-4 h-8.5 text-sm text-foreground/70"
          onClick={() => setLoadMore(!loadMore)}
        >
          Load More
        </Button>
      </div>
    </AppLayoutContent>
  );
};
