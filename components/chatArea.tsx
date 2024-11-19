"use client";

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { ArrowLeft, Bookmark, Copy, Share2 } from 'lucide-react';
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

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
    const floatingBarRef = useRef<HTMLDivElement>(null);

    const [isNearBottom, setIsNearBottom] = useState(true);
    const [selectedText, setSelectedText] = useState('');
    const [showSendButton, setShowSendButton] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
    const [initialText, setInitialText] = useState('Ask Something');

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        const scrollContainer = scrollableContainerRef.current;
        if (scrollContainer) {
            scrollContainer.scrollTo({
                top: scrollContainer.scrollHeight,
                behavior: behavior
            });
        }
    };

    const checkIfNearBottom = () => {
        const container = scrollableContainerRef.current;
        if (container) {
            const threshold = 100;
            const isNear = container.scrollHeight - (container.scrollTop + container.clientHeight) < threshold;
            setIsNearBottom(isNear);
        }
    };

    useEffect(() => {
        const container = scrollableContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkIfNearBottom);
            return () => container.removeEventListener('scroll', checkIfNearBottom);
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            if (messages[messages.length - 1].role === 'user') {
                scrollToBottom('instant');
            }
            else if (isNearBottom) {
                setTimeout(() => scrollToBottom(), 100);
            }
        }
    }, [messages, isNearBottom]);

    useEffect(() => {
        scrollToBottom('instant');
    }, []);

    const calculatePosition = (selectionRect: DOMRect, chatAreaRect: DOMRect) => {
        const floatingBarWidth = 320;
        const floatingBarHeight = 56;
        const padding = 8;

        // Calculate position relative to the chat area's fixed container
        const top = selectionRect.top - chatAreaRect.top + padding;
        let left = selectionRect.left - chatAreaRect.left;

        // Ensure the floating bar stays within the chat area
        if (left + floatingBarWidth > chatAreaRect.width - padding) {
            left = chatAreaRect.width - floatingBarWidth - padding;
        }
        if (left < padding) {
            left = padding;
        }

        // Check if floating bar would go below visible area
        const bottomSpace = chatAreaRect.height - (top + floatingBarHeight);
        const finalTop = bottomSpace < padding ? top - floatingBarHeight - padding * 2 : top + selectionRect.height;

        return { 
            top: Math.max(padding, Math.min(finalTop, chatAreaRect.height - floatingBarHeight - padding)),
            left 
        };
    };

    const handleTextSelection = () => {
        const selected = window.getSelection();
        const chatArea = chatAreaRef.current;
        const scrollContainer = scrollableContainerRef.current;

        if (!selected || !chatArea || !scrollContainer) {
            setShowSendButton(false);
            return;
        }

        const selectedText = selected.toString().trim();
        if (!selectedText) {
            setShowSendButton(false);
            return;
        }

        const range = selected.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const chatAreaRect = chatArea.getBoundingClientRect();

        // Check if selection is within bounds
        if (rect.top >= chatAreaRect.top &&
            rect.bottom <= chatAreaRect.bottom &&
            rect.left >= chatAreaRect.left &&
            rect.right <= chatAreaRect.right) {
            
            const position = calculatePosition(rect, chatAreaRect);
            
            setSelectedText(selectedText);
            setButtonPosition(position);
            setShowSendButton(true);
        } else {
            setShowSendButton(false);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            document.addEventListener('selectionchange', handleTextSelection);
            // Hide floating bar when clicking outside
            const handleClickOutside = (e: MouseEvent) => {
                if (floatingBarRef.current && !floatingBarRef.current.contains(e.target as Node)) {
                    setShowSendButton(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('selectionchange', handleTextSelection);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, []);

    const handleSendToNotes = () => {
        setCopiedText(selectedText);
        setShowSendButton(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        setInitialText('Follow up question');
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    };

    const onSubmit = () => {
        if (!inputValue.trim()) return;
        const latestMessages = [...messages, { role: "user", content: inputValue }];
        setInputValue("");
        setMessages(latestMessages);
        handleChat(latestMessages);
    };

    return (
        <div ref={chatAreaRef} className="h-full p-2 relative">
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
                                                     prose-li:text-base"
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

                <div className="p-4 border-t border-gray-700 bg-gray-800">
                    <div className="flex gap-2">
                        <textarea
                            placeholder={initialText}
                            className="flex-1 p-4 bg-gray-700 text-white text-base placeholder-gray-400 border-none 
                                     rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={inputValue}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setInputValue(e.target.value)}
                            rows={1}
                        />
                        <button
                            className="px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg 
                                     hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={onSubmit}
                            disabled={!inputValue.trim()}
                        >
                            Send
                        </button>
                    </div>
                </div>

                {/* Floating Action Bar - Now positioned relative to chat area */}
                {showSendButton && (
                    <div
                        ref={floatingBarRef}
                        className="absolute z-50 flex items-center gap-2 p-2 bg-gray-800/95 border border-gray-700 
                                     rounded-lg shadow-lg backdrop-blur-sm transition-all duration-200"
                        style={{
                            top: `${buttonPosition.top}px`,
                            left: `${buttonPosition.left}px`,
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

                        <div className="h-4 w-px bg-gray-700" />

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