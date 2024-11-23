"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SignIn, SignInButton, useAuth, useUser } from "@clerk/nextjs";

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
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
    MessageCircle,
    PanelRightClose,
    Save,
    Clock,
    Tags,
    Settings
} from "lucide-react";

import ChatArea from "@/components/chatArea";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import NotebookMarkdownEditor from "@/components/NotebookMarkdownEditor";

const NoteArea = dynamic(() => import('@/components/noteArea'), { ssr: false });

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function WorkspacePage() {
    // Replace getAuth with useAuth hook for client components
    const { userId, isLoaded } = useAuth();
    const { user } = useUser();
    console.log('this is the suer', user)
    const pathname = usePathname();
    const [showChat, setShowChat] = useState<boolean>(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [saving, setSaving] = useState<boolean>(false);
    const [selectedNoteContent, setSelectedNoteContent] = useState("");
    const [copiedText, setCopiedText] = useState('');


    // Show loading state while auth is being checked
    if (!isLoaded) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    // Show SignIn component if user is not authenticated
    if (!userId) {
        return (
            <div className="flex items-center justify-center h-screen">
                <SignInButton />
            </div>
        );
    }



    const handleChat = async (messages: Message[]) => {
        try {
            const chatRes = await fetch("/api/getChat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages }),
            });

            if (!chatRes.ok) {
                throw new Error(`HTTP error! status: ${chatRes.status} ${chatRes.statusText}`);
            }

            const data = chatRes.body;
            if (!data) {
                throw new Error("No response data received");
            }

            let fullAnswer = "";
            const reader = data.getReader();
            const decoder = new TextDecoder();

            const processChunk = (chunk: string) => {
                try {
                    if (chunk.startsWith('data: ')) {
                        const jsonStr = chunk.slice(6);
                        const jsonData = JSON.parse(jsonStr);

                        if (jsonData.text) {
                            fullAnswer += jsonData.text;
                            setMessages((prev) => {
                                const lastMessage = prev[prev.length - 1];
                                if (lastMessage?.role === "assistant") {
                                    return [
                                        ...prev.slice(0, -1),
                                        { ...lastMessage, content: fullAnswer }
                                    ];
                                } else {
                                    return [...prev, { role: "assistant", content: jsonData.text }];
                                }
                            });
                        }
                    }
                } catch (e) {
                    console.error('Error processing chunk:', e);
                }
            };

            let buffer = '';
            try {
                while (true) {
                    const { value, done } = await reader.read();

                    if (done) {
                        if (buffer) {
                            processChunk(buffer);
                        }
                        break;
                    }

                    const chunkText = decoder.decode(value, { stream: true });
                    buffer += chunkText;

                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.trim()) {
                            processChunk(line.trim());
                        }
                    }
                }
            } finally {
                reader.releaseLock();
            }

        } catch (error) {
            console.error('Chat request failed:', error);
            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: "I apologize, but I encountered an error. Please try again."
                }
            ]);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
    };

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

                        <div className="ml-auto flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="hidden md:flex items-center gap-2"
                                onClick={handleSave}
                            >
                                {saving ? (
                                    <span className="animate-spin">⌛</span>
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Save
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="hidden md:flex items-center gap-2"
                            >
                                <Clock className="h-4 w-4" />
                                History
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="hidden md:flex items-center gap-2"
                            >
                                <Tags className="h-4 w-4" />
                                Tags
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                            <Separator orientation="vertical" className="h-6" />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowChat(!showChat)}
                                className={`h-8 w-8 ${showChat ? 'bg-muted' : ''}`}
                            >
                                {showChat ? (
                                    <PanelRightClose className="h-4 w-4" />
                                ) : (
                                    <MessageCircle className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        {/* User Information */}
                        {/* <div className="ml-auto flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <img
                                    src={user?.imageUrl}
                                    className="h-8 w-8 rounded-full"
                                />
                                <span className="text-sm">{user?.firstName || "Anonymous User"}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowChat(!showChat)}
                                className={`h-8 w-8 ${showChat ? 'bg-muted' : ''}`}
                            >
                                {showChat ? (
                                    <PanelRightClose className="h-4 w-4" />
                                ) : (
                                    <MessageCircle className="h-4 w-4" />
                                )}
                            </Button>
                        </div> */}
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
                    {/* Note Area */}
                    <div className={`flex-1 overflow-auto transition-all ${showChat ? 'mr-[600px]' : 'mr-0'}`}>
                        <div className="h-full p-2">
                            <NoteArea copiedText={copiedText} />
                            {/* <NotebookMarkdownEditor /> */}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div
                        className={`fixed right-0 top-16 bottom-0 w-[600px] border-l bg-background/95 backdrop-blur transition-all duration-300 ease-in-out ${showChat ? 'translate-x-0' : 'translate-x-full'
                            }`}
                    >
                        {showChat && (
                            <ChatArea
                                handleChat={handleChat}
                                messages={messages}
                                setMessages={setMessages}
                                setCopiedText={setCopiedText}
                            />
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}