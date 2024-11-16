// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck


"use client";

import { ArrowLeft, ArrowRight, Bookmark, Copy, Share2 } from 'lucide-react';
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';  // Add this import


interface ChatAreaProps {
    handleChat: (messages: { role: string; content: string }[]) => void;
    messages: { role: string; content: string }[];
    setMessages: React.Dispatch<React.SetStateAction<{ role: string; content: string }[]>>;
    setCopiedText: (text: string) => void;
}

const ChatArea = ({ handleChat, messages, setMessages, setCopiedText }: ChatAreaProps) => {

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollableContainerRef = useRef<HTMLDivElement>(null);
    const chatAreaRef = useRef<HTMLDivElement>(null);
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [selectedText, setSelectedText] = useState('');
    const [showSendButton, setShowSendButton] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
    const [initialText, setInitialText] = useState('Ask Something');

    // Improved scroll to bottom function with smooth behavior
    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        const scrollContainer = scrollableContainerRef.current;
        if (scrollContainer) {
            scrollContainer.scrollTo({
                top: scrollContainer.scrollHeight,
                behavior: behavior
            });
        }
    };

    // Check if user is near bottom
    const checkIfNearBottom = () => {
        const container = scrollableContainerRef.current;
        if (container) {
            const threshold = 100; // pixels from bottom
            const isNear = container.scrollHeight - (container.scrollTop + container.clientHeight) < threshold;
            setIsNearBottom(isNear);
        }
    };

    // Handle scroll events
    useEffect(() => {
        const container = scrollableContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkIfNearBottom);
            return () => container.removeEventListener('scroll', checkIfNearBottom);
        }
    }, []);

    // Handle new messages
    useEffect(() => {
        if (messages.length > 0) {
            // Always scroll to bottom on user message
            if (messages[messages.length - 1].role === 'user') {
                scrollToBottom('instant');
            }
            // Scroll to bottom on assistant message only if user was near bottom
            else if (isNearBottom) {
                // Add a small delay to ensure content is rendered
                setTimeout(() => scrollToBottom(), 100);
            }
        }
    }, [messages, isNearBottom]);

    // Initial scroll to bottom
    useEffect(() => {
        scrollToBottom('instant');
    }, []);

    const handleTextSelection = () => {
        const selected = window.getSelection();
        if (selected && selected.toString().trim()) {
            const range = selected.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const chatAreaRect = chatAreaRef.current?.getBoundingClientRect();

            if (chatAreaRect &&
                rect.top >= chatAreaRect.top &&
                rect.bottom <= chatAreaRect.bottom &&
                rect.left >= chatAreaRect.left &&
                rect.right <= chatAreaRect.right) {
                setSelectedText(selected.toString());
                setButtonPosition({
                    top: rect.top + window.scrollY + rect.height + 5,
                    left: rect.left + window.scrollX,
                });
                setShowSendButton(true);
            }
        } else {
            setShowSendButton(false);
        }
    };

    useEffect(() => {
        document.addEventListener('selectionchange', handleTextSelection);
        return () => document.removeEventListener('selectionchange', handleTextSelection);
    }, []);

    const handleSendToNotes = () => {
        setCopiedText(selectedText);
        setShowSendButton(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        setInitialText('Follow up question');
        if (e.key === "Enter") {
            if (e.shiftKey) {
                return;
            } else {
                e.preventDefault();
                onSubmit();
            }
        }
    };

    function onSubmit() {
        if (!inputValue.trim()) return;
        const latestMessages = [...messages, { role: "user", content: inputValue }];
        setInputValue("");
        setMessages(latestMessages);
        handleChat(latestMessages);
    }

    return (
        <div ref={chatAreaRef} className="w-1/2  h-[calc(100vh-80px)] ">
            <div className="flex flex-col h-full border border-solid border-gray-700 rounded-lg bg-muted/50 shadow-lg overflow-hidden">
                <div
                    ref={scrollableContainerRef}
                    className="flex-1 p-6 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800"
                >
                    {messages.length > 0 ? (
                        <div className="space-y-6">
                            {messages.map((message, index) =>
                                message.role === "assistant" ? (
                                    <div key={index} className="break-words text-gray-100 text-base">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            className="prose prose-lg prose-invert max-w-none overflow-x-auto
                                                     prose-headings:text-gray-100 prose-h1:text-2xl prose-h2:text-xl
                                                     prose-p:text-gray-200 prose-p:text-base leading-relaxed
                                                     prose-strong:text-gray-100
                                                     prose-code:text-gray-100 prose-code:text-base
                                                     prose-pre:bg-gray-800 prose-pre:text-base
                                                     prose-a:text-blue-400
                                                     prose-blockquote:text-gray-300 prose-blockquote:text-base
                                                     prose-blockquote:border-gray-700
                                                     prose-li:text-base
                                                     [&_table]:border-collapse
                                                     [&_table]:w-full
                                                     [&_table]:my-4
                                                     [&_th]:border
                                                     [&_th]:border-gray-700
                                                     [&_th]:bg-gray-800
                                                     [&_th]:p-2
                                                     [&_th]:text-left
                                                     [&_td]:border
                                                     [&_td]:border-gray-700
                                                     [&_td]:p-2
                                                     [&_tr:hover]:bg-gray-800/50
                                                     [&_thead]:bg-gray-800
                                                     [&_thead_tr]:border-b-2
                                                     [&_thead_tr]:border-gray-700
                                                     [&_table]:rounded-lg
                                                     [&_tbody_tr:last-child_td:first-child]:rounded-bl-lg
                                                     [&_tbody_tr:last-child_td:last-child]:rounded-br-lg
                                                     [&_thead_tr_th:first-child]:rounded-tl-lg
                                                     [&_thead_tr_th:last-child]:rounded-tr-lg"
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <div key={index} className="flex justify-end">
                                        <p className="max-w-[80%] rounded-lg bg-blue-600 p-4 break-words text-white text-base">
                                            {message.content}
                                        </p>
                                    </div>
                                )
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-gray-400 text-lg">Ask questions to start learning</p>
                        </div>
                    )}
                </div>

                {/* Rest of the component remains the same */}
                <div className="p-4 border-t border-gray-700 bg-gray-800">
                    <div className="flex gap-2">
                        <textarea
                            placeholder={initialText}
                            className="flex-1 p-4 bg-gray-700 text-white text-base placeholder-gray-400 border-none 
                                     rounded-lg resize-none focus:outline-none focus:ring-2 
                                     focus:ring-blue-500"
                            value={inputValue}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setInputValue(e.target.value)}
                            rows={1}
                        />
                        <button
                            className="px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg 
                                     hover:bg-blue-700 transition-colors disabled:opacity-50 
                                     disabled:cursor-not-allowed"
                            onClick={onSubmit}
                            disabled={!inputValue.trim()}
                        >
                            Send
                        </button>
                    </div>
                </div>

                {/* Enhanced Floating Action Bar */}
                {showSendButton && (
                    <div
                        className="fixed z-50 flex items-center gap-2 p-2 bg-gray-800 border border-gray-700 
                                 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-95 transition-all duration-200 
                                 transform hover:scale-102"
                        style={{
                            top: buttonPosition.top,
                            left: buttonPosition.left,
                        }}
                    >
                        <button
                            onClick={handleSendToNotes}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md
                                     hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            <ArrowLeft size={16} />
                            <span>Send to Notes</span>
                        </button>

                        <div className="h-4 w-px bg-gray-700" /> {/* Divider */}

                        <button
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md 
                                     transition-colors"
                            title="Copy to clipboard"
                        >
                            <Copy size={16} />
                        </button>

                        <button
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md 
                                     transition-colors"
                            title="Save for later"
                        >
                            <Bookmark size={16} />
                        </button>

                        <button
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md 
                                     transition-colors"
                            title="Share"
                        >
                            <Share2 size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatArea;