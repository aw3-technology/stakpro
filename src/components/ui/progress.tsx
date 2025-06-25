import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
		const timer = setTimeout(() => setProgress(value || 0), 200);
		return () => clearTimeout(timer);
	}, [value]);
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-neutral-900/20 relative h-2 w-full overflow-hidden rounded-full dark:bg-neutral-50/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all rounded-full"
        style={{ transform: `translateX(-${100 - (progress || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
