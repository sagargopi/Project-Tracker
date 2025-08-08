"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  addProject,
  deleteProject,
  getProjects,
  getUsers,
  updateProject,
} from "@/lib/data";
import { Project, ProjectStatus, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Check, ChevronsUpDown, Edit, Trash } from 'lucide-react';
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectDueDate, setNewProjectDueDate] = useState<Date | undefined>(undefined);
  const [newProjectAssignedMembers, setNewProjectAssignedMembers] = useState<string[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [filterMember, setFilterMember] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "all">("all");

  useEffect(() => {
    setProjects(getProjects());
    setUsers(getUsers());
  }, []);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle || !newProjectDescription || !newProjectDueDate || newProjectAssignedMembers.length === 0) {
      alert("Please fill all project fields and assign at least one member.");
      return;
    }

    const newProject = addProject({
      title: newProjectTitle,
      description: newProjectDescription,
      dueDate: newProjectDueDate.toISOString().split("T")[0],
      assignedMembers: newProjectAssignedMembers,
    });
    setProjects((prev) => [...prev, newProject]);
    setNewProjectTitle("");
    setNewProjectDescription("");
    setNewProjectDueDate(undefined);
    setNewProjectAssignedMembers([]);
  };

  const handleUpdateProject = (projectId: string, updates: Partial<Project>) => {
    const updated = updateProject(projectId, updates);
    if (updated) {
      setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));
    }
  };

  const handleDeleteProject = (projectId: string) => {
    deleteProject(projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesMember =
        filterMember === "all" || project.assignedMembers.includes(filterMember);
      const matchesStatus =
        filterStatus === "all" || project.status === filterStatus;
      return matchesMember && matchesStatus;
    });
  }, [projects, filterMember, filterStatus]);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "Not Started":
        return "bg-gray-500";
      case "In Progress":
        return "bg-blue-500";
      case "Completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProject} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                placeholder="Project Title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="Project Description"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newProjectDueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newProjectDueDate ? format(newProjectDueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newProjectDueDate}
                    onSelect={setNewProjectDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignedMembers">Assigned Members</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {newProjectAssignedMembers.length > 0
                      ? newProjectAssignedMembers
                          .map((id) => users.find((u) => u.id === id)?.username)
                          .filter(Boolean)
                          .join(", ")
                      : "Select members..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search members..." />
                    <CommandEmpty>No member found.</CommandEmpty>
                    <CommandGroup>
                      {users.map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => {
                            setNewProjectAssignedMembers((prev) =>
                              prev.includes(user.id)
                                ? prev.filter((id) => id !== user.id)
                                : [...prev, user.id]
                            );
                          }}
                        >
                          <Checkbox
                            checked={newProjectAssignedMembers.includes(user.id)}
                            className="mr-2"
                          />
                          {user.username}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              newProjectAssignedMembers.includes(user.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="col-span-full flex justify-end">
              <Button type="submit">Add Project</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1 grid gap-2">
              <Label htmlFor="filterMember">Filter by Member</Label>
              <Select value={filterMember} onValueChange={setFilterMember}>
                <SelectTrigger id="filterMember">
                  <SelectValue placeholder="All Members" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 grid gap-2">
              <Label htmlFor="filterStatus">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={(value: ProjectStatus | "all") => setFilterStatus(value)}>
                <SelectTrigger id="filterStatus">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Assigned Members</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No projects found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{project.description}</TableCell>
                      <TableCell>{project.dueDate}</TableCell>
                      <TableCell>
                        {project.assignedMembers
                          .map((id) => users.find((u) => u.id === id)?.username)
                          .filter(Boolean)
                          .join(", ")}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingProject(project)}
                          aria-label="Edit project"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" aria-label="Delete project">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the project
                                &quot;{project.title}&quot; and remove its data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingProject && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-lg p-6">
            <CardHeader>
              <CardTitle>Edit Project</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingProject) {
                    handleUpdateProject(editingProject.id, {
                      title: editingProject.title,
                      description: editingProject.description,
                      dueDate: editingProject.dueDate,
                      assignedMembers: editingProject.assignedMembers,
                      status: editingProject.status,
                    });
                    setEditingProject(null);
                  }
                }}
                className="grid gap-4"
              >
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject((prev) =>
                        prev ? { ...prev, title: e.target.value } : null
                      )
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProject.description}
                    onChange={(e) =>
                      setEditingProject((prev) =>
                        prev ? { ...prev, description: e.target.value } : null
                      )
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-dueDate">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editingProject.dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingProject.dueDate ? (
                          format(new Date(editingProject.dueDate), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(editingProject.dueDate)}
                        onSelect={(date) =>
                          setEditingProject((prev) =>
                            prev ? { ...prev, dueDate: date?.toISOString().split("T")[0] || "" } : null
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-assignedMembers">Assigned Members</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {editingProject.assignedMembers.length > 0
                          ? editingProject.assignedMembers
                              .map((id) => users.find((u) => u.id === id)?.username)
                              .filter(Boolean)
                              .join(", ")
                          : "Select members..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                      <Command>
                        <CommandInput placeholder="Search members..." />
                        <CommandEmpty>No member found.</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              key={user.id}
                              onSelect={() => {
                                setEditingProject((prev) => {
                                  if (!prev) return null;
                                  const updatedMembers = prev.assignedMembers.includes(user.id)
                                    ? prev.assignedMembers.filter((id) => id !== user.id)
                                    : [...prev.assignedMembers, user.id];
                                  return { ...prev, assignedMembers: updatedMembers };
                                });
                              }}
                            >
                              <Checkbox
                                checked={editingProject.assignedMembers.includes(user.id)}
                                className="mr-2"
                              />
                              {user.username}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  editingProject.assignedMembers.includes(user.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={editingProject.status}
                    onValueChange={(value: ProjectStatus) =>
                      setEditingProject((prev) =>
                        prev ? { ...prev, status: value } : null
                      )
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingProject(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  );
}
