"use client";

import React, { useState } from "react";
import MDEditor from "@uiw/react-markdown-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";
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
import NotebookMarkdownEditor from "@/components/NotebookMarkdownEditor";

export default function NotebookPage() {
    const [markdown, setMarkdown] = useState(`# Welcome to Your Notebook

## Getting Started

Write your markdown here. Each section will be rendered as a separate block.

- Create notes
- Organize thoughts
- Visualize ideas`);

    const [isEditing, setIsEditing] = useState(false); // Track if in edit mode

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
                                    <BreadcrumbPage>Workspace</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
                    {/* <div className="flex-grow" data-color-mode="light">
                        {isEditing ? (
                            <MDEditor
                                value={markdown}
                                onChange={(value) => setMarkdown(value || "")}
                                height="100%"
                                previewWidth="50%"
                                enablePreview={true}
                                className="h-full"
                                onBlur={() => setIsEditing(false)} // Exit edit mode when the editor loses focus
                            />
                        ) : (
                            <div
                                className="h-full overflow-auto p-4 bg-background"
                                onDoubleClick={() => setIsEditing(true)} // Enter edit mode on double-click
                            >
                                <MarkdownPreview source={markdown} />
                            </div>
                        )}
                    </div> */}
                    <NotebookMarkdownEditor />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
