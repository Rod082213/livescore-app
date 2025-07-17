'use client';

import React, { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
// Import the tools you installed
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';

// Define the props for our component:
// - `data`: The initial content to load.
// - `onChange`: A function to call when the content changes.
interface EditorProps {
  data?: OutputData;
  onChange: (data: OutputData) => void;
}

const EditorJsComponent: React.FC<EditorProps> = ({ data, onChange }) => {
  // Use a ref to hold the Editor.js instance so it persists between re-renders.
  const editorRef = useRef<EditorJS | null>(null);

  // Use useEffect to initialize the editor once the component mounts.
  useEffect(() => {
    // Only initialize the editor if the ref is empty.
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs-container', // The ID of the div where the editor will render
        
        // Define the tools (plugins) the editor can use
        tools: {
          header: Header,
          list: List,
          paragraph: {
            class: Paragraph,
            inlineToolbar: true, // Allow bold/italic formatting within paragraphs
          },
        },
        
        // Load the initial data passed in via props
        data: data,
        
        // This function is the most important part:
        // It's called every time the user makes a change in the editor.
        async onChange(api, event) {
          // Get the latest content data from the editor
          const savedData = await api.saver.save();
          // Call the `onChange` function from props to update the parent component's state
          onChange(savedData);
        },
      });

      // Store the editor instance in our ref
      editorRef.current = editor;
    }

    // This is the cleanup function. It runs when the component is unmounted.
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []); // The empty dependency array ensures this effect runs only ONCE.

  // This is the container where Editor.js will build its UI.
  return (
    <div id="editorjs-container" className="bg-gray-700 rounded-md p-4 text-white border border-gray-600 min-h-[300px]"></div>
  );
};

export default EditorJsComponent;