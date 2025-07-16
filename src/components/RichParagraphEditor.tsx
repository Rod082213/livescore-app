// src/components/RichParagraphEditor.tsx
'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
// We no longer need to import Link separately
// import Link from '@tiptap/extension-link'; 
import { useCallback } from 'react';

const MiniToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const buttonClass = "px-2 py-1 rounded transition-colors text-sm font-medium";
  const activeClass = "bg-blue-600 text-white";
  const inactiveClass = "bg-gray-600 hover:bg-gray-500 text-gray-200";

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run();
  }, [editor]);

  return (
    <div className="flex items-center flex-wrap gap-1 p-1 bg-gray-700 border-b border-gray-500">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${buttonClass} ${editor.isActive('bold') ? activeClass : inactiveClass}`}>Bold</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${buttonClass} ${editor.isActive('italic') ? activeClass : inactiveClass}`}>Italic</button>
      <button type="button" onClick={setLink} className={`${buttonClass} ${editor.isActive('link') ? activeClass : inactiveClass}`}>Link</button>
      <div className="w-[1px] h-5 bg-gray-500 mx-1"></div>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${buttonClass} ${editor.isActive('bulletList') ? activeClass : inactiveClass}`}>Bullet List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${buttonClass} ${editor.isActive('orderedList') ? activeClass : inactiveClass}`}>Numbered List</button>
    </div>
  );
};

const RichParagraphEditor = ({ value, onChange }: { value: string; onChange: (newValue: string) => void }) => {
  const editor = useEditor({
    extensions: [
      // The StarterKit already includes the Link extension, so we don't need to add it again.
      StarterKit,
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base prose-invert max-w-none w-full p-2 bg-gray-600 border-none rounded-b-md focus:outline-none min-h-[100px]',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-gray-500 rounded-md">
      <MiniToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichParagraphEditor;