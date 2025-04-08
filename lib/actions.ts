"use server"

import { revalidatePath } from "next/cache"
import type { Task, CreateTaskInput } from "./types"

// In-memory storage for tasks (in a real app, you'd use a database)
let tasks: Task[] = [
  {
    id: "1",
    title: "Learn Next.js",
    description: "Study the App Router and Server Components",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Build a project",
    description: "Create a task management application",
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
]

export async function getTasks(): Promise<Task[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newTask: Task = {
    id: Date.now().toString(),
    title: input.title,
    description: input.description,
    completed: input.completed,
    createdAt: new Date().toISOString(),
  }

  tasks = [newTask, ...tasks]
  revalidatePath("/")
  return newTask
}

export async function updateTaskStatus(id: string, completed: boolean): Promise<Task> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const taskIndex = tasks.findIndex((task) => task.id === id)
  if (taskIndex === -1) throw new Error("Task not found")

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    completed,
  }

  revalidatePath("/")
  return tasks[taskIndex]
}

export async function updateTaskTitle(id: string, title: string): Promise<Task> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const taskIndex = tasks.findIndex((task) => task.id === id)
  if (taskIndex === -1) throw new Error("Task not found")

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title,
  }

  revalidatePath("/")
  return tasks[taskIndex]
}

export async function deleteTask(id: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  tasks = tasks.filter((task) => task.id !== id)
  revalidatePath("/")
}

