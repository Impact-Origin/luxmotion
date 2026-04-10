"use client"

import Link from "next/link"
import React from "react"

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

function renderInlineContent(nodes: TipTapNode[] | undefined): React.ReactNode {
  if (!nodes || nodes.length === 0) return null

  return nodes.map((node, index) => {
    if (node.type === "text") {
      let element: React.ReactNode = node.text || ""

      if (node.marks && node.marks.length > 0) {
        for (const mark of node.marks) {
          switch (mark.type) {
            case "bold":
              element = <strong key={`b-${index}`} className="font-bold">{element}</strong>
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
                <code key={`c-${index}`} className="bg-zinc-100 px-1.5 py-0.5 rounded text-sm font-mono">
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
                    className="text-[#27c7ff] underline hover:text-[#27c7ff]/80 transition-colors"
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
    <p className="text-[15px] text-[#333] leading-[1.75] w-full">
      {content}
    </p>
  )
}

function HeadingNode({ node }: { node: TipTapNode }) {
  const level = node.attrs?.level || 2
  const content = renderInlineContent(node.content)

  if (level === 2) {
    return (
      <h2 className="text-[24px] xl:text-[32px] font-bold text-[#111] leading-tight w-full mt-8 mb-4">
        {content}
      </h2>
    )
  }

  return (
    <h3 className="text-[18px] xl:text-[22px] font-semibold text-[#222] leading-snug w-full mt-6 mb-3">
      {content}
    </h3>
  )
}

function BulletListNode({ node }: { node: TipTapNode }) {
  return (
    <ul className="list-disc pl-6 w-full space-y-2 my-4">
      {node.content?.map((listItem, index) => (
        <li key={index} className="text-[15px] text-[#333] leading-[1.75]">
          {listItem.content?.map((child, childIndex) => {
            if (child.type === "paragraph") {
              return <span key={childIndex}>{renderInlineContent(child.content)}</span>
            }
            return null
          })}
        </li>
      ))}
    </ul>
  )
}

function OrderedListNode({ node }: { node: TipTapNode }) {
  return (
    <ol className="list-decimal pl-6 w-full space-y-2 my-4">
      {node.content?.map((listItem, index) => (
        <li key={index} className="text-[15px] text-[#333] leading-[1.75]">
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
    <blockquote className="border-l-4 border-[#27c7ff] bg-[#f8fcff] pl-5 pr-4 py-4 my-6 rounded-r-lg w-full">
      {node.content?.map((child, index) => {
        if (child.type === "paragraph") {
          return (
            <p key={index} className="text-[15px] text-[#555] leading-[1.75] italic">
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
  const language = node.attrs?.language || ""
  const code = node.content?.map(c => c.text || "").join("") || ""

  return (
    <pre className="bg-[#1e1e1e] text-[#d4d4d4] rounded-lg p-4 overflow-x-auto my-4 w-full">
      <code className="text-sm font-mono leading-relaxed">{code}</code>
    </pre>
  )
}

function ImageNode({ node }: { node: TipTapNode }) {
  const src = node.attrs?.src
  const alt = node.attrs?.alt || "Blog image"
  const title = node.attrs?.title

  if (!src) return null

  return (
    <figure className="w-full my-6">
      <div className="relative w-full rounded-lg overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-contain"
          loading="lazy"
        />
      </div>
      {title && (
        <figcaption className="text-center text-sm text-zinc-500 mt-2 italic">
          {title}
        </figcaption>
      )}
    </figure>
  )
}

function HorizontalRuleNode() {
  return <hr className="border-t border-zinc-200 my-8 w-full" />
}

function renderTipTapNode(node: TipTapNode, index: number): React.ReactNode {
  switch (node.type) {
    case "paragraph":
      return <ParagraphNode key={index} node={node} />
    case "heading":
      return <HeadingNode key={index} node={node} />
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

function RichTextRenderer({ node }: { node: TipTapNode }) {
  if (node.type !== "doc" || !node.content) {
    return null
  }

  return (
    <>
      {node.content.map((child, index) => renderTipTapNode(child, index))}
    </>
  )
}

function renderBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "richText":
      return <RichTextRenderer key={index} node={block.node} />
    case "paragraph":
      return (
        <p key={index} className="text-[15px] text-[#333] leading-[1.75] w-full">
          {block.content}
        </p>
      )
    case "heading":
      return (
        <h2 key={index} className="text-[24px] xl:text-[32px] font-bold text-[#111] leading-tight w-full">
          {block.content}
        </h2>
      )
    case "subheading":
      return (
        <h3 key={index} className="text-[18px] font-semibold text-[#222] leading-snug w-full">
          {block.numbered && block.number ? `${block.number}. ` : ""}{block.content}
        </h3>
      )
    case "list":
      return (
        <ul key={index} className="list-disc pl-6 w-full space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="text-[15px] text-[#333] leading-[1.75]">
              {item}
            </li>
          ))}
        </ul>
      )
    case "image":
      return (
        <figure key={index} className="w-full my-6">
          <img
            src={block.src}
            alt={block.alt}
            className="w-full h-auto rounded-lg object-contain"
            loading="lazy"
          />
        </figure>
      )
    case "faq":
      return (
        <div key={index} className="flex flex-col gap-4 w-full">
          <h3 className="text-[18px] font-semibold text-[#222]">FAQs</h3>
          <dl className="space-y-4">
            {block.items.map((item, i) => (
              <div key={i}>
                <dt className="font-medium text-[15px] text-[#111]">{item.question}</dt>
                <dd className="text-[15px] text-[#555] mt-1">{item.answer}</dd>
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

  return (
    <section className="pt-[24px] pb-[40px] xl:pb-[100px] px-4 md:px-5 lg:px-6 xl:px-8 overflow-hidden">
      <article className="flex flex-col gap-4 items-stretch w-full max-w-7xl mx-auto break-words overflow-hidden">
        {blocks.map((block, index) => renderBlock(block, index))}
      </article>
    </section>
  )
}
