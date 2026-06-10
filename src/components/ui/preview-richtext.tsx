
import "@/styles/text-editor.css";
import type { ReactNode } from "react";

interface PreviewRichTextProps {
  content: string;
  className?: string;
  children?: ReactNode;
}

export function PreviewRichText({ content, className = "", children }: PreviewRichTextProps) {
  return (
    <div className={`text-editor ${className}`}>
      {children}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
