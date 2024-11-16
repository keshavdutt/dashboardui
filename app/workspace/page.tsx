"use client"
import { AppSidebar } from "@/components/app-sidebar"
import { useState } from "react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Bookmark, FileDown, FilePenLine, MessageCircle, NotebookText, PanelRightClose } from "lucide-react"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
    const [showChat, setShowChat] = useState(true)

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
                    <div className={`flex-1 flex flex-col min-h-[100vh] rounded-xl bg-muted/50 md:min-h-min p-4 space-y-4 ${showChat ? '' : 'w-full'}`}>
                        {/* Title Area */}
                        <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                            <input
                                type="text"
                                placeholder="Untitled Document"
                                className="text-2xl font-bold bg-transparent outline-none text-white flex-1"
                            />

                            <div className="flex space-x-4 text-gray-400">
                                <button
                                    title="Edit"
                                    className="hover:text-white transition"
                                >
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m0 0l7 7-7 7m0-14v14" />
                                    </svg> */}
                                    <FilePenLine className="w-6 h-6" />
                                </button>
                                <button
                                    title="Bookmark"
                                    className="hover:text-white transition"
                                >
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v16l7-5 7 5V3a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
                                    </svg> */}
                                     <Bookmark className="w-6 h-6" />
                                </button>
                                <button
                                    title="Download"
                                    className="hover:text-white transition"
                                >
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v4m0 0H8m4 0h4m-4-8v4m0 0H8m4 0h4m0 0l-4-4m4 0L12 4M4 20h16" />
                                    </svg> */}
                                     <FileDown className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <textarea
                            placeholder="Start writing here..."
                            className="flex-1 bg-transparent outline-none text-gray-300 resize-none text-base leading-relaxed"
                            rows={20}
                        ></textarea>
                    </div>

                    {/* Right Side (Chatbot) */}
                    {showChat && (
                        <div className="flex-1 flex flex-col min-h-[100vh] rounded-xl bg-muted/50 md:min-h-min p-4">
                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto space-y-4">
                                <div className="space-y-4">
                                    <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
                                        Hi, how can I help you today?
                                    </div>

                                    <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-primary text-primary-foreground">
                                        Hey, I'm having trouble with my account.
                                    </div>

                                    <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted">
                                        What seems to be the problem?
                                    </div>

                                    <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-primary text-primary-foreground">
                                        I can't log in.
                                    </div>
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="mt-4 flex items-center space-x-2">
                                <input
                                    type="text"
                                    className="flex-1 rounded-lg bg-gray-700 text-white px-4 py-2 focus:outline-none"
                                    placeholder="Type your message..."
                                />
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                    Send
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}