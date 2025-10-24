"use client";

import { useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Heading1, Heading2, Heading3, Code, Quote, List, LinkIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (format: 'bold' | 'italic' | 'h1' | 'h2' | 'h3' | 'code' | 'quote' | 'list' | 'link') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let prefix = '';
    let suffix = '';
    let newCursorPosition = start;

    switch (format) {
      case 'h1': prefix = '# '; newCursorPosition = start + 2; break;
      case 'h2': prefix = '## '; newCursorPosition = start + 3; break;
      case 'h3': prefix = '### '; newCursorPosition = start + 4; break;
      case 'bold': prefix = '**'; suffix = '**'; newCursorPosition = start + 2; break;
      case 'italic': prefix = '*'; suffix = '*'; newCursorPosition = start + 1; break;
      case 'code': prefix = '`'; suffix = '`'; newCursorPosition = start + 1; break;
      case 'quote': prefix = '> '; newCursorPosition = start + 2; break;
      case 'list': prefix = '- '; newCursorPosition = start + 2; break;
      case 'link': prefix = '['; suffix = '](url)'; newCursorPosition = start + 1; break;
    }

    const newText = 
      value.substring(0, start) + 
      prefix + 
      selectedText + 
      suffix + 
      value.substring(end);
      
    onChange(newText);

    // We need a timeout to wait for React to re-render the textarea with the new value
    setTimeout(() => {
        textarea.focus();
        if (selectedText) {
            textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
        } else {
             textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        }
    }, 0);
  };
  
  const toolbarActions = [
    { id: 'h1', icon: Heading1, action: () => applyFormat('h1'), tooltip: 'Encabezado 1' },
    { id: 'h2', icon: Heading2, action: () => applyFormat('h2'), tooltip: 'Encabezado 2' },
    { id: 'h3', icon: Heading3, action: () => applyFormat('h3'), tooltip: 'Encabezado 3' },
    { id: 'bold', icon: Bold, action: () => applyFormat('bold'), tooltip: 'Negrita' },
    { id: 'italic', icon: Italic, action: () => applyFormat('italic'), tooltip: 'Cursiva' },
    { id: 'quote', icon: Quote, action: () => applyFormat('quote'), tooltip: 'Cita' },
    { id: 'code', icon: Code, action: () => applyFormat('code'), tooltip: 'Código' },
    { id: 'list', icon: List, action: () => applyFormat('list'), tooltip: 'Lista' },
    { id: 'link', icon: LinkIcon, action: () => applyFormat('link'), tooltip: 'Enlace' },
  ];


  return (
    <div className="w-full border rounded-md">
       <TooltipProvider>
            <div className="flex items-center gap-1 p-2 border-b">
                {toolbarActions.map(({ id, icon: Icon, action, tooltip }) => (
                     <Tooltip key={id}>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {e.preventDefault(); action()}}>
                                <Icon className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] w-full rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Escribe tu nota aquí. El formato Markdown es compatible."
      />
    </div>
  );
}
