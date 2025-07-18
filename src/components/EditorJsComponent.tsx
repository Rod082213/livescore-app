'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table';

interface EditorProps {
  data?: OutputData;
  onChange: (data: OutputData) => void;
}

export interface EditorJsMethods {
  clear: () => void;
  render: (data: OutputData) => void;
}

const EditorJsComponent = forwardRef<EditorJsMethods, EditorProps>(({ data, onChange }, ref) => {
  const editorRef = useRef<EditorJS | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    clear() {
      editorRef.current?.clear();
    },
    render(newData: OutputData) {
      editorRef.current?.render(newData);
    },
  }));

  useEffect(() => {
    if (editorContainerRef.current && !editorRef.current) {
      const editor = new EditorJS({
        holder: editorContainerRef.current,
        tools: {
          header: Header,
          list: { class: List, inlineToolbar: true },
          paragraph: { class: Paragraph, inlineToolbar: true },
          table: { class: Table, inlineToolbar: true },
        },
        data: data,
        async onChange(api) {
          const savedData = await api.saver.save();
          onChange(savedData);
        },
        placeholder: 'Start writing your amazing story...'
      });
      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return <div ref={editorContainerRef} className="bg-gray-700 rounded-md p-4 text-white border border-gray-600 min-h-[300px]"></div>;
});

EditorJsComponent.displayName = 'EditorJsComponent';
export default EditorJsComponent;