import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface AttendanceDetailsProps {
  isOpen: boolean
  onClose: () => void
  attendance: {
    course: string
    date: string
    time: string
    status: string
    timestamp?: string | null
    verificationMethod?: string | null
    location?: string
  }
}

export function AttendanceDetails({ isOpen, onClose, attendance }: AttendanceDetailsProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />
      <div className="relative z-50 w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight">Attendance Details</h2>
        </div>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Course</p>
              <p className="text-sm">{attendance.course}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="text-sm">{attendance.date}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Time</p>
              <p className="text-sm">{attendance.time}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className={`text-sm ${
                attendance.status === "present" 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-red-600 dark:text-red-400"
              }`}>
                {attendance.status}
              </p>
            </div>
            {attendance.location && (
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-sm">{attendance.location}</p>
              </div>
            )}
            {attendance.timestamp && (
              <div>
                <p className="text-sm font-medium text-gray-500">Timestamp</p>
                <p className="text-sm">
                  {format(new Date(attendance.timestamp), "MMM dd, yyyy hh:mm a")}
                </p>
              </div>
            )}
            {attendance.verificationMethod && (
              <div>
                <p className="text-sm font-medium text-gray-500">Verification Method</p>
                <p className="text-sm">{attendance.verificationMethod}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
} 