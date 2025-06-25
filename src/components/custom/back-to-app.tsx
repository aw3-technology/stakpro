import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
import { SidebarInset, SidebarTrigger, useSidebar } from '../ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
export const BackToApp = () => {
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  const handleBack = () => {
    setOpenMobile(false);
    navigate('/');
  };

  return (
    <SidebarInset
      className={cn(
        'flex flex-row items-center dark:bg-layout py-2 bg-settings-background px-2 md:px-4',
        !isMobile && 'hidden'
      )}
    >
      <SidebarTrigger className="cursor-pointer" />
      <Button
        variant="link"
        onClick={handleBack}
        className="flex gap-4 group hover:no-underline cursor-pointer"
      >
        <ChevronLeft className="size-4 text-foreground/60 group-hover:translate-x-1 transition-transform duration-300" />
        <span className="text-sm">Back to app</span>
      </Button>
    </SidebarInset>
  );
};
