import React, { useRef } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { api } from '../../lib/api';

interface ThemeSidebarProps {
  onClose: () => void;
  currentTheme: { primaryColor: string; headerImage?: string };
  onUpdateTheme: (theme: any) => void;
}

const THEME_COLORS = [
  '#db4437', // Red
  '#673ab7', // Purple (Default)
  '#3f51b5', // Indigo
  '#4285f4', // Blue
  '#03a9f4', // Light Blue
  '#00bcd4', // Cyan
  '#4caf50', // Green
  '#8bc34a', // Light Green
  '#ffeb3b', // Yellow
  '#ffc107', // Amber
  '#ff9800', // Orange
  '#ff5722', // Deep Orange
  '#795548', // Brown
  '#9e9e9e', // Grey
  '#607d8b', // Blue Grey
];

const FONTS = ['Roboto', 'Arial', 'Times New Roman', 'Georgia', 'Verdana', 'Courier New'];
const FONT_SIZES = ['10', '11', '12', '14', '16', '18', '24', '32'];

export const ThemeSidebar: React.FC<ThemeSidebarProps> = ({
  onClose,
  currentTheme,
  onUpdateTheme
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await api.uploadImage(file);
      onUpdateTheme({ ...currentTheme, headerImage: url });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Hubo un error subiendo la imagen.');
    }
  };

  return (
    <div className="theme-sidebar fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Opciones de tema</h3>
        <button className="icon-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '14px', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: 500 }}>Estilo de texto</h4>
        
        {['header', 'question', 'text'].map((type) => (
          <div key={type} style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
              {type === 'header' ? 'Encabezado' : type === 'question' ? 'Pregunta' : 'Texto'}
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select 
                value={(currentTheme as any).fonts?.[type]?.family || 'Roboto'}
                onChange={(e) => onUpdateTheme({
                  ...currentTheme,
                  fonts: { ...(currentTheme as any).fonts, [type]: { ...(currentTheme as any).fonts?.[type], family: e.target.value } }
                })}
                style={{ flex: 1, padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
              >
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <select 
                value={(currentTheme as any).fonts?.[type]?.size || (type === 'header' ? '24' : type === 'question' ? '12' : '11')}
                onChange={(e) => onUpdateTheme({
                  ...currentTheme,
                  fonts: { ...(currentTheme as any).fonts, [type]: { ...(currentTheme as any).fonts?.[type], size: e.target.value } }
                })}
                style={{ width: '60px', padding: '8px', border: '1px solid var(--border)', borderRadius: '4px' }}
              >
                {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>

      <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid var(--border)' }} />

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Encabezado</h4>
        
        {currentTheme.headerImage ? (
          <div style={{ position: 'relative' }}>
            <img src={currentTheme.headerImage} alt="Header" className="header-image-preview" />
            <button 
              onClick={() => onUpdateTheme({ ...currentTheme, headerImage: null })}
              style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', padding: 4 }}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="header-image-preview" onClick={() => fileInputRef.current?.click()}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <ImageIcon size={24} />
              <span>Elegir imagen</span>
            </div>
          </div>
        )}
        <input 
          type="file" 
          accept="image/*" 
          style={{ display: 'none' }} 
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
      </div>

      <div>
        <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Color del tema</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {THEME_COLORS.map(color => (
            <div 
              key={color}
              className={`color-picker-circle ${currentTheme.primaryColor === color ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => onUpdateTheme({ ...currentTheme, primaryColor: color })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
