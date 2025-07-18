'use client';

import React, { useEffect, useRef } from 'react';
import EditorJS(() => import('@/components/EditorJsComponent'), { ssr: false });

const EditorJsPreviewRenderer = ({ data }: { data: OutputData }) => {
  if (!data || !Array.isArray(data.blocks) || data, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';

interface EditorProps {
  data?: OutputData;
  onChange: (data: OutputData) => void;
}

const EditorJsComponent:.blocks.length === 0) {
    return <div className="p-4 text-gray-400 italic">Start typing in the editor to see a live preview...</div>;
  }
  return (
    <div React.FC<EditorProps> = ({ data, onChange }) => {
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new className="prose prose-invert max-w-none prose-p:text-gray-300 prose EditorJS({
        holder: 'editorjs-container',
        tools: {
          header: Header,
          list-headings:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300 transition-colors">
      {data.blocks.map((block: any) => {
        : { class: List, inlineToolbar: true },
          paragraph: { class: Paragraph, inlineToolbar: true },
        switch (block.type) {
          case 'header':
            const { level, text } = block.data},
        data: data,
        async onChange(api) {
          const savedData = await api.saver.save();
          onChange(savedData);
        },
      });
      editorRef.current = editor;
    ;
            if (!level || !text) return null;
            if (level === 1) return <h}

    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return1 key={block.id} className="text-4xl font-extrabold mb-4">{text}</h1>;
            if (level === 2) return <h2 key={block.id} className="text-3xl <div id="editorjs-container" className="bg-gray-700 rounded-md p-4 font-bold mt-8 mb-4 border-b border-gray-700 pb-2">{text} text-white border border-gray-600 min-h-[300px]"></div>;
};

export default EditorJsComponent;