import { ContentHeader } from '@/components/custom/content-header';
import { useCountries } from '@/hooks/use-countries';
import { SelectGroup, SelectItem, SelectLabel } from '@/components/ui/select';
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Select } from '@/components/ui/select';
import { useCurrencies } from '@/hooks/use-currencies';
import { Button } from '@/components/ui/button';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { Divider } from '@/components/custom/divider';

import { ThemeSelector } from '@/components/custom/theme-selector';

const travelPreferences = [
  {
    label: 'Solo Trip',
    icon: {
      name: 'bike',
      color: 'text-yellow-500',
    },
    value: 'solo_trip',
  },
  {
    label: 'Partner',
    icon: {
      name: 'wine',
      color: 'text-pink-600',
    },
    value: 'partner',
  },
  {
    label: 'Family',
    icon: {
      name: 'baby',
      color: 'text-pink-500',
    },
    value: 'family',
  },
];

export const Preferences = () => {
  const countries = useCountries();
  const currencies = useCurrencies();

  return (
    <>
      <ContentHeader
        title="Preferences"
        description="Make it yours - adjust settings & preferences"
      />
      <div className="flex flex-col">
        <div className="flex flex-col gap-6">
          <Select>
            <SelectTrigger className="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
              {countries.map((continent) => (
                <SelectGroup key={continent.continent}>
                  <SelectLabel className="ps-2">
                    {continent.continent}
                  </SelectLabel>
                  {continent.items.map((item) => (
                    <SelectItem key={item.value} value={item.value} >
                      <span className="text-lg leading-none">{item.flag}</span>{' '}
                      <span className="truncate">{item.label}</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="[&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
              {currencies.map((currency) => (
                <SelectItem key={currency.currency} value={currency.value}>
                  {`${currency.label} (${currency.currency})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Divider size="large" />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-base font-medium text-popover-foreground">
              Travel Preferences
            </span>
            <span className="text-base font-medium text-foreground/50">
              Set your travel preferences
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            {travelPreferences.map((preference) => (
              <Button
                variant="outline"
                className="border-2 border-input gap-2 px-5 pl-4"
                key={preference.value}
              >
                <span className="size-4">
                  <DynamicIcon
                    name={preference?.icon?.name as IconName}
                    className={preference?.icon?.color}
                  />
                </span>
                
                {preference.label}
              </Button>
            ))}
          </div>
        </div>
        <Divider size="large" />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-base font-medium text-popover-foreground">
              Theme
            </span>
            <span className="text-base font-medium text-foreground/50">
              Select a theme to personalize your platform's appearance
            </span>
          </div>
          <ThemeSelector />
        </div>
        <Divider size="large" />
        <div className="flex justify-end">
          <Button>Save</Button>
        </div>
      </div>
    </>
  );
};
