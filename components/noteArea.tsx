import React, { useState, useEffect, useCallback, useRef } from 'react';
import { unified } from 'unified';

import dynamic from "next/dynamic";
import { Bookmark, FileDown, FilePenLine, X, SparklesIcon, RefreshCcw, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import jsPDF from 'jspdf';
import MarkdownPreview from "@uiw/react-markdown-preview";
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import { useTheme } from 'next-themes';

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";

// Dynamically import the markdown editor to reduce initial bundle size
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const TextSelectionToolbar = ({
    selectedText,
    editorRef,
    onExplain,
    onImprove,
    onCopy
}) => {
    const toolbarRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const calculatePosition = () => {
            if (!editorRef.current) return;

            const selection = window.getSelection();
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const editorRect = editorRef.current.getBoundingClientRect();

            const top = rect.bottom - editorRect.top + 10;
            let left = rect.left - editorRect.left;
            const toolbarWidth = 250;
            left = Math.max(0, Math.min(left, editorRect.width - toolbarWidth));

            setPosition({ top, left });
        };

        if (selectedText) {
            calculatePosition();
        }
    }, [selectedText, editorRef]);

    if (!selectedText) return null;

    return (
        <div
            ref={toolbarRef}
            className={`absolute z-50 ${resolvedTheme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-xl shadow-lg flex items-center space-x-1`}
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                minWidth: '200px'
            }}
        >
            <button
                className={`flex-1 ${resolvedTheme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} p-2 rounded-lg transition flex items-center justify-center space-x-1 group`}
                onClick={() => onExplain(selectedText)}
                title="Explain"
            >
                <SparklesIcon className={`w-3 h-3 ${resolvedTheme === 'dark' ? 'text-gray-400 group-hover:text-gray-100' : 'text-gray-600 group-hover:text-black'} transition`} />
                <span className="text-xs group-hover:text-current transition hidden md:inline">Explain</span>
            </button>
            <div className={`h-3 w-px ${resolvedTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} mx-1`}></div>
            <button
                className={`flex-1 ${resolvedTheme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} p-2 rounded-lg transition flex items-center justify-center space-x-1 group`}
                onClick={() => onImprove(selectedText)}
                title="Improve"
            >
                <RefreshCcw className={`w-3 h-3 ${resolvedTheme === 'dark' ? 'text-gray-400 group-hover:text-gray-100' : 'text-gray-600 group-hover:text-black'} transition`} />
                <span className="text-xs group-hover:text-current transition hidden md:inline">Improve</span>
            </button>
        </div>
    );
};

const NoteArea = ({ 
    initialContent = '', 
    initialTitle = '', 
    copiedText, 
    selectedNote,
    // onNoteCreated, // Optional callback when note is created/updated
}) => {
    const [content, setContent] = useState(initialContent);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [noteTitle, setNoteTitle] = useState(initialTitle);
    const [savedNotes, setSavedNotes] = useState([]);
    const [selectedText, setSelectedText] = useState('');
    const editorRef = useRef(null);
    const [currentNoteId, setCurrentNoteId] = useState(null);

    const createNote = useMutation(api.notes.createNote);
    const updateNote = useMutation(api.notes.updateNote);
    const { setTheme, resolvedTheme } = useTheme();

    const handleChange = useCallback((value) => {
        setContent(value || '');
    }, []);

    useEffect(() => {
        // Update content if initialContent changes from parent
        if (initialContent) {
            setContent(initialContent);
        }
    }, [initialContent]);

    useEffect(() => {
        // Update title if initialTitle changes from parent
        if (initialTitle) {
            setNoteTitle(initialTitle);
        }
    }, [initialTitle]);

    useEffect(() => {
        if (copiedText) {
            const newContent = content.length > 0 ? content + '\n\n' + copiedText : copiedText;
            setContent(newContent);
        }
    }, [copiedText]);

    useEffect(() => {
        const existingNotes = JSON.parse(localStorage.getItem('savedNotes')) || [];
        setSavedNotes(existingNotes);
    }, []);

    useEffect(() => {
        if (selectedNote) {
            loadNote(selectedNote);
        }
    }, [selectedNote]);

    const loadNote = (note) => {
        setNoteTitle(note.title);
        setContent(note.content);
        setCurrentNoteId(note._id || null);
    };

    const handleTextSelection = useCallback((event) => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        setSelectedText(selectedText);
    }, []);

    const handleSave = async () => {
        if (!noteTitle.trim()) {
            toast.error("Please enter a document title");
            return;
        }
        try {
            const slug = slugify(noteTitle);
            let result;
            console.log('Current noet id', currentNoteId)
            if (currentNoteId) {
                result = await updateNote({
                    noteId: currentNoteId,
                    title: noteTitle,
                    content: content,
                });
                toast.success("Note updated successfully!");
            } else {
                result = await createNote({
                    title: noteTitle,
                    content: content,
                    slug,
                });
                setCurrentNoteId(result);
                toast.success("Note created successfully!");
            }

            // Call the optional callback if provided
            // if (onNoteCreated) {
            //     onNoteCreated({
            //         id: currentNoteId || result,
            //         title: noteTitle,
            //         content: content,
            //         slug
            //     });
            // }
        } catch (error) {
            toast.error("Failed to save note: " + error.message);
        }
    };

    // Placeholder functions - you'll need to implement these based on your app's requirements
    const handleExplain = (text) => {
        // Implement explanation logic
        toast.info("Explaining: " + text);
    };

    const handleImprove = (text) => {
        // Implement improvement logic
        toast.info("Improving: " + text);
    };

    const handleCopyText = (text) => {
        // Implement copy logic
        navigator.clipboard.writeText(text);
        toast.success("Text copied!");
    };

    const downloadAsPdf = () => {
        // Implement PDF download logic
        const doc = new jsPDF();
        doc.text(noteTitle, 10, 10);
        doc.text(content, 10, 20);
        doc.save(`${noteTitle || 'untitled'}.pdf`);
    };

    return (
        <div className="h-full">
            <div className="max-w-5xl mx-auto relative">
                <Card className="bg-background/80 backdrop-blur-sm border shadow-lg rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                        {(content.length > 0 || initialContent) ? (
                            <div className="flex flex-col h-[calc(100vh-5rem)]">
                                <div className={`flex items-center justify-between p-4 border-b ${resolvedTheme === 'dark' ? 'bg-gray-900/50' : 'bg-white/50'}`}>
                                    <input
                                        type="text"
                                        placeholder="Untitled Document"
                                        className={`text-2xl font-bold bg-transparent outline-none flex-1 transition duration-300 focus:placeholder-gray-500 ${resolvedTheme === 'dark' ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                                        value={noteTitle}
                                        onChange={(e) => setNoteTitle(e.target.value)}
                                    />

                                    <div className="flex space-x-4 text-muted-foreground">
                                        <button
                                            title="Save"
                                            onClick={handleSave}
                                            className="hover:text-foreground transition transform hover:scale-110"
                                        >
                                            <Bookmark className="w-6 h-6" />
                                        </button>
                                        <button
                                            title="Download"
                                            onClick={downloadAsPdf}
                                            className="hover:text-foreground transition transform hover:scale-110"
                                        >
                                            <FileDown className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                <div
                                    ref={editorRef}
                                    className="flex-1 overflow-hidden relative"
                                    onMouseUp={handleTextSelection}
                                    data-color-mode={resolvedTheme}
                                >
                                    <MDEditor
                                        value={content}
                                        onChange={handleChange}
                                        preview="preview"
                                        height="100%"
                                        visibleDragbar={false}
                                    />

                                    <TextSelectionToolbar
                                        selectedText={selectedText}
                                        editorRef={editorRef}
                                        onExplain={handleExplain}
                                        onImprove={handleImprove}
                                        onCopy={handleCopyText}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="h-[calc(100vh-3rem)] flex items-center justify-center">
                                <div className="text-center p-8 bg-background/50 rounded-xl border-2 border-dashed">
                                    <h2 className="text-2xl font-semibold">No document selected</h2>
                                    <p className="text-muted-foreground text-sm mt-2">Create or open an existing note to get started.</p>
                                    <Button
                                        size="sm"
                                        className="mt-4"
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        <FilePenLine className="mr-2 w-4 h-4" />
                                        Create New
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NoteArea;