import { ContentHeader } from '@/components/custom/content-header';
import { Divider } from '@/components/custom/divider';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

const initialNotifications = [
  {
    label: 'AI itinerary ready',
    description: 'Get instant alerts when your custom trip plan is complete',
    value: true,
    disabled: true,
  },
  {
    label: 'Platform news and updates',
    description:
      'Includes productivity stats and tasks due today. Sent every morning.',
    value: false,
    disabled: false,
  },
  {
    label: 'Trip Planning Alerts',
    description: 'Never miss price drops or new route opportunities',
    value: true,
    disabled: false,
  },
  {
    label: 'Payout confirmations',
    description: 'Transaction receipts with clear payout details',
    value: true,
    disabled: false,
  },
  {
    label: 'Low credit balance warnings',
    description: 'Proactive alerts before you hit usage limits',
    value: false,
    disabled: false,
  },
  {
    label: 'Subscription receipts & renewals',
    description: 'Payment confirmations and renewal reminders',
    value: false,
    disabled: false,
  },
  {
    label: 'New device logins',
    description: 'Immediate security alerts for unrecognized access',
    value: false,
    disabled: false,
  },
  {
    label: 'Alternative route suggestions',
    description: 'Smarter Plan B options when disruptions occur"',
    value: false,
    disabled: false,
  },
  {
    label: 'Daily digest',
    description: 'Your 8 AM digest of trip updates and opportunities',
    value: false,
    disabled: false,
  },
];

export const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const changeNotification = (label: string, value: boolean) => {
    const updatedNotifications = notifications.map((n) =>
      n.label === label ? { ...n, value } : n,
    );
    setNotifications(updatedNotifications);
  };
  return (
    <>
      <ContentHeader
        title="Notifications"
        description="Choose when and how we contact you about your trips"
      />
      {notifications.map((notification) => (
        <div key={notification.label} className="flex flex-col">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <p className="text-base font-medium text-popover-foreground">
                {notification.label}
              </p>
              <p className="text-base font-medium text-muted-foreground">
                {notification.description}
              </p>
            </div>
            <Switch
              className="bg-primary data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input"
              checkedClassName="bg-white dark:bg-elevated dark:dark:data-[state=unchecked]:bg-elevated dark:data-[state=checked]:bg-elevated"
              id={notification.label}
              disabled={notification.disabled}
              checked={notification.value}
              onCheckedChange={(v) => {
                changeNotification(notification.label, v);
              }}
            />
          </div>
          <Divider size="large" />
        </div>
      ))}
    </>
  );
};
