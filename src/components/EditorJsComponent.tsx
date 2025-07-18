'use client';

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';

interface EditorProps {
  data?: OutputData;
  onChange: (data: OutputData) => void;
}

export interface EditorJsMethods {
  clear: () => void;
}

const EditorJsComponent = forwardRef<EditorJsMethods, EditorProps>(({ data, onChange }, ref) => {
  const editorRef = useRef<EditorJS | null>(null);

  useImperativeHandle(ref, () => ({
    clear() {
      if (editorRef.current) {
        editorRef.current.clear();
      }
    }
  }));

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs-container',
        tools: {
          header: Header,
          list: List,
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
        },
        data: data,
        async onChange(api, event) {
          const savedData = await api.saver.save();
          onChange(savedData);
        },
      });
      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return <div id="editorjs-container" className="bg-gray-700 rounded-md p-4 text-white border border-gray-600 min-h-[300px]"></div>;
});

EditorJsComponent.displayName = 'EditorJsComponent';

export default EditorJsComponent;