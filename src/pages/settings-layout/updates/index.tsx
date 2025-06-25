import { ContentHeader } from '@/components/custom/content-header';
import { Tag } from '@/components/custom/tag';
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@/components/ui/timeline';
import { Rocket } from 'lucide-react';

export const Updates = () => {
  return (
    <>
      <ContentHeader
        title="What's New"
        description="Latest features, tips, and travel trends – stay informed!"
      />
      <Timeline defaultValue={1} className="gap-4">
        {items.map((item) => (
          <TimelineItem
            key={item.id}
            step={item.id}
            className="group-data-[orientation=vertical]/timeline:ms-0 group-data-[orientation=vertical]/timeline:not-last:pb-6 pl-10 pr-8 py-6  hover:bg-card-solid rounded-2xl gap-5"
          >
            <TimelineHeader>
              <TimelineSeparator className="bg-foreground/10 group-data-[orientation=vertical]/timeline:ms-4 group-data-[orientation=vertical]/timeline:left-0 group-data-[orientation=vertical]/timeline:h-[calc(100%)]" />
              <TimelineTitle className="-mt-0.5">{item.title}</TimelineTitle>
              <TimelineIndicator className="bg-foreground/10 size-2 mt-7 group-data-[orientation=vertical]/timeline:ms-4 group-data-[orientation=vertical]/timeline:left-0" />
            </TimelineHeader>
            <TimelineContent>{item.description}</TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </>
  );
};

const items = [
  {
    id: 1,
    title: (
      <div className="flex items-center gap-2">
        <span className="text-base text-foreground">Apr 4, 2025</span>
        <Tag
          small
          className="bg-emerald-900 text-emerald-100 rounded-md text-xs leading-4 font-medium flex items-center gap-1"
        >
          <Rocket className="size-3" />
          Latest
        </Tag>
      </div>
    ),
    description: (
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-sm leading-5 font-normal">
            🌙 - Dark theme is now available for a more comfortable browsing
            experience!
          </span>
          <img
            src="/images/video.jpg"
            alt="Dark theme"
            className="w-full h-full object-cover"
            height={368}
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm leading-5 font-normal">
            🐞 - Fixed incorrect timezone adjustments in trip itineraries.
          </span>
          <span className="text-sm leading-5 font-normal">
            💄 - Improved UI for better readability in dark mode.
          </span>
          <span className="text-sm leading-5 font-normal">
            🔥 - New: AI-generated travel recommendations based on user
            preferences.
          </span>
          <span className="text-sm leading-5 font-normal">
            🛠 - Optimized map loading speed for a smoother experience.
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: (
      <div className="flex items-center gap-2">
        <span className="text-base text-foreground">Mar 22, 2025</span>
        <Tag
          small
          className="bg-sky-900 text-sky-100 rounded-md text-xs leading-4 font-medium flex items-center gap-1"
        >
          3.12.0
        </Tag>
      </div>
    ),
    description: (
      <div className="flex flex-col gap-2">
        <span className="text-sm leading-5 font-normal">
          🐞 - Resolved bugs causing duplicate bookings in shared trips.
        </span>
        <span className="text-sm leading-5 font-normal">
          🔒 - Enhanced data encryption for secure user information storage.
        </span>
        <span className="text-sm leading-5 font-normal">
          💄 - Updated calendar UI for better event visibility.
        </span>
        <span className="text-sm leading-5 font-normal">
          🔥 - New: Multi-user collaboration for group trip planning.
        </span>
        <span className="text-sm leading-5 font-normal">
          🇪🇸 - Improved Spanish translations for a more localized experience.
        </span>
        <span className="text-sm leading-5 font-normal">
          🛠 - Streamlined API for better third-party integration support.
        </span>
      </div>
    ),
  },
  {
    id: 3,
    title: (
      <div className="flex items-center gap-2">
        <span className="text-base text-foreground">Feb 29, 2025</span>
        <Tag
          small
          className="bg-fuchsia-900 text-fuchsia-100 rounded-md text-xs leading-4 font-medium flex items-center gap-1"
        >
          3.11.9
        </Tag>
      </div>
    ),
    description: (
      <div className="flex flex-col gap-2">
        <span className="text-sm leading-5 font-normal">
          🐞 - Fixed issues with offline itinerary access.
        </span>
        <span className="text-sm leading-5 font-normal">
          🔥 - New: AI-powered budget estimation for trips.
        </span>
        <span className="text-sm leading-5 font-normal">
          🛠 - Improved flight and hotel search algorithm for better accuracy.
        </span>
        <span className="text-sm leading-5 font-normal">
          💄 - Redesigned onboarding flow for a more intuitive user experience.
        </span>
      </div>
    ),
  },
  {
    id: 4,
    title: (
      <div className="flex items-center gap-2">
        <span className="text-base text-foreground">Feb 05, 2025</span>
        <Tag
          small
          className="bg-indigo-900 text-indigo-100 rounded-md text-xs leading-4 font-medium flex items-center gap-1"
        >
          3.11.8
        </Tag>
      </div>
    ),
    description: (
      <div className="flex flex-col gap-2">
        <span className="text-sm leading-5 font-normal">
          🐞 - Addressed performance issues when loading large travel
          itineraries.
        </span>
        <span className="text-sm leading-5 font-normal">
          🇫🇷 - Improved French translations for trip details.
        </span>
        <span className="text-sm leading-5 font-normal">
          🛠 - Enhanced support for multi-city trip planning.
        </span>
      </div>
    ),
  },
  {
    id: 5,
    title: (
      <div className="flex items-center gap-2">
        <span className="text-base text-foreground">Dec 05, 2024</span>
        <Tag
          small
          className="bg-indigo-900 text-indigo-100 rounded-md text-xs leading-4 font-medium flex items-center gap-1"
        >
          1.0.0
        </Tag>
      </div>
    ),
    description: (
      <div className="flex flex-col gap-2">
        <span className="text-sm leading-5 font-normal">
          🚀 - First launch.
        </span>
      </div>
    ),
  },
];
