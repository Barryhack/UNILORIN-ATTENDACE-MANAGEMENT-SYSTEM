"use client"

import { useState } from "react"
import { Trash, Edit, Check, X } from "lucide-react"
import type { Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { updateTaskStatus, updateTaskTitle } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

interface TaskItemProps {
  task: Task
  onDelete: (id: string) => void
}

export function TaskItem({ task, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(task.title)
  const [isCompleted, setIsCompleted] = useState(task.completed)
  const { toast } = useToast()

  const handleStatusChange = async () => {
    const newStatus = !isCompleted
    setIsCompleted(newStatus)

    try {
      await updateTaskStatus(task.id, newStatus)
    } catch (error) {
      setIsCompleted(!newStatus) // Revert on error
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSaveEdit = async () => {
    if (editedTitle.trim() === "") return

    try {
      await updateTaskTitle(task.id, editedTitle)
      setIsEditing(false)
      toast({
        title: "Task updated",
        description: "Your task has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancelEdit = () => {
    setEditedTitle(task.title)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-2">
          <Checkbox checked={isCompleted} onCheckedChange={handleStatusChange} className="mt-1" />
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full"
                autoFocus
              />
            ) : (
              <p className={`${isCompleted ? "line-through text-muted-foreground" : ""}`}>{task.title}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{new Date(task.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 flex justify-end gap-2 border-t">
        {isEditing ? (
          <>
            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveEdit}>
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(task.id)}>
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}

