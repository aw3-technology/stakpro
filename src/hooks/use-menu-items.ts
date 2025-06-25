import { DiscordIcon } from './../components/custom/icons/discord-icon';
import { IconName } from "lucide-react/dynamic";

export interface MenuItem {
  title: string;
  url?: string;
  icon?: IconName | React.FC<{ className?: string }>;
  items?: MenuItem[];
}

export const useMenuItems = (): MenuItem[] => {
  return [
    {
      title: 'Account',
      items: [
        {
          title: 'Profile',
          icon: 'user-round',
          url: '/profile',
        },
        {
          title: 'Preferences',
          url: '/preferences',
          icon: 'settings-2',
        },
        {
          title: 'Notifications',
          url: '/notifications',
          icon: 'bell-dot',
        },
        {
          title: 'History',
          url: '/history',
          icon: 'history',
        },
      ],
    },
    {
      title: 'General',
      items: [
        {
          title: 'Plans',
          url: '/plans',
          icon: 'crown',
        },
        {
          title: 'Billing',
          url: '/billing',
          icon: 'wallet-minimal',
        },
        {
          title: 'Usage',
          url: '/usage',
          icon: 'infinity',
        },
        {
          title: 'Affiliate',
          url: '/affiliate-program',
          icon: 'waypoints',
        },
        {
          title: 'Payouts',
          url: '/payouts',
          icon: 'hand-coins',
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Updates',
          url: '/updates',
          icon: 'rocket',
        },
        {
          title: 'Terms',
          url: '/terms',
          icon: 'handshake',
        },
        {
          title: 'Privacy policy',
          url: '/privacy-policy',
          icon: 'earth-lock',
        },
        {
          title: 'Join our Discord',
          icon: DiscordIcon,
        },
      ],
    }
  ];
};
