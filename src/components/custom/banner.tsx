"use client"

import { useState } from "react"
import { Sparkles, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export const Banner = () => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/25 backdrop-blur-md border-b shadow-sm">
      <div className="bg-muted/25 text-foreground px-4 py-3">
        <div className="flex gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center">
          <div
            className="bg-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5"
            aria-hidden="true"
          >
            <Sparkles className="opacity-80" size={16} />
          </div>
          <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Stak is now in Beta!</p>
              <p className="text-muted-foreground text-sm">
                We&lsquo;re actively testing and improving. Your feedback helps us build a better product for everyone.
              </p>
            </div>
            <div className="flex gap-3 max-md:flex-wrap">
              <Button size="sm" className="text-sm">
                Join Beta
              </Button>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => setIsVisible(false)}
          aria-label="Close banner"
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
        </div>
      </div>
    </div>
  )
}
