import * as React from "react"
import { cn } from "@/lib/utils"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background",
        className
      )}
      {...props}
    />
  )
} 