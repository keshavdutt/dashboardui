import React, { useState } from 'react';
import MDEditor from '@uiw/react-markdown-editor';

import MarkdownPreview from "@uiw/react-markdown-preview";


export default function NotebookMarkdownEditor() {

  const [markdown, setMarkdown] = useState(`# Welcome to Your Notebook

    ## Getting Started
    
    Write your markdown here. Each section will be rendered as a separate block.
    
    - Create notes
    - Organize thoughts
    - Visualize ideas`);

  const [isEditing, setIsEditing] = useState(false); // Track if in edit mode



  return (
    <div className="flex-grow h-full" data-color-mode="light">
      {isEditing ? (
        <MDEditor
          value={markdown}
          onChange={(value) => setMarkdown(value || "")}
          height="100%"
          previewWidth="50%"
          enablePreview={true}
          className="h-full"
          onBlur={() => setIsEditing(false)} // Exit edit mode when the editor loses focus
        />
      ) : (
        <div
          className="h-full overflow-auto p-4 bg-background"
          onDoubleClick={() => setIsEditing(true)} // Enter edit mode on double-click
        >
          <MarkdownPreview source={markdown} />
        </div>
      )}
    </div>
  );
}