// src/components/EditorJsRenderer.tsx
'use client'; // This is essential if you use useState, useEffect, etc., or for interactive rendering

import React from 'react';
import { OutputData, BlockData } from '@editorjs/editorjs';
import Image from 'next/image'; // Assuming you render images directly with next/image
import Link from 'next/link'; // If you handle internal links within Editor.js content

interface EditorJsRendererProps {
  contentData: OutputData; // This component expects the full OutputData object as a prop
}

const EditorJsRenderer: React.FC<EditorJsRendererProps> = ({ contentData }) => {
  if (!contentData || !Array.isArray(contentData.blocks)) {
    return null;
  }

  return (
    <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-blue-400">
      {contentData.blocks.map((block) => {
        const blockId = block.id; // Editor.js blocks typically have an 'id'
        const data = block.data;

        // Generate an ID for headings to support anchor links if needed
        const headingId = block.type === 'header' && data?.text
          ? (data.text || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
          : blockId; // Fallback to blockId if not a heading or text is missing

        switch (block.type) {
          case 'header':
            const level = data?.level;
            const text = data?.text;
            if (!text || !level) return null;
            // Editor.js headers are h1-h6
            if (level === 1) return <h1 key={blockId} id={headingId}>{text}</h1>;
            if (level === 2) return <h2 key={blockId} id={headingId}>{text}</h2>;
            if (level === 3) return <h3 key={blockId} id={headingId}>{text}</h3>;
            if (level === 4) return <h4 key={blockId} id={headingId}>{text}</h4>;
            if (level === 5) return <h5 key={blockId} id={headingId}>{text}</h5>;
            if (level === 6) return <h6 key={blockId} id={headingId}>{text}</h6>;
            return null;
          case 'paragraph':
            return data?.text ? <p key={blockId} dangerouslySetInnerHTML={{ __html: data.text }} /> : null;
          case 'image':
            return (
              data?.file?.url ? (
                <figure key={blockId} className="my-8">
                  <Image
                    src={data.file.url}
                    alt={data.caption || 'Image'}
                    width={800} // Adjust as needed, or use 'fill'
                    height={450} // Adjust as needed, or use 'fill'
                    className="rounded-lg w-full h-auto object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 600px"
                  />
                  {data.caption && <figcaption className="text-center text-sm text-gray-400 mt-2">{data.caption}</figcaption>}
                </figure>
              ) : null
            );
          case 'list':
            if (!data?.items || !Array.isArray(data.items)) return null;
            const ListTag = data.style === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag key={blockId} className="my-4 list-inside">
                {data.items.map((item: string, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ListTag>
            );
          case 'quote':
            return (
              data?.text ? (
                <blockquote key={blockId} className="my-6 border-l-4 border-blue-500 pl-4 italic text-gray-300">
                  <p dangerouslySetInnerHTML={{ __html: data.text }} />
                  {data.caption && <cite className="block text-sm text-gray-400 mt-2 not-italic">- {data.caption}</cite>}
                </blockquote>
              ) : null
            );
          case 'delimiter':
            return <div key={blockId} className="my-8 text-center text-gray-500">***</div>;
          case 'raw': // For raw HTML blocks
            return data?.html ? <div key={blockId} dangerouslySetInnerHTML={{ __html: data.html }} /> : null;
          case 'table':
            if (!data?.content || !Array.isArray(data.content) || data.content.length === 0) return null;
            return (
              <div key={blockId} className="overflow-x-auto my-6">
                <table className="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-lg">
                  <thead>
                    {data.withHeadings && data.content[0] && (
                      <tr className="bg-gray-700">
                        {data.content[0].map((cell: string, i: number) => (
                          <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" dangerouslySetInnerHTML={{ __html: cell }} />
                        ))}
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {data.content.slice(data.withHeadings ? 1 : 0).map((row: string[], rowIndex: number) => (
                      <tr key={rowIndex}>
                        {row.map((cell: string, cellIndex: number) => (
                          <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: cell }} />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          // Assuming 'ctaButton' is a custom tool that stores url and text in data
          case 'ctaButton':
              if (data?.url && data?.text) {
                  return (
                      <div key={blockId} className="my-10 text-center">
                          <a href={data.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3 px-8 rounded-lg no-underline transition-colors">
                              {data.text}
                          </a>
                      </div>
                  );
              }
              return null;
          default:
            // Log any unknown block types for debugging
            console.warn('Unknown Editor.js block type:', block.type, block.data);
            return null;
        }
      })}
    </div>
  );
};

export default EditorJsRenderer;