'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useCallback } from 'react';

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
  }, [editor]);
  
  const addImage = useCallback(() => {
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const buttonClass = "px-3 py-1 text-sm font-semibold text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const activeClass = "bg-blue-600";
  const inactiveClass = "bg-gray-600 hover:bg-gray-500";

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-800 border border-b-0 border-gray-600 rounded-t-lg">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={`${buttonClass} ${editor.isActive('bold') ? activeClass : inactiveClass}`}>Bold</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={`${buttonClass} ${editor.isActive('italic') ? activeClass : inactiveClass}`}>Italic</button>
      <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} className={`${buttonClass} ${editor.isActive('paragraph') ? activeClass : inactiveClass}`}>P</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`${buttonClass} ${editor.isActive('heading', { level: 1 }) ? activeClass : inactiveClass}`}>H1</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${buttonClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : inactiveClass}`}>H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${buttonClass} ${editor.isActive('heading', { level: 3 }) ? activeClass : inactiveClass}`}>H3</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${buttonClass} ${editor.isActive('bulletList') ? activeClass : inactiveClass}`}>List</button>
      <button type="button" onClick={setLink} className={`${buttonClass} ${editor.isActive('link') ? activeClass : inactiveClass}`}>Link</button>
      <button type="button" onClick={addImage} className={buttonClass}>Image</button>
    </div>
  );
};

const FullEditor = ({ content, onChange }: { content: string; onChange: (richText: string) => void }) => {
  const editor = useEditor({
    extensions: [ StarterKit, Image, Link.configure({ openOnClick: false, autolink: true }) ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'prose prose-invert max-w-none p-4 min-h-[400px] bg-gray-700 border border-gray-600 rounded-b-lg focus:outline-none' },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });
  return ( <div><EditorToolbar editor={editor} /><EditorContent editor={editor} /></div> );
};

export default FullEditor;