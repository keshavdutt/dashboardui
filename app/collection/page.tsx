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
    File,
    Clock,
} from "lucide-react";

export default function CollectionPage() {
    //   const collection = []; // Empty for placeholder, add notes array to show list view
    // Uncomment below to see the grid view

    const collection = [
        {
            id: 1,
            title: "Meeting Notes",
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
        },
        {
            id: 3,
            title: "Meeting Notes",
            content: "Discuss project deadlines and deliverables.",
            lastEdited: "2024-03-15T10:30:00",
            color: "bg-blue-500/10"
        }
        // Add more notes as needed
    ];


    const handleCreateNote = () => {
        window.location.href = '/dashboard';
    };

    const handleEditNote = (noteId) => {
        window.location.href = `/dashboard?id=${noteId}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* Header Section */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 bg-gray-900 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
                                    <BreadcrumbPage>Collection</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto bg-gray-900">
                    {collection.length > 0 ? (
                        <div className="p-6">
                            {/* Page Header */}
                            <div className="mb-6 flex items-center justify-between">
                                <h1 className="text-2xl font-bold text-white">My Collection</h1>
                                <Button
                                    onClick={handleCreateNote}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                                >
                                    <FilePlus className="h-4 w-4" />
                                    New Collection
                                </Button>
                            </div>

                            {/* Notes Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {collection.map((note) => (
                                    <div
                                        key={note.id}
                                        className={`group relative flex flex-col rounded-lg border border-gray-800 ${note.color || 'bg-gray-800/50'} p-4 hover:border-gray-700 cursor-pointer transition-all duration-200`}
                                        onClick={() => handleEditNote(note.id)}
                                    >
                                        {/* Note Icon and Title */}
                                        <div className="flex items-start gap-3 mb-2">
                                            <File className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-white truncate">
                                                    {note.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                                    <Clock className="h-3 w-3" />
                                                    <span>Edited {formatDate(note.lastEdited)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Note Preview */}
                                        <p className="text-sm text-gray-400 line-clamp-2 flex-1">
                                            {note.content}
                                        </p>

                                        {/* Action Buttons */}
                                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditNote(note.id);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-gray-700"
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
                                                className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
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
                        </div>
                    ) : (
                        // Empty State
                        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-6 text-center">
                            <div className="rounded-lg border border-gray-800 bg-gray-900 p-8 shadow-lg max-w-md w-full">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
                                    <FilePlus className="h-6 w-6 text-blue-500" />
                                </div>
                                <h2 className="mb-2 text-xl font-semibold text-white">
                                    No Collection yet
                                </h2>
                                <p className="mb-6 text-sm text-gray-400">
                                    Create your first collection to get started with organizing your thoughts and ideas.
                                </p>
                                <Button
                                    onClick={handleCreateNote}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
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