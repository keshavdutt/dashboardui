'use client';

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";

import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton, useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";


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
  File,
  Clock,
  Search,
  Grid,
  List,
  FilePenLine,
  Calendar,
  Tags
} from "lucide-react";
import { Input } from '@/components/ui/input';

import { useRouter } from "next/navigation";

export default function NotesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const { user } = useUser();


  const [view, setView] = React.useState('list');


  // Inside your NotesPage function
  const router = useRouter();

  // Navigate to Workspace with noteId in the URL
  // Navigate to Workspace with note data in state
  const handleNoteClick = (note) => {
    router.push(`/workspace?slug=${note.slug}`);
  };

  // Convex queries
  const notes = useQuery(api.notes.getNotes);
  // console.log('These are the notes', notes)
  // const deleteNote = useMutation(api.notes.deleteNote);
  const getRecentNotes = useQuery(api.notes.getRecentNotes);



  // Handle note deletion
  // const handleDeleteNote = async (noteId) => {
  //   try {
  //     await deleteNote({ noteId });
  //     toast.success("Note deleted successfully!");
  //   } catch (error) {
  //     toast.error("Failed to delete note: " + error.message);
  //   }
  // };

  // Filter and sort notes
  const filteredNotes = notes?.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    const dateA = new Date(a._creationTime).getTime();
    const dateB = new Date(b._creationTime).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-4 border-b px-4">
            <SidebarTrigger className="shrink-0" />
            <Separator orientation="vertical" className="h-6" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="text-muted-foreground hover:text-primary">
                    Planoeducation
                  </BreadcrumbLink>
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
        <main className="flex-1 p-8">
          {sortedNotes.length > 0 ? (
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">My Notes</h1>
                  <p className="text-sm text-muted-foreground">
                    {sortedNotes.length} notes in total
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={view === 'grid' ? 'bg-muted' : ''}
                      onClick={() => setView('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={view === 'list' ? 'bg-muted' : ''}
                      onClick={() => setView('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    // onClick={handleCreateNote}
                    className="flex items-center gap-2"
                  >
                    <FilePenLine className="h-4 w-4" />
                    New Notes
                  </Button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search notes..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Tags className="h-4 w-4" />
                    Tags
                  </Button>
                </div>
              </div>

              {view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedNotes.map((note) => (
                    <div
                      key=""
                      className={`group relative flex flex-col rounded-lg border border-gray-200 bg-background  p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200`}
                      onClick={() => handleNoteClick(note._id)}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <File className="h-5 w-5 text-gray-500 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {note.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            {/* <span>Edited {formatDate(note.lastEdited)}</span> */}
                          </div>
                        </div>
                      </div>

                      {/* <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {note.content}
                      </p> */}

                      <div className="flex flex-wrap gap-2 mt-auto">
                        {/* {note.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                          >
                            {tag}
                          </span>
                        ))} */}
                      </div>

                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            // handleEditNote(note.id);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-gray-500 hover:text-red-500 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle more options
                          }}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // List View - keeping your original list design
                <div className="space-y-2">
                  {sortedNotes.map((note) => (
                    <div
                      key=""
                      className="group flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                      onClick={() => handleNoteClick(note)}
                    >
                      <File className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">{note.title}</h3>
                        {/* <p className="text-sm text-gray-600 line-clamp-1">{note.content}</p> */}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                          {/* {note.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                            >
                              {tag}
                            </span>
                          ))} */}
                        </div>
                        <div className="text-sm text-gray-500">
                          {/* {formatDate(note.lastEdited)} */}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-500 hover:bg-gray-100"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Empty State
            <div className="flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
              <div className="mx-auto max-w-md text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <FilePenLine className="h-6 w-6 text-primary" />
                </div>
                <h2 className="mb-2 text-xl font-semibold">No collections yet</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Create your first collection to get started with organizing your documents.
                </p>
                <Button
                  // onClick={handleCreateNote} 
                  className="w-full">
                  Create New Collection
                </Button>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}