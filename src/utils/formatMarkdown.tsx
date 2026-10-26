import React from 'react';

/**
 * Lightweight safe markdown renderer for chat messages.
 * Formats **bold**, *italic*, headers (#, ##), bullet points (- or *), code blocks, and line breaks.
 */
export function renderFormattedContent(text: string): React.ReactNode {
  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Heading 3 or 2
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={lineIdx} className="font-bold text-blue-300 text-sm mt-2 mb-1">
              {formatInlineStyles(trimmed.slice(4))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={lineIdx} className="font-bold text-white text-base mt-2.5 mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {formatInlineStyles(trimmed.slice(3))}
            </h3>
          );
        }

        // Bullet point
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
          const content = trimmed.replace(/^[-•*]\s+/, '');
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="text-blue-400 select-none text-xs mt-1">•</span>
              <span className="flex-1">{formatInlineStyles(content)}</span>
            </div>
          );
        }

        // Regular paragraph with inline styles
        return (
          <p key={lineIdx} className="my-0.5">
            {formatInlineStyles(line)}
          </p>
        );
      })}
    </div>
  );
}

function formatInlineStyles(str: string): React.ReactNode[] {
  // Regex splitting by bold **text** or *italic*
  const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} className="italic text-slate-300">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-800/40 font-mono text-[11px] text-blue-300">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
