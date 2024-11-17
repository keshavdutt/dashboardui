// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useRef, useEffect, useState, useCallback } from 'react';
import dynamic from "next/dynamic";
import { Bookmark, FileDown, FilePenLine } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import jsPDF from 'jspdf';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const NoteArea = ({ copiedText }) => {
  const quillRef = useRef(null);
  const [content, setContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');

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
    "header", "bold", "italic", "underline", "strike",
    "list", "bullet", "color", "background", "link", "blockquote", "code-block"
  ];

  const handleChange = useCallback((value) => {
    setContent(value);
  }, []);

  useEffect(() => {
    if (copiedText && quillRef.current) {
      const quill = quillRef.current.getEditor();
      let currentContent = quill.root.innerHTML;
      if (currentContent === '<p><br></p>') currentContent = "";
      const newContent = currentContent.length > 0 ? currentContent + '<br>' + copiedText : copiedText;
      setContent(newContent);
    }
  }, [copiedText]);

  const downloadAsPdf = useCallback(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const delta = quill.getContents();
      const doc = new jsPDF();
      doc.setFontSize(12);
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = 20;

      delta.ops.forEach((op) => {
        if (op.insert) {
          if (typeof op.insert === 'string') {
            const lines = doc.splitTextToSize(op.insert, doc.internal.pageSize.getWidth() - 40);
            lines.forEach((line) => {
              if (y + 12 > pageHeight) {
                y = 20;
                doc.addPage();
              }
              doc.text(line, 20, y);
              y += 12;
            });
          }
        }
      });

      doc.save('note-content.pdf');
    }
  }, []);

  const saveToLocalStorage = useCallback(() => {
    const existingNotes = JSON.parse(localStorage.getItem('savedNotes')) || [];
    const noteIndex = existingNotes.findIndex(note => note.title === noteTitle);

    if (noteIndex > -1) {
      existingNotes[noteIndex].content = content;
    } else {
      existingNotes.push({ title: noteTitle, content });
    }

    localStorage.setItem('savedNotes', JSON.stringify(existingNotes));
    setIsModalOpen(false);
    setNoteTitle('');
  }, [noteTitle, content]);

  return (
    <div className="h-full">
      <Card className="h-full flex flex-col bg-muted/50 ">
        <CardContent className="flex-1 p-4 h-full">
          {copiedText?.length > 0 ? (
            <div className='flex flex-col gap-4 h-full '>

              {/* Title Area */}
              <div className="flex items-center justify-between border-b border-gray-700 pb-2">
                <input
                  type="text"
                  placeholder="Untitled Document"
                  className="text-2xl font-bold bg-transparent outline-none text-white flex-1"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                />

                <div className="flex space-x-4 text-gray-400">
                  <button title="Edit" className="hover:text-white transition">
                    <FilePenLine className="w-6 h-6" />
                  </button>
                  <button title="Bookmark" className="hover:text-white transition">
                    <Bookmark className="w-6 h-6" />
                  </button>
                  <button title="Download" onClick={downloadAsPdf} className="hover:text-white transition">
                    <FileDown className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="h-[calc(100vh-180px)] flex-1 [&_.ql-container]:border-0 [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:bg-muted [&_.ql-toolbar]:rounded-t-lg [&_.ql-container]:bg-transparent [&_.ql-editor]:text-white [&_.ql-editor]:text-base [&_.ql-editor]:leading-relaxed [&_.ql-snow.ql-toolbar_button]:text-white [&_.ql-snow_.ql-stroke]:stroke-white [&_.ql-snow_.ql-fill]:fill-white [&_.ql-snow_.ql-picker]:text-white [&_.ql-editor.ql-blank::before]:text-white">
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  onChange={handleChange}
                  value={content}
                  className="h-[95%]"
                  placeholder="Start writing here..."
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8 bg-muted/50 rounded-lg border border-dashed border-muted-foreground/50">
                <p className="text-muted-foreground">
                  Notes will appear here once you start adding content.
                  <br />
                  Select text and click send to notes, or start a new note.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Note Title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={saveToLocalStorage}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoteArea;
