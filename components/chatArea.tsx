"use client";

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

import { ArrowLeft, Bookmark, Copy, Share2, MoreHorizontal } from 'lucide-react';
import React, { useState, useEffect, useRef, KeyboardEvent, useMemo } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

interface ChatAreaProps {
    handleChat: (messages: { role: string; content: string }[]) => void;
    messages: { role: string; content: string }[];
    setMessages: React.Dispatch<React.SetStateAction<{ role: string; content: string }[]>>;
    setCopiedText: (text: string) => void;
}

// Block component for rendering individual blocks with hover actions
const BlockWithActions = React.memo(({ 
    content, 
    onCopy, 
    className = '' 
}: { 
    content: string, 
    onCopy: () => void, 
    className?: string 
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const blockRef = useRef<HTMLDivElement>(null);

    const handleCopy = () => {
        const listFixedContent = content
            .split('\n')
            .map(line => {
                const listItemMatch = line.match(/^\s*(\*+)\s*(.+)$/);
                if (listItemMatch) {
                    return `* ${listItemMatch[2].trim()}`;
                }
                return line;
            })
            .join('\n')
            .trim();

        navigator.clipboard.writeText(listFixedContent);
        onCopy();
    };

    return (
        <div 
            ref={blockRef}
            className={`relative group transition-colors duration-200 
                        ${isHovered ? 'bg-gray-100' : 'bg-transparent'}
                        ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="prose prose-sm max-w-none overflow-x-auto
                           prose-headings:text-gray-900 prose-h1:text-xl prose-h2:text-lg
                           prose-p:text-gray-700 prose-p:text-sm leading-relaxed
                           prose-strong:text-gray-900
                           prose-code:text-gray-800 prose-code:text-sm
                           prose-pre:bg-gray-100 prose-pre:text-sm
                           prose-a:text-blue-600
                           prose-blockquote:text-gray-600 prose-blockquote:text-sm
                           prose-blockquote:border-gray-300
                           prose-li:text-sm prose-li:text-gray-700
                           relative">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>
            
            <div className={`absolute top-0 right-0 z-10 flex items-center gap-1 
                            opacity-0 group-hover:opacity-70 hover:opacity-100 
                            transition-opacity duration-200 
                            pointer-events-none group-hover:pointer-events-auto`}>
                <button 
                    onClick={handleCopy}
                    className="p-1 bg-gray-200/80 text-gray-600 hover:text-gray-900 
                             rounded-md transition-colors"
                    title="Copy block"
                >
                    <Copy size={14} />
                </button>
                <button 
                    className="p-1 bg-gray-200/80 text-gray-600 hover:text-gray-900 
                             rounded-md transition-colors"
                    title="More options"
                >
                    <MoreHorizontal size={14} />
                </button>
            </div>
        </div>
    );
});

BlockWithActions.displayName = 'BlockWithActions';

const ChatArea = ({ handleChat, messages, setMessages, setCopiedText }: ChatAreaProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollableContainerRef = useRef<HTMLDivElement>(null);
    const chatAreaRef = useRef<HTMLDivElement>(null);

    const [isNearBottom, setIsNearBottom] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [initialText, setInitialText] = useState('Ask Something');

    // Message splitting logic remains the same
    const splitMessageIntoBlocks = (content: string) => {
        const blocks: string[] = [];
        const lines = content.split('\n');
        let currentBlock = '';
        let isCodeBlock = false;
        let isListBlock = false;

        lines.forEach((line, index) => {
            if (line.trim().startsWith('```')) {
                isCodeBlock = !isCodeBlock;
                currentBlock += line + '\n';
                
                if (!isCodeBlock && currentBlock.trim() !== '') {
                    blocks.push(currentBlock.trimEnd());
                    currentBlock = '';
                }
                return;
            }

            if (isCodeBlock) {
                currentBlock += line + '\n';
                return;
            }

            const isListItem = line.trim().match(/^[\d*+-]\s/);
            if (isListItem && !isListBlock) {
                isListBlock = true;
            }

            if (isListBlock) {
                currentBlock += line + '\n';

                const nextLineIsNotListItem = 
                    index === lines.length - 1 || 
                    !lines[index + 1].trim().match(/^[\d*+-]\s/);

                if (nextLineIsNotListItem) {
                    blocks.push(currentBlock.trimEnd());
                    currentBlock = '';
                    isListBlock = false;
                }
                return;
            }

            if (line.trim() === '' && currentBlock.trim() !== '') {
                blocks.push(currentBlock.trimEnd());
                currentBlock = '';
            } else if (line.trim() !== '') {
                currentBlock += line + '\n';
            }
        });

        if (currentBlock.trim() !== '') {
            blocks.push(currentBlock.trimEnd());
        }

        return blocks.filter(block => block.trim() !== '');
    };

    const processedMessages = useMemo(() => {
        return messages.map(message => {
            if (message.role === 'assistant') {
                return {
                    ...message,
                    blocks: splitMessageIntoBlocks(message.content)
                };
            }
            return message;
        });
    }, [messages]);

    // Scrolling logic remains the same
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

    const handleBlockCopy = (block: string) => {
        setCopiedText(block);
    };

    return (
        <div ref={chatAreaRef} className="h-full p-1 relative">
            <div className="flex flex-col h-full border border-solid border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                <div
                    ref={scrollableContainerRef}
                    className="flex-1 p-3 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                >
                    {processedMessages.length > 0 ? (
                        <div className="space-y-2">
                            {processedMessages.map((message, index) =>
                                message.role === "assistant" ? (
                                    <div key={index} className="space-y-2">
                                        {(message as any).blocks.map((block: string, blockIndex: number) => (
                                            <BlockWithActions 
                                                key={blockIndex}
                                                content={block}
                                                onCopy={() => handleBlockCopy(block)}
                                                className="p-2 rounded-lg"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div key={index} className="flex justify-end">
                                        <p className="max-w-[80%] rounded-lg bg-blue-600 p-2 break-words text-white text-sm">
                                            {message.content}
                                        </p>
                                    </div>
                                )
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <p className="text-gray-500 text-base">Ask questions to start learning</p>
                        </div>
                    )}
                </div>

                <div className="p-2 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-2">
                        <textarea
                            placeholder={initialText}
                            className="flex-1 p-2 bg-white text-gray-900 text-sm placeholder-gray-400 
                                     border border-gray-200 rounded-lg resize-none 
                                     focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={inputValue}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => setInputValue(e.target.value)}
                            rows={1}
                        />
                        <button
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg 
                                     hover:bg-blue-700 transition-colors disabled:opacity-50 
                                     disabled:cursor-not-allowed"
                            onClick={onSubmit}
                            disabled={!inputValue.trim()}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatArea;