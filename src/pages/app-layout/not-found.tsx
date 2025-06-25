import { AppLayoutContent } from "@/components/custom/app-layout-content";
import { StackImages } from "@/components/custom/stack-images";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router";
export const NotFound = () => {
  const navigate = useNavigate();
  return (
    <AppLayoutContent>
      <div className="flex flex-col h-full items-start justify-center gap-8">
        <StackImages
          coverImageUrl="/images/not-found.jpg"
          coverImageAlt="Not Found"
        />
        <span className="text-3xl font-medium text-foreground/70 leading-8">
          Oops! Lost in the Digital Wilderness
        </span>
        <span className="text-8xl font-semibold text-foreground/70 leading-8">
          404.
        </span>
        <span className="text-sm text-foreground/70 leading-5 font-medium">
          Even the best travelers take wrong turns. Let’s get you back on track!
        </span>
        <div className="flex gap-4">
          <Button variant="default" className="cursor-pointer" onClick={() => navigate('/')}>
            Homepage
          </Button>
          <Button variant="secondary" className="cursor-pointer">
            Help Center
            <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </AppLayoutContent>
  );
};
