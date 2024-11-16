'use client';

import React from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  Trash,
  Edit,
  MoreVertical,
  FilePlus,
  Folder,
  ChevronRight,
  Book,
} from "lucide-react";

export default function NotesPage() {
//   const notes = []; // Empty for placeholder, add notes array to show list view
  const notes = [
    {
        id: 1,
        title: "Data Structures",
        content: "Discuss project deadlines and deliverables.",
        lastEdited: "2024-03-15T10:30:00",
        color: "bg-blue-500/10"
    },
    {
        id: 2,
        title: "Increase Inflations",
        content: "Discuss project deadlines and deliverables.",
        lastEdited: "2024-03-15T10:30:00",
        color: "bg-blue-500/10"
    },
    {
        id: 2,
        title: "Meeting Notes",
        content: "Discuss project deadlines and deliverables.",
        lastEdited: "2024-03-15T10:30:00",
        color: "bg-blue-500/10"
    }]

  const handleCreateNote = () => {
    window.location.href = '/playground';
  };

  const handleEditNote = (noteId) => {
    window.location.href = `/playground?id=${noteId}`;
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header Section */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">

          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Planoeducation</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Notes</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-900">
          {notes.length > 0 ? (
            <div className="p-6">
              {/* Page Header */}
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">My Notes</h1>
                <Button 
                  onClick={handleCreateNote}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <FilePlus className="h-4 w-4" />
                  New Note
                </Button>
              </div>

              {/* Notes List */}
              <div className="space-y-1">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="group flex items-center gap-3 rounded-lg p-3 hover:bg-gray-800"
                  >
                    <Book className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">
                        {note.title}
                      </h3>
                      <p className="text-xs text-gray-400">
                        Last edited {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        onClick={() => handleEditNote(note.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Empty State
            <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center">
              <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 shadow-lg max-w-md w-full">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
                  <FilePlus className="h-6 w-6 text-blue-500" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-white">
                  No notes yet
                </h2>
                <p className="mb-6 text-sm text-gray-400">
                  Create your first note to get started with organizing your thoughts and ideas.
                </p>
                <Button 
                  onClick={handleCreateNote}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Create New Note
                </Button>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}