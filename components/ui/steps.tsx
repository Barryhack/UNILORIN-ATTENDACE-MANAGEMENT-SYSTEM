"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface StepsProps {
  value: number
  children: React.ReactNode
  className?: string
}

interface StepProps {
  value: number
  title: string
}

export function Steps({ value, children, className }: StepsProps) {
  const childrenArray = React.Children.toArray(children)
  const steps = childrenArray.map((step, index) => {
    if (React.isValidElement(step)) {
      return React.cloneElement(step, {
        ...step.props,
        completed: value > index + 1,
        active: value === index + 1,
      })
    }
    return step
  })

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          {step}
          {index < steps.length - 1 && (
            <div className="h-[2px] flex-1 bg-border" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export function Step({ 
  value, 
  title, 
  completed, 
  active 
}: StepProps & { 
  completed?: boolean
  active?: boolean 
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium",
          {
            "border-primary bg-primary text-primary-foreground": active,
            "border-border bg-background": !active && !completed,
            "border-primary/50 bg-primary/10 text-primary": completed,
          }
        )}
      >
        {value}
      </div>
      <span
        className={cn("text-sm font-medium", {
          "text-foreground": active || completed,
          "text-muted-foreground": !active && !completed,
        })}
      >
        {title}
      </span>
    </div>
  )
} 