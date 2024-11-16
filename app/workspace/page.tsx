"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { useState } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, PanelRightClose } from "lucide-react";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill
import ChatArea from "@/components/chatArea";
import NoteArea from "@/components/noteArea";


export default function Page() {
    const [showChat, setShowChat] = useState(true);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
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
                    <div className="ml-auto mr-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowChat(!showChat)}
                            className="h-8 w-8"
                        >
                            {showChat ? <PanelRightClose className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
                        </Button>
                    </div>
                </header>

                <div className="flex flex-1 gap-4 p-4 pt-0">
                    {/* Left Side (Editor) */}
                    <NoteArea />

                    {/* Right Side (Chatbot) */}
                    {showChat && (
                        <ChatArea />
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
