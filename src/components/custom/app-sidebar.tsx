import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { ChevronLeft } from 'lucide-react';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { Link, useLocation, useNavigate } from 'react-router';
import { useMenuItems } from '@/hooks/use-menu-items';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = useMenuItems();
  const { setOpenMobile } = useSidebar();
  const handleBack = () => {
    setOpenMobile(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar {...props} className="max-w-[220px] bg-settings-sidebar">
      <SidebarHeader className="flex flex-row gap-4 w-full">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center rounded-md justify-start gap-2 text-sm text-foreground/60 hover:text-foreground cursor-pointer w-full"
        >
          <ChevronLeft className="size-3.5" />
          Back to app
        </Button>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {menuItems.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url || '')}
                      onClick={() => {
                        setOpenMobile(false);
                      }}
                    >
                      <Link
                        to={item.url || ''}
                        className="flex items-center gap-2 text-foreground/60"
                      >
                        {typeof item.icon === 'string' ? (
                          <span className="size-3.5">
                            <DynamicIcon
                              name={item.icon as IconName}
                              className="size-3.5"
                            />
                          </span>
                        ) : item.icon ? (
                          <item.icon className="size-3.5" />
                        ) : null}
                        <span
                          className={cn(
                            'text-sm',
                            isActive(item.url || '') && 'text-foreground'
                          )}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
