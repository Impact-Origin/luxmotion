"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { BlogEditorToolbar } from "./blog-editor-toolbar";
import { cn } from "@workspace/ui/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@workspace/convex/api";

interface BlogEditorProps {
  content?: any;
  onChange: (content: any) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minHeight?: string;
}

export function BlogEditor({
  content,
  onChange,
  placeholder = "Start writing your blog post...",
  disabled = false,
  className,
  minHeight = "300px",
}: BlogEditorProps) {
  const generateUploadUrl = useMutation(api.blogs.generateUploadUrl);
  const getImageUrl = useMutation(api.blogs.getImageUrl);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#27c7ff] underline hover:text-[#27c7ff]/80",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto mx-auto my-4",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: content || "",
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }: { editor: any }) => {
      onChange(editor.getJSON());
    },
  });

  React.useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  React.useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();
      const imageUrl = await getImageUrl({ storageId });

      if (imageUrl) {
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("border border-zinc-200 rounded-lg bg-white overflow-hidden", className)}>
      <BlogEditorToolbar editor={editor} onImageUpload={handleImageUpload} />

      <div
        className="prose prose-sm max-w-none p-4 focus-within:outline-none"
        style={{ minHeight }}
      >
        <EditorContent
          editor={editor}
          className={cn(
            "outline-none",
            "[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[inherit]",
            "[&_.ProseMirror_p]:my-2 [&_.ProseMirror_p]:leading-relaxed",
            "[&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-6 [&_.ProseMirror_h2]:mb-3",
            "[&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_h3]:mb-2",
            "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-2",
            "[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-2",
            "[&_.ProseMirror_li]:my-1",
            "[&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-[#27c7ff] [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-zinc-600 [&_.ProseMirror_blockquote]:my-4",
            "[&_.ProseMirror_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_.is-editor-empty:first-child::before]:text-zinc-400 [&_.ProseMirror_.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_.is-editor-empty:first-child::before]:pointer-events-none",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
}
