import React from 'react';
import { Bold, Italic, Underline, Link as LinkIcon, Type } from 'lucide-react';

interface Props {
  onFormat: (command: string, value?: string) => void;
}

export const RichTextToolbar: React.FC<Props> = ({ onFormat }) => {
  return (
    <div className="rich-text-toolbar" style={{
      display: 'flex',
      gap: '8px',
      padding: '8px',
      backgroundColor: 'white',
      border: '1px solid var(--border)',
      borderRadius: '4px',
      boxShadow: 'var(--shadow-sm)',
      position: 'absolute',
      top: '-45px',
      left: '0',
      zIndex: 10
    }}>
      <button type="button" onClick={() => onFormat('bold')} className="icon-btn" title="Negrita"><Bold size={18} /></button>
      <button type="button" onClick={() => onFormat('italic')} className="icon-btn" title="Cursiva"><Italic size={18} /></button>
      <button type="button" onClick={() => onFormat('underline')} className="icon-btn" title="Subrayado"><Underline size={18} /></button>
      <button type="button" onClick={() => {
        const url = prompt('Ingresa el enlace:');
        if (url) onFormat('createLink', url);
      }} className="icon-btn" title="Enlace"><LinkIcon size={18} /></button>
      <button type="button" onClick={() => onFormat('removeFormat')} className="icon-btn" title="Quitar formato"><Type size={18} /></button>
    </div>
  );
};
