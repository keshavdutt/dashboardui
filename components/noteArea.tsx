"use client";

import React, { useState } from 'react';
import dynamic from "next/dynamic";
import { Bookmark, ChartArea, FileDown, FilePenLine, MessageCircle, PanelRightClose } from "lucide-react";


// Dynamically import ReactQuill
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["link", "blockquote", "code-block"],
        ["clean"],
    ],
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "link",
    "blockquote",
    "code-block",
];

export default function NoteArea() {
    const [editorContent, setEditorContent] = useState("");

    return (
        // <div
        //     className={`flex-1 flex flex-col min-h-[100vh] rounded-xl bg-muted/50 md:min-h-min p-4 space-y-4 ${showChat ? "" : "w-full"
        //         }`}
        // >

        <div className={`flex-1 flex flex-col min-h-[100vh] rounded-xl bg-muted/50 md:min-h-min p-4 space-y-4`}>
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
                        <FilePenLine className="w-6 h-6" />
                    </button>
                    <button
                        title="Bookmark"
                        className="hover:text-white transition"
                    >
                        <Bookmark className="w-6 h-6" />
                    </button>
                    <button
                        title="Download"
                        className="hover:text-white transition"
                    >
                        <FileDown className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Quill Editor */}
            <div className="flex-1 [&_.ql-container]:border-0 [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:bg-muted [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:bg-transparent [&_.ql-editor]:text-white [&_.ql-editor]:text-base [&_.ql-editor]:leading-relaxed [&_.ql-snow.ql-toolbar_button]:text-white [&_.ql-snow_.ql-stroke]:stroke-white [&_.ql-snow_.ql-fill]:fill-white [&_.ql-snow_.ql-picker]:text-white [&_.ql-editor.ql-blank::before]:text-white">
                <ReactQuill
                    value={editorContent}
                    onChange={setEditorContent}
                    modules={modules}
                    formats={formats}
                    theme="snow"
                    placeholder="Start writing here..."
                    className="h-[95%]"
                />
            </div>
        </div>
    )
}
