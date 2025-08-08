"use client";

import React, { useState, useEffect, useMemo } from "react";
import { addCommentToProject, getProjects, getUsers, updateProject } from "@/lib/data";
import { Project, ProjectStatus, User } from "@/types";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function MemberDashboard() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newCommentText, setNewCommentText] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setProjects(getProjects());
    setUsers(getUsers());
  }, []);

  const assignedProjects = useMemo(() => {
    if (!currentUser) return [];
    return projects.filter((project) =>
      project.assignedMembers.includes(currentUser.id)
    );
  }, [projects, currentUser]);

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    const updated = updateProject(projectId, { status: newStatus });
    if (updated) {
      setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));
    }
  };

  const handleAddComment = (projectId: string) => {
    if (!currentUser || !newCommentText[projectId]?.trim()) return;

    const comment = {
      text: newCommentText[projectId],
      userId: currentUser.id,
      timestamp: new Date().toISOString(),
    };

    const updated = addCommentToProject(projectId, comment);
    if (updated) {
      setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));
      setNewCommentText((prev) => ({ ...prev, [projectId]: "" }));
    }
  };

  const getUserNameById = (userId: string) => {
    return users.find((u) => u.id === userId)?.username || "Unknown User";
  };

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

  if (!currentUser) {
    return <p>Please log in to view your projects.</p>;
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">My Projects</h1>
      {assignedProjects.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No projects assigned to you.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assignedProjects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Due: {project.dueDate}</span>
                  <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`status-${project.id}`}>Update Status</Label>
                  <Select
                    value={project.status}
                    onValueChange={(value: ProjectStatus) =>
                      handleStatusChange(project.id, value)
                    }
                  >
                    <SelectTrigger id={`status-${project.id}`}>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Assigned To</Label>
                  <div className="text-sm text-muted-foreground">
                    {project.assignedMembers
                      .map((id) => getUserNameById(id))
                      .join(", ")}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Comments</Label>
                  <div className="max-h-32 overflow-y-auto rounded-md border p-2 text-sm">
                    {project.comments.length === 0 ? (
                      <p className="text-muted-foreground">No comments yet.</p>
                    ) : (
                      project.comments.map((comment, index) => (
                        <div key={index} className="mb-1 border-b pb-1 last:mb-0 last:border-b-0">
                          <p className="font-medium">
                            {getUserNameById(comment.userId)}{" "}
                            <span className="text-xs text-muted-foreground">
                              ({format(new Date(comment.timestamp), "MMM dd, yyyy HH:mm")})
                            </span>
                          </p>
                          <p>{comment.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`new-comment-${project.id}`}>Add Comment</Label>
                  <Textarea
                    id={`new-comment-${project.id}`}
                    placeholder="Write a comment..."
                    value={newCommentText[project.id] || ""}
                    onChange={(e) =>
                      setNewCommentText((prev) => ({
                        ...prev,
                        [project.id]: e.target.value,
                      }))
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleAddComment(project.id)}
                  disabled={!newCommentText[project.id]?.trim()}
                  className="w-full"
                >
                  Add Comment
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
