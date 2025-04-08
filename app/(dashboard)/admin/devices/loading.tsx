import { Skeleton } from "@/components/ui/skeleton"

export default function DevicesLoading() {
  return (
    <div className="space-y-6">
      <div className="h-20 animate-pulse bg-gray-100 rounded-lg" />
      <div className="space-y-4">
        <div className="h-32 animate-pulse bg-gray-100 rounded-lg" />
        <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />
      </div>
    </div>
  )
} 