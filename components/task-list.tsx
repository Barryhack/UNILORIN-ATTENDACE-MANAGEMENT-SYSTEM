"use client"

import { useState } from "react"
import type { Task } from "@/lib/types"
import { TaskItem } from "@/components/task-item"
import { deleteTask } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

interface TaskListProps {
  initialTasks: Task[]
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id)
      setTasks(tasks.filter((task) => task.id !== id))
      toast({
        title: "Task deleted",
        description: "Your task has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No tasks yet. Add one to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDelete={handleDelete} />
      ))}
    </div>
  )
}

