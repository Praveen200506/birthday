"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
}

/**
 * Clean, lightweight, safe Markdown and formatting renderer tailored for personal journal posts.
 */
export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Split by double newlines into blocks
  const blocks = content.split(/\n\s*\n/);

  return (
    <div className="space-y-6 text-stone-700 font-sans text-base md:text-lg leading-relaxed">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Headings
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="text-xl md:text-2xl font-serif font-bold text-stone-800 pt-4 pb-1"
            >
              {renderInline(trimmed.slice(4))}
            </h3>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="text-2xl md:text-3xl font-serif font-bold text-stone-800 pt-6 pb-2 border-b border-stone-200/60"
            >
              {renderInline(trimmed.slice(3))}
            </h2>
          );
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h1
              key={index}
              className="text-3xl md:text-4xl font-serif font-bold text-stone-900 pt-6 pb-2"
            >
              {renderInline(trimmed.slice(2))}
            </h1>
          );
        }

        // Blockquotes / Special handwritten notes
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote
              key={index}
              className="relative my-6 p-6 rounded-2xl bg-gradient-to-r from-pink-50/80 to-purple-50/40 border-l-4 border-mypink shadow-sm"
            >
              <p className="font-handwriting text-2xl md:text-3xl text-stone-700 leading-relaxed">
                &ldquo;{renderInline(trimmed.slice(2).replace(/^"/, "").replace(/"$/, ""))}&rdquo;
              </p>
            </blockquote>
          );
        }

        // Bullet lists
        if (trimmed.split("\n").every((line) => line.trim().startsWith("- ") || line.trim().startsWith("* "))) {
          const items = trimmed.split("\n").map((line) => line.trim().replace(/^[-*]\s+/, ""));
          return (
            <ul key={index} className="space-y-2.5 my-4 pl-6 list-disc marker:text-mypink">
              {items.map((item, i) => (
                <li key={i} className="pl-1">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }

        // Standard Paragraph
        return (
          <p key={index} className="leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Helper to render inline formatting: **bold**, *italic*, and [links](url)
 */
function renderInline(text: string): React.ReactNode[] {
  // Simple regex tokenizer for bold, italic, and safe links
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/^([\s\S]*?)\*\*(.+?)\*\*([\s\S]*)/);
    // Link: [text](url)
    const linkMatch = remaining.match(/^([\s\S]*?)\[(.+?)\]\(((?:https?:\/\/|\/)[^\s)]+)\)([\s\S]*)/);
    // Italic: *text* or _text_
    const italicMatch = remaining.match(/^([\s\S]*?)\*(.+?)\*([\s\S]*)/);

    // Find the earliest match
    type MatchType = { type: "bold" | "link" | "italic"; index: number; match: RegExpMatchArray };
    const candidates: MatchType[] = [];

    if (boldMatch && boldMatch.index !== undefined) {
      candidates.push({ type: "bold", index: boldMatch[1].length, match: boldMatch });
    }
    if (linkMatch && linkMatch.index !== undefined) {
      candidates.push({ type: "link", index: linkMatch[1].length, match: linkMatch });
    }
    if (italicMatch && italicMatch.index !== undefined) {
      candidates.push({ type: "italic", index: italicMatch[1].length, match: italicMatch });
    }

    if (candidates.length === 0) {
      // No more tokens, push remainder
      parts.push(<span key={keyIndex++}>{remaining}</span>);
      break;
    }

    // Sort by earliest position in text
    candidates.sort((a, b) => a.index - b.index);
    const earliest = candidates[0];

    if (earliest.type === "bold") {
      const before = earliest.match[1];
      const boldText = earliest.match[2];
      if (before) parts.push(<span key={keyIndex++}>{before}</span>);
      parts.push(
        <strong key={keyIndex++} className="font-semibold text-stone-900">
          {boldText}
        </strong>
      );
      remaining = remaining.slice(before.length + boldText.length + 4);
    } else if (earliest.type === "link") {
      const before = earliest.match[1];
      const linkText = earliest.match[2];
      const href = earliest.match[3];
      if (before) parts.push(<span key={keyIndex++}>{before}</span>);
      parts.push(
        <a
          key={keyIndex++}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="text-mypink underline underline-offset-2 hover:text-pink-600 font-medium"
        >
          {linkText}
        </a>
      );
      remaining = remaining.slice(before.length + linkText.length + href.length + 4);
    } else if (earliest.type === "italic") {
      const before = earliest.match[1];
      const italicText = earliest.match[2];
      if (before) parts.push(<span key={keyIndex++}>{before}</span>);
      parts.push(
        <em key={keyIndex++} className="italic">
          {italicText}
        </em>
      );
      remaining = remaining.slice(before.length + italicText.length + 2);
    }
  }

  return parts;
}
