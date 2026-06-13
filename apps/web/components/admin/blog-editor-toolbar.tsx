"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  RemoveFormatting,
  Table as TableIcon,
  Trash2,
  Columns3,
  Rows3,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  ArrowUpFromLine,
  ArrowDownFromLine,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  tooltip: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, isActive, disabled, tooltip, children }: ToolbarButtonProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              "h-8 w-8 rounded-md",
              isActive && "bg-[#e7ddca] text-[#211c16]"
            )}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface BlogEditorToolbarProps {
  editor: Editor | null;
  onImageUpload?: () => void;
}

export function BlogEditorToolbar({ editor, onImageUpload }: BlogEditorToolbarProps) {
  if (!editor) return null;

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-[#e7ddca] bg-[#faf6ee] rounded-t-lg">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        tooltip="Bold (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        tooltip="Italic (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        tooltip="Underline (Ctrl+U)"
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        tooltip="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        tooltip="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        tooltip="Bullet List"
      >
        <List className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        tooltip="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        tooltip="Blockquote"
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        onClick={addLink}
        isActive={editor.isActive("link")}
        tooltip="Add Link"
      >
        <LinkIcon className="h-4 w-4" />
      </ToolbarButton>

      {onImageUpload && (
        <ToolbarButton
          onClick={onImageUpload}
          tooltip="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
      )}

      <Separator orientation="vertical" className="mx-1 h-6" />

      <DropdownMenu>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-md",
                    editor.isActive("table") && "bg-[#e7ddca] text-[#211c16]",
                  )}
                >
                  <TableIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Table
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem
            onClick={() =>
              editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
          >
            <TableIcon className="h-4 w-4 mr-2" /> Insert table
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!editor.can().addColumnBefore()}
            onClick={() => editor.chain().focus().addColumnBefore().run()}
          >
            <ArrowLeftFromLine className="h-4 w-4 mr-2" /> Add column before
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!editor.can().addColumnAfter()}
            onClick={() => editor.chain().focus().addColumnAfter().run()}
          >
            <ArrowRightFromLine className="h-4 w-4 mr-2" /> Add column after
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!editor.can().deleteColumn()}
            onClick={() => editor.chain().focus().deleteColumn().run()}
          >
            <Columns3 className="h-4 w-4 mr-2" /> Delete column
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!editor.can().addRowBefore()}
            onClick={() => editor.chain().focus().addRowBefore().run()}
          >
            <ArrowUpFromLine className="h-4 w-4 mr-2" /> Add row above
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!editor.can().addRowAfter()}
            onClick={() => editor.chain().focus().addRowAfter().run()}
          >
            <ArrowDownFromLine className="h-4 w-4 mr-2" /> Add row below
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!editor.can().deleteRow()}
            onClick={() => editor.chain().focus().deleteRow().run()}
          >
            <Rows3 className="h-4 w-4 mr-2" /> Delete row
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!editor.can().toggleHeaderRow()}
            onClick={() => editor.chain().focus().toggleHeaderRow().run()}
          >
            Toggle header row
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!editor.can().toggleHeaderColumn()}
            onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
          >
            Toggle header column
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!editor.can().deleteTable()}
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="text-red-600 focus:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete table
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <ToolbarButton
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        tooltip="Clear Formatting"
      >
        <RemoveFormatting className="h-4 w-4" />
      </ToolbarButton>

      <div className="flex-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        tooltip="Undo (Ctrl+Z)"
      >
        <Undo className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        tooltip="Redo (Ctrl+Y)"
      >
        <Redo className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}
