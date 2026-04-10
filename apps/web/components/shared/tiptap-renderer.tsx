"use client"

import Image from "next/image"

interface TipTapNode {
  type: string
  content?: TipTapNode[]
  text?: string
  marks?: { type: string; attrs?: Record<string, any> }[]
  attrs?: Record<string, any>
}

interface TipTapRendererProps {
  content: any
  className?: string
}

function renderMarks(text: string, marks?: { type: string; attrs?: Record<string, any> }[]) {
  if (!marks || marks.length === 0) return text

  let result: React.ReactNode = text

  for (const mark of marks) {
    switch (mark.type) {
      case "bold":
        result = <strong>{result}</strong>
        break
      case "italic":
        result = <em>{result}</em>
        break
      case "underline":
        result = <u>{result}</u>
        break
      case "link":
        result = (
          <a
            href={mark.attrs?.href}
            target={mark.attrs?.target || "_blank"}
            rel="noopener noreferrer"
            className="text-[#27c7ff] underline hover:text-[#27c7ff]/80"
          >
            {result}
          </a>
        )
        break
    }
  }

  return result
}

function renderNode(node: TipTapNode, index: number): React.ReactNode {
  switch (node.type) {
    case "doc":
      return <>{node.content?.map((child, i) => renderNode(child, i))}</>

    case "paragraph":
      return (
        <p key={index} className="my-2 leading-relaxed">
          {node.content?.map((child, i) => renderNode(child, i)) ?? <br />}
        </p>
      )

    case "heading": {
      const level = node.attrs?.level || 2
      const children = node.content?.map((child, i) => renderNode(child, i))
      if (level === 2) {
        return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{children}</h2>
      }
      return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{children}</h3>
    }

    case "bulletList":
      return (
        <ul key={index} className="list-disc pl-6 my-2">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ul>
      )

    case "orderedList":
      return (
        <ol key={index} className="list-decimal pl-6 my-2">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ol>
      )

    case "listItem":
      return (
        <li key={index} className="my-1">
          {node.content?.map((child, i) => renderNode(child, i))}
        </li>
      )

    case "blockquote":
      return (
        <blockquote key={index} className="border-l-4 border-[#27c7ff] pl-4 italic text-zinc-600 my-4">
          {node.content?.map((child, i) => renderNode(child, i))}
        </blockquote>
      )

    case "image":
      return (
        <Image
          key={index}
          src={node.attrs?.src || ""}
          alt={node.attrs?.alt || ""}
          width={800}
          height={400}
          className="rounded-lg max-w-full h-auto mx-auto my-4"
        />
      )

    case "horizontalRule":
      return <hr key={index} className="my-6 border-[#dedede]" />

    case "hardBreak":
      return <br key={index} />

    case "text":
      return <span key={index}>{renderMarks(node.text || "", node.marks)}</span>

    default:
      return node.content?.map((child, i) => renderNode(child, i)) ?? null
  }
}

export function TipTapRenderer({ content, className }: TipTapRendererProps) {
  if (!content) return null

  if (typeof content === "string") {
    return (
      <p className={className ?? "text-[14px] lg:text-[16px] text-[#5f686c] leading-[1.6]"}>
        {content}
      </p>
    )
  }

  return (
    <div className={className ?? "text-[14px] lg:text-[16px] text-[#5f686c] leading-[1.6]"}>
      {renderNode(content as TipTapNode, 0)}
    </div>
  )
}
