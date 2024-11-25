
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

    const mdEditorRef = useRef(null);
    const { resolvedTheme } = useTheme();





    useEffect(() => {
        const calculatePosition = () => {
            if (!editorRef.current) return;

            const selection = window.getSelection();
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const editorRect = editorRef.current.getBoundingClientRect();

            // Calculate positions
            const top = rect.bottom - editorRect.top + 10;
            let left = rect.left - editorRect.left;

            // Ensure toolbar stays within editor bounds
            const toolbarWidth = 250; // Estimated toolbar width
            left = Math.max(0, Math.min(left, editorRect.width - toolbarWidth));

            setPosition({
                top,
                left
            });
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

const NoteArea = ({ copiedText }) => {
    const [content, setContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [noteTitle, setNoteTitle] = useState('');
    const [savedNotes, setSavedNotes] = useState([]);
    const [selectedText, setSelectedText] = useState('');
    const editorRef = useRef(null);

    const [currentNoteId, setCurrentNoteId] = useState(null);


    // Convex mutations and queries
    const createNote = useMutation(api.notes.createNote);
    const updateNote = useMutation(api.notes.updateNote);

    const { setTheme, resolvedTheme } = useTheme()


    const handleChange = useCallback((value) => {
        setContent(value || '');
    }, []);

    useEffect(() => {
        if (copiedText) {
            const newContent = content.length > 0 ? content + '\n\n' + copiedText : copiedText;
            setContent(newContent);
        }
    }, [copiedText]);

    // Load saved notes on component mount
    useEffect(() => {
        const existingNotes = JSON.parse(localStorage.getItem('savedNotes')) || [];
        setSavedNotes(existingNotes);
    }, []);

    const handleTextSelection = useCallback((event) => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        setSelectedText(selectedText);
    }, []);

    const handleExplain = useCallback((text) => {
        // Placeholder for explanation logic
        console.log('Explaining:', text);
        // You would typically implement an API call or AI service here
        alert('Explanation feature coming soon!');
    }, []);

    const handleImprove = useCallback((text) => {
        // Placeholder for improvement logic
        console.log('Improving:', text);
        // You would typically implement an API call or AI service here
        alert('Improvement feature coming soon!');
    }, []);

    const handleCopyText = useCallback((text) => {
        navigator.clipboard.writeText(text);
        alert('Text copied to clipboard!');
    }, []);

    const downloadAsPdf = useCallback(() => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Convert markdown to HTML
        const htmlContent = unified()
            .use(remarkParse)
            .use(remarkHtml)
            .processSync(content)
            .toString();

        // Create temporary div and set HTML content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const textContent = tempDiv.textContent || tempDiv.innerText;



        // Split text into lines
        const lines = doc.splitTextToSize(textContent, pageWidth - 40);

        let y = 20;
        lines.forEach((line) => {
            if (y + 12 > pageHeight) {
                y = 20;
                doc.addPage();
            }
            doc.text(line, 20, y);
            y += 12;
        });

        doc.save(noteTitle ? `${noteTitle}.pdf` : 'markdown-note.pdf');
    }, [content, noteTitle]);

    const saveToLocalStorage = useCallback(() => {
        const existingNotes = JSON.parse(localStorage.getItem('savedNotes')) || [];
        const noteIndex = existingNotes.findIndex(note => note.title === noteTitle);

        if (noteIndex > -1) {
            existingNotes[noteIndex].content = content;
        } else {
            existingNotes.push({ title: noteTitle || 'Untitled', content });
        }

        localStorage.setItem('savedNotes', JSON.stringify(existingNotes));
        setSavedNotes(existingNotes);
        setIsModalOpen(false);
        setNoteTitle('');
    }, [noteTitle, content]);

    const handleSave = async () => {
        if (!noteTitle.trim()) {
            toast.error("Please enter a document title");
            return;
        }
        try {
            const slug = slugify(noteTitle);
            if (currentNoteId) {
                // Update existing note
                await updateNote({
                    noteId: currentNoteId,
                    title: noteTitle,
                    content: content,
                });
                toast.success("Note updated successfully!");
            } else {
                // Create new note
                const newNoteSlug = await createNote({
                    title: noteTitle,
                    content: content,
                    slug,
                });
                setCurrentNoteId(newNoteSlug);
                toast.success("Note created successfully!");
            }
        } catch (error) {
            toast.error("Failed to save note: " + error.message);
        }
    };

    const handleSaveNote = () => {
        if (!noteTitle.trim()) {
            setNoteTitle('Untitled');
        }
        saveToLocalStorage();
    };

    return (
        <div className="h-full">
            <div className="max-w-5xl mx-auto relative">
                <Card className="bg-background/80 backdrop-blur-sm border shadow-lg rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                        {copiedText?.length > 0 ? (
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
                                        preview="edit"
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
                                    <p className="text-lg text-muted-foreground">
                                        Notes will appear here once you start adding content.
                                        <br />
                                        Select text and click send to notes, or start a new note.
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-background border-border">
                    <DialogHeader className="relative">
                        <DialogTitle>Save Note</DialogTitle>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-0 right-0 text-muted-foreground hover:text-foreground transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <Input
                            placeholder="Note Title"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            className="bg-background border-input"
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveNote}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NoteArea;