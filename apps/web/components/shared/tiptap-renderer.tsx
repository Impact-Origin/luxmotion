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
            className="text-[#C9A96E] underline underline-offset-4 decoration-[rgba(201,169,110,0.4)] hover:decoration-[#C9A96E] transition-colors"
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
        <p key={index} className="my-3 leading-[1.7]">
          {node.content?.map((child, i) => renderNode(child, i)) ?? <br />}
        </p>
      )

    case "heading": {
      const level = node.attrs?.level || 2
      const children = node.content?.map((child, i) => renderNode(child, i))
      if (level === 2) {
        return (
          <h2
            key={index}
            className="text-[22px] md:text-[26px] text-white font-light leading-[1.3] mt-8 mb-3"
            style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
          >
            {children}
          </h2>
        )
      }
      return (
        <h3
          key={index}
          className="text-[16px] font-semibold text-white tracking-[0.5px] uppercase mt-6 mb-2"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {children}
        </h3>
      )
    }

    case "bulletList":
      return (
        <ul key={index} className="list-disc pl-6 my-3 marker:text-[#C9A96E] space-y-1">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ul>
      )

    case "orderedList":
      return (
        <ol key={index} className="list-decimal pl-6 my-3 marker:text-[#C9A96E] space-y-1">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ol>
      )

    case "listItem":
      return (
        <li key={index} className="my-1 leading-[1.7]">
          {node.content?.map((child, i) => renderNode(child, i))}
        </li>
      )

    case "blockquote":
      return (
        <blockquote
          key={index}
          className="border-l-2 border-[#C9A96E] pl-5 my-5 italic text-[rgba(255,255,255,0.55)] leading-[1.7]"
          style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
        >
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
          className="max-w-full h-auto mx-auto my-6 border border-[rgba(201,169,110,0.15)]"
        />
      )

    case "horizontalRule":
      return <hr key={index} className="my-8 border-0 h-px bg-[rgba(255,255,255,0.08)]" />

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
      <p className={className ?? "text-[14px] lg:text-[16px] text-[#999] leading-[1.7]"}>
        {content}
      </p>
    )
  }

  return (
    <div className={className ?? "text-[14px] lg:text-[16px] text-[#999] leading-[1.7]"}>
      {renderNode(content as TipTapNode, 0)}
    </div>
  )
}
