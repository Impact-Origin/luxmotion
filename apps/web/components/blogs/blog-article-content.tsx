"use client"

import Link from "next/link"
import React from "react"
import { slugifyHeading } from "@/lib/blog-toc"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
}

interface TipTapNode {
  type: string
  attrs?: Record<string, any>
  content?: TipTapNode[]
  text?: string
  marks?: Array<{ type: string; attrs?: Record<string, any> }>
}

type RichTextBlock = {
  type: "richText"
  node: TipTapNode
}

type ParagraphBlock = {
  type: "paragraph"
  content: string
}

type HeadingBlock = {
  type: "heading"
  content: string
}

type SubheadingBlock = {
  type: "subheading"
  content: string
  numbered?: boolean
  number?: number
}

type ListBlock = {
  type: "list"
  items: string[]
}

type ImageBlock = {
  type: "image"
  src: string
  alt: string
}

type FaqBlock = {
  type: "faq"
  items: { question: string; answer: string }[]
}

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | SubheadingBlock
  | ListBlock
  | ImageBlock
  | FaqBlock
  | RichTextBlock

interface BlogArticleContentProps {
  blocks: ContentBlock[]
}

function HeadingText({ text }: { text: string }) {
  const idx = text.indexOf(":")
  if (idx === -1) {
    return <>{text}</>
  }
  const head = text.slice(0, idx + 1)
  const accent = text.slice(idx + 1).trim()
  if (!accent) return <>{text}</>
  return (
    <>
      <span>{head}</span>{" "}
      <span className="italic text-[#C9A96E]" style={SERIF_FONT}>
        {accent}
      </span>
    </>
  )
}

function inlineNodesText(nodes: TipTapNode[] | undefined): string {
  if (!nodes) return ""
  let out = ""
  for (const n of nodes) {
    if (n.type === "text" && typeof n.text === "string") out += n.text
    else if (n.content) out += inlineNodesText(n.content)
  }
  return out
}

function renderInlineContent(nodes: TipTapNode[] | undefined): React.ReactNode {
  if (!nodes || nodes.length === 0) return null

  return nodes.map((node, index) => {
    if (node.type === "text") {
      let element: React.ReactNode = node.text || ""

      if (node.marks && node.marks.length > 0) {
        for (const mark of node.marks) {
          switch (mark.type) {
            case "bold":
              element = <strong key={`b-${index}`} className="font-semibold text-white">{element}</strong>
              break
            case "italic":
              element = <em key={`i-${index}`} className="italic">{element}</em>
              break
            case "underline":
              element = <u key={`u-${index}`} className="underline">{element}</u>
              break
            case "strike":
              element = <s key={`s-${index}`} className="line-through">{element}</s>
              break
            case "code":
              element = (
                <code
                  key={`c-${index}`}
                  className="bg-[#1c1c1c] border border-[rgba(255,255,255,0.07)] px-1.5 py-0.5 text-[13px] font-mono text-[#C9A96E]"
                >
                  {element}
                </code>
              )
              break
            case "link":
              if (mark.attrs?.href) {
                element = (
                  <Link
                    key={`l-${index}`}
                    href={mark.attrs.href}
                    target={mark.attrs.target || "_blank"}
                    rel="noopener noreferrer"
                    className="text-[#C9A96E] underline underline-offset-2 hover:text-white transition-colors"
                  >
                    {element}
                  </Link>
                )
              }
              break
          }
        }
      }

      return <React.Fragment key={index}>{element}</React.Fragment>
    }

    if (node.type === "hardBreak") {
      return <br key={index} />
    }

    return null
  })
}

function ParagraphNode({ node }: { node: TipTapNode }) {
  const content = renderInlineContent(node.content)
  if (!content) return null
  return (
    <p className="text-[14px] md:text-[15px] text-[#999] leading-[28.5px] w-full">
      {content}
    </p>
  )
}

function HeadingAnchor({ id }: { id: string }) {
  return (
    <span
      id={id}
      aria-hidden="true"
      className="block h-0 w-full"
      style={{ scrollMarginTop: 96 }}
    />
  )
}

function HeadingNode({ node, headingId }: { node: TipTapNode; headingId?: string }) {
  const level = node.attrs?.level || 2
  const text = inlineNodesText(node.content)

  if (level <= 2) {
    return (
      <>
        {headingId && <HeadingAnchor id={headingId} />}
        <h2
          id={headingId}
          style={{ ...SERIF_FONT, ...(headingId ? { scrollMarginTop: 96 } : {}) }}
          className="text-[24px] xl:text-[30px] text-white font-medium leading-[34.5px] w-full pt-[21.3px]"
        >
          <HeadingText text={text} />
        </h2>
      </>
    )
  }

  return (
    <>
      {headingId && <HeadingAnchor id={headingId} />}
      <h3
        id={headingId}
        style={headingId ? { scrollMarginTop: 96 } : undefined}
        className="text-[15px] font-semibold tracking-[0.15px] text-white leading-[28.5px] w-full pt-[14px]"
      >
        {text}
      </h3>
    </>
  )
}

function GoldBulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-[10px] text-[14px] md:text-[15px] text-[#999] leading-[28.5px]">
      <span className="mt-[11px] block h-[6px] w-[6px] shrink-0 rounded-full bg-[#C9A96E]" />
      <span className="flex-1 min-w-0">{children}</span>
    </li>
  )
}

function BulletListNode({ node }: { node: TipTapNode }) {
  return (
    <ul className="flex flex-col gap-[7px] w-full pt-[6px] list-none m-0 p-0">
      {node.content?.map((listItem, index) => (
        <GoldBulletItem key={index}>
          {listItem.content?.map((child, childIndex) => {
            if (child.type === "paragraph") {
              return <span key={childIndex}>{renderInlineContent(child.content)}</span>
            }
            return null
          })}
        </GoldBulletItem>
      ))}
    </ul>
  )
}

function OrderedListNode({ node }: { node: TipTapNode }) {
  return (
    <ol className="flex flex-col gap-[7px] w-full pt-[6px] list-decimal pl-[20px] marker:text-[#C9A96E]">
      {node.content?.map((listItem, index) => (
        <li key={index} className="text-[14px] md:text-[15px] text-[#999] leading-[28.5px] pl-1">
          {listItem.content?.map((child, childIndex) => {
            if (child.type === "paragraph") {
              return <span key={childIndex}>{renderInlineContent(child.content)}</span>
            }
            return null
          })}
        </li>
      ))}
    </ol>
  )
}

function BlockquoteNode({ node }: { node: TipTapNode }) {
  return (
    <blockquote className="bg-[rgba(201,169,110,0.08)] border-l-[2.4px] border-[#C9A96E] pl-[24.4px] pr-[22px] py-[18px] w-full">
      {node.content?.map((child, index) => {
        if (child.type === "paragraph") {
          return (
            <p
              key={index}
              className="text-[18px] md:text-[20px] text-white italic leading-[1.2] md:leading-[31px]"
              style={SERIF_FONT}
            >
              {renderInlineContent(child.content)}
            </p>
          )
        }
        return null
      })}
    </blockquote>
  )
}

function CodeBlockNode({ node }: { node: TipTapNode }) {
  const code = node.content?.map((c) => c.text || "").join("") || ""
  return (
    <pre className="bg-[#141414] border border-[rgba(255,255,255,0.07)] text-[#C9A96E] p-4 overflow-x-auto w-full">
      <code className="text-[13px] font-mono leading-relaxed">{code}</code>
    </pre>
  )
}

function ImageNode({ node }: { node: TipTapNode }) {
  const src = node.attrs?.src
  const alt = node.attrs?.alt || ""
  const title = node.attrs?.title

  if (!src) return null

  return (
    <figure className="w-full">
      <div className="relative w-full h-[240px] md:h-[334px] bg-[#1c1c1c] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 size-full object-cover"
          loading="lazy"
        />
      </div>
      {title && (
        <figcaption className="text-center text-[12px] text-[#696969] mt-2 italic">
          {title}
        </figcaption>
      )}
    </figure>
  )
}

function HorizontalRuleNode() {
  return <hr className="border-t border-[rgba(255,255,255,0.07)] w-full" />
}

type AssignId = (text: string) => string

function renderTipTapNode(
  node: TipTapNode,
  index: number,
  assignId: AssignId,
): React.ReactNode {
  switch (node.type) {
    case "paragraph":
      return <ParagraphNode key={index} node={node} />
    case "heading": {
      const level = node.attrs?.level || 2
      const text = inlineNodesText(node.content)
      const id = level <= 3 ? assignId(text) : undefined
      return <HeadingNode key={index} node={node} headingId={id} />
    }
    case "bulletList":
      return <BulletListNode key={index} node={node} />
    case "orderedList":
      return <OrderedListNode key={index} node={node} />
    case "blockquote":
      return <BlockquoteNode key={index} node={node} />
    case "codeBlock":
      return <CodeBlockNode key={index} node={node} />
    case "image":
      return <ImageNode key={index} node={node} />
    case "horizontalRule":
      return <HorizontalRuleNode key={index} />
    default:
      return null
  }
}

function RichTextRenderer({
  node,
  assignId,
}: {
  node: TipTapNode
  assignId: AssignId
}) {
  if (node.type !== "doc" || !node.content) return null
  return (
    <>
      {node.content.map((child, index) => renderTipTapNode(child, index, assignId))}
    </>
  )
}

function renderBlock(
  block: ContentBlock,
  index: number,
  assignId: AssignId,
) {
  switch (block.type) {
    case "richText":
      return <RichTextRenderer key={index} node={block.node} assignId={assignId} />
    case "paragraph":
      return (
        <p
          key={index}
          className="text-[14px] md:text-[15px] text-[#999] leading-[28.5px] w-full"
        >
          {block.content}
        </p>
      )
    case "heading": {
      const id = assignId(block.content)
      return (
        <React.Fragment key={index}>
          {id && <HeadingAnchor id={id} />}
          <h2
            id={id}
            style={{ ...SERIF_FONT, ...(id ? { scrollMarginTop: 96 } : {}) }}
            className="text-[24px] xl:text-[30px] text-white font-medium leading-[34.5px] w-full pt-[21.3px]"
          >
            <HeadingText text={block.content} />
          </h2>
        </React.Fragment>
      )
    }
    case "subheading": {
      const id = assignId(block.content)
      return (
        <React.Fragment key={index}>
          {id && <HeadingAnchor id={id} />}
          <h3
            id={id}
            style={id ? { scrollMarginTop: 96 } : undefined}
            className="text-[15px] font-semibold tracking-[0.15px] text-white leading-[28.5px] w-full pt-[14px]"
          >
            {block.numbered && block.number ? `${block.number}. ` : ""}
            {block.content}
          </h3>
        </React.Fragment>
      )
    }
    case "list":
      return (
        <ul key={index} className="flex flex-col gap-[7px] w-full pt-[6px] list-none m-0 p-0">
          {block.items.map((item, i) => (
            <GoldBulletItem key={i}>{item}</GoldBulletItem>
          ))}
        </ul>
      )
    case "image":
      return (
        <figure key={index} className="w-full">
          <div className="relative w-full h-[240px] md:h-[334px] bg-[#1c1c1c] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={block.src}
              alt={block.alt}
              className="absolute inset-0 size-full object-cover"
              loading="lazy"
            />
          </div>
        </figure>
      )
    case "faq":
      return (
        <div key={index} className="flex flex-col gap-4 w-full">
          <h3
            className="text-[24px] xl:text-[30px] text-white font-medium leading-[34.5px] w-full pt-[21.3px]"
            style={SERIF_FONT}
          >
            FAQs
          </h3>
          <dl className="flex flex-col gap-4">
            {block.items.map((item, i) => (
              <div
                key={i}
                className="border-t border-[rgba(255,255,255,0.07)] pt-4"
              >
                <dt className="font-semibold text-[15px] text-white">{item.question}</dt>
                <dd className="text-[14px] md:text-[15px] text-[#999] leading-[28.5px] mt-1">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )
    default:
      return null
  }
}

export function BlogArticleContent({ blocks }: BlogArticleContentProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  const seen = new Set<string>()
  const assignId: AssignId = (raw: string) => {
    const trimmed = (raw || "").replace(/\s+/g, " ").trim()
    if (!trimmed) return ""
    const base = slugifyHeading(trimmed)
    let id = base
    let counter = 2
    while (seen.has(id)) id = `${base}-${counter++}`
    seen.add(id)
    return id
  }

  return (
    <article className="flex flex-col gap-[14px] items-stretch w-full break-words overflow-hidden">
      {blocks.map((block, index) => renderBlock(block, index, assignId))}
    </article>
  )
}
