import React from 'react';
import { PlusCircle, Image as ImageIcon, Type, Video, LayoutTemplate } from 'lucide-react';

interface FloatingToolbarProps {
  onAddQuestion: () => void;
  onAddImage: () => void;
  // Others can be implemented later
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onAddQuestion,
  onAddImage
}) => {
  return (
    <div className="floating-toolbar">
      <button className="icon-btn" onClick={onAddQuestion} title="Agregar pregunta">
        <PlusCircle size={24} color="var(--text-secondary)" />
      </button>
      <button className="icon-btn" title="Importar preguntas">
        <LayoutTemplate size={24} color="var(--text-secondary)" />
      </button>
      <button className="icon-btn" title="Agregar título y descripción">
        <Type size={24} color="var(--text-secondary)" />
      </button>
      <button className="icon-btn" onClick={onAddImage} title="Agregar imagen">
        <ImageIcon size={24} color="var(--text-secondary)" />
      </button>
      <button className="icon-btn" title="Agregar video">
        <Video size={24} color="var(--text-secondary)" />
      </button>
    </div>
  );
};
