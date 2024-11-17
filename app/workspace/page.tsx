// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


"use client";
export const dynamic = 'force-dynamic';
export const maxDuration = 60;


import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, PanelRightClose } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

// Dynamically import components
import ChatArea from "@/components/chatArea";
import NoteArea from "@/components/noteArea";

// Define types for the messages state
interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Page() {
  // State to control chat visibility
  const [showChat, setShowChat] = useState<boolean>(true);

  // State to store the chat messages
  const [messages, setMessages] = useState<Message[]>([]);

//   // Function to handle chat requests
//   const handleChat = async (messages: Message[]) => {
//     console.log('I got called up bro');

//     // Fetch the chat response from the server
//     const chatRes = await fetch("/api/getChat", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ messages }),
//     });

//     // If the response is not successful, throw an error
//     if (!chatRes.ok) {
//       throw new Error(chatRes.statusText);
//     }

//     // Readable stream from the server response body
//     const data = chatRes.body;
//     console.log('This is the readable data', data);

//     if (!data) {
//       return;
//     }

//     let fullAnswer = ""; // To accumulate the full response

//     // Function to handle each event chunk
//     const onParse = (event: ParsedEvent | ReconnectInterval) => {
//       if (event.type === "event") {
//         const data = event.data;
//         try {
//           // Parse the response and extract the text
//           const text = JSON.parse(data).text ?? "";
//           fullAnswer += text;

//           // Update messages with the new content
//           setMessages((prev) => {
//             const lastMessage = prev[prev.length - 1];
//             // Check if the last message is from the assistant and update or add a new message
//             if (lastMessage.role === "assistant") {
//               return [
//                 ...prev.slice(0, -1),
//                 { ...lastMessage, content: lastMessage.content + text },
//               ];
//             } else {
//               return [...prev, { role: "assistant", content: text }];
//             }
//           });
//         } catch (e) {
//           console.error('Error parsing event data', e);
//         }
//       }
//     };

//     // Set up a reader for the stream and parser to handle chunks of data
//     const reader = data.getReader();
//     const decoder = new TextDecoder();
//     const parser = createParser(onParse);
//     let done = false;

//     // Read the data in chunks until done
//     while (!done) {
//       const { value, done: doneReading } = await reader.read();
//       done = doneReading;
//       const chunkValue = decoder.decode(value);
//       parser.feed(chunkValue);
//     }
//   };


const handleChat = async (messages: Message[]) => {
    try {
      console.log('Initiating chat request');
  
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
  
      // Create a function to process each chunk of data
      const processChunk = (chunk: string) => {
        try {
          // Check if the chunk is a valid JSON string
          if (chunk.startsWith('data: ')) {
            const jsonStr = chunk.slice(6); // Remove 'data: ' prefix
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
          console.log('Problematic chunk:', chunk);
        }
      };
  
      let buffer = '';
      try {
        while (true) {
          const { value, done } = await reader.read();
          
          if (done) {
            // Process any remaining buffer data
            if (buffer) {
              processChunk(buffer);
            }
            break;
          }
  
          // Decode the chunk and add to buffer
          const chunkText = decoder.decode(value, { stream: true });
          buffer += chunkText;
  
          // Process complete messages in buffer
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep the incomplete line in buffer
  
          // Process each complete line
          for (const line of lines) {
            if (line.trim()) {
              processChunk(line.trim());
            }
          }
        }
      } catch (error) {
        console.error('Error reading stream:', error);
        throw error;
      } finally {
        reader.releaseLock();
      }
  
    } catch (error) {
      console.error('Chat request failed:', error);
      // Handle the error appropriately in your UI
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again."
        }
      ]);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header section */}
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
              onClick={() => setShowChat(!showChat)} // Toggle chat visibility
              className="h-8 w-8"
            >
              {showChat ? <PanelRightClose className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex flex-1 gap-4 p-4 pt-0">
          {/* Left Side: Note editor */}
          <NoteArea />

          {/* Right Side: Chat area, visible based on `showChat` state */}
          {showChat && <ChatArea  handleChat={handleChat} messages={messages} setMessages={setMessages} />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
