'use client';
import React, { useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import ImageTool from '@editorjs/image';
import List from '@editorjs/list';
import RawTool from '@editorjs/raw';

type EditorJsProps = {
  data?: OutputData;
  onChange: (data: OutputData) => void;
};

const EditorJsRenderer = ({ data, onChange }: EditorJsProps) => {
  const editorRef = useRef<EditorJS | null>(null);
  const isInstanceReady = useRef(false); // Track if editor instance is fully ready

  useEffect(() => {
    // Only initialize if editor doesn't exist to prevent multiple instances
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs-container', // Must match the div ID below
        tools: {
          header: { class: Header, inlineToolbar: true, config: { placeholder: 'Enter a header', levels: [1, 2, 3] } },
          paragraph: { class: Paragraph, inlineToolbar: true, placeholder: 'Start writing your story...' },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByUrl: async (url: string) => ({ success: 1, file: { url: url } }),
                uploadByFile: async (file: File) => {
                   const formData = new FormData(); formData.append('file', file);
                   const res = await fetch('/api/upload', { method: 'POST', body: formData });
                   const data = await res.json();
                   if (data.success) return { success: 1, file: { url: data.url } };
                   throw new Error('Image upload failed');
                }
              }
            }
          },
          list: { class: List, inlineToolbar: true, config: { defaultStyle: 'unordered' } },
          ctaButton: { class: RawTool, config: { placeholder: 'Paste your CTA Button HTML here (e.g., <a href="#">Button Text</a>)' } },
        },
        // Ensure data is always valid, even if it's an empty string from DB
        data: data && data.blocks && Array.isArray(data.blocks) ? data : { blocks: [{ type: "paragraph", data: { text: "" } }] }, 
        minHeight: 300,
        placeholder: 'Click here or press "/" to add blocks...',
        autofocus: true,
        // Listen to onReady to ensure data is saved when editor is fully initialized
        onReady: () => {
            isInstanceReady.current = true;
            // Force a save to ensure initial empty paragraph block is in state
            editor.saver.save().then(savedData => {
                if (savedData.blocks.length === 0) { // If it saves empty, add a default paragraph
                    editor.blocks.render({ blocks: [{ type: "paragraph", data: { text: "" } }] });
                    onChange({ blocks: [{ type: "paragraph", data: { text: "" } }] } as OutputData);
                } else {
                    onChange(savedData);
                }
            });
        },
        onChange: async (api) => {
            if (isInstanceReady.current) { // Only save changes once the instance is ready
                const savedData = await api.saver.save();
                onChange(savedData);
            }
        },
      });
      editorRef.current = editor;
    }

    // Cleanup on unmount
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
        isInstanceReady.current = false;
      }
    };
  }, [data, onChange]); // Re-render if 'data' or 'onChange' changes

  return <div id="editorjs-container" className="bg-gray-800 rounded-lg border border-gray-600 p-4" />;
};

export default EditorJsRenderer;