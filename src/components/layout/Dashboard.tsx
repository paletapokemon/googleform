import React from 'react';
import { Plus, Search, Menu, MoreVertical, LayoutGrid, List, ChevronDown, Folder } from 'lucide-react';
import type { SavedForm } from '../../types';

interface Props {
  forms: SavedForm[];
  onCreateNew: () => void;
  onSelectForm: (id: string) => void;
}

// Multi-colored Google Plus Icon
const GooglePlusIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36">
    <path fill="#34A853" d="M16 16v14h4V20z" />
    <path fill="#4285F4" d="M30 16H20l-4 4h14z" />
    <path fill="#FBBC05" d="M20 16V6h-4v14z" />
    <path fill="#EA4335" d="M6 16h10L20 20H6z" />
    <path fill="none" d="M0 0h36v36H0z" />
  </svg>
);

const FormPreview: React.FC<{ color?: string; headerImage?: string; title?: string }> = ({ color = '#673ab7', headerImage, title }) => (
  <div className="form-preview-snapshot">
    <div className="preview-header-bar" style={{ backgroundColor: color }}>
      {headerImage && <img src={headerImage} alt="" className="preview-header-img" />}
    </div>
    <div className="preview-content">
      <div className="preview-title">{title || 'Formulario sin título'}</div>
      <div className="preview-line-group">
        <div className="preview-line long" />
        <div className="preview-line short" />
      </div>
      <div className="preview-line-group">
        <div className="preview-line long" />
        <div className="preview-line short" />
      </div>
    </div>
  </div>
);

const TemplateThumbnail: React.FC<{ color: string; label: string; onClick?: () => void }> = ({ color, label, onClick }) => (
  <div className="template-item" onClick={onClick}>
    <div className="template-preview">
      <div className="template-mockup">
        <div className="mockup-header" style={{ backgroundColor: color }} />
        <div className="mockup-body">
          <div className="mockup-line title" />
          <div className="mockup-line" />
          <div className="mockup-line" />
        </div>
      </div>
    </div>
    <span className="template-name">{label}</span>
  </div>
);

export const Dashboard: React.FC<Props> = ({ forms, onCreateNew, onSelectForm }) => {
  return (
    <div className="dashboard-container fade-in">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-header-left">
          <button className="icon-btn"><Menu size={24} /></button>
          <div className="dash-logo">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <rect width="32" height="32" x="4" y="4" rx="4" fill="#673ab7" />
              <path d="M12 14h16v2H12zm0 6h16v2H12zm0 6h10v2H12z" fill="white" />
            </svg>
            <span className="dash-logo-text">Formularios</span>
          </div>
        </div>
        <div className="dash-search-container">
          <div className="dash-search-bar">
            <button className="icon-btn search-btn"><Search size={20} color="#5f6368" /></button>
            <input type="text" placeholder="Buscar" />
          </div>
        </div>
        <div className="dash-header-right">
          <button className="icon-btn"><LayoutGrid size={24} /></button>
          <div className="user-avatar">P</div>
        </div>
      </header>

      {/* New Form Section */}
      <section className="new-form-section">
        <div className="dash-content">
          <div className="section-header">
            <span className="section-title">Iniciar un formulario nuevo</span>
            <div className="template-gallery-btn">
              Galería de plantillas
              <div className="gallery-icons">
                <div className="separator" />
                <ChevronDown size={16} />
                <MoreVertical size={16} />
              </div>
            </div>
          </div>
          
          <div className="template-grid">
            <div className="template-item" onClick={onCreateNew}>
              <div className="template-preview blank">
                <GooglePlusIcon />
              </div>
              <span className="template-name">Formulario en blanco</span>
            </div>
            
            <TemplateThumbnail color="#4caf50" label="Información de contacto" />
            <TemplateThumbnail color="#db4437" label="Confirmación de asist..." />
            <TemplateThumbnail color="#ffc107" label="Invitación a una fiesta" />
            <TemplateThumbnail color="#3f51b5" label="Registro para la obten..." />
            <TemplateThumbnail color="#607d8b" label="Registro del evento" />
          </div>
        </div>
      </section>

      {/* Recent Forms Section */}
      <section className="recent-forms-section">
        <div className="dash-content">
          <div className="recent-header">
            <span className="section-title">Formularios recientes</span>
            <div className="recent-filters">
              <button className="filter-btn">Cualquiera es el propietario <ChevronDown size={14} /></button>
              <div className="view-toggle">
                <button className="icon-btn"><List size={20} /></button>
                <button className="icon-btn sort-btn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/></svg></button>
                <button className="icon-btn"><Folder size={20} /></button>
              </div>
            </div>
          </div>

          {forms.length === 0 ? (
            <div className="empty-dash">
              <div className="empty-dash-icon">📑</div>
              <p>Todavía no hay formularios</p>
              <span>Selecciona un formulario en blanco o elige otra plantilla para comenzar</span>
            </div>
          ) : (
            <div className="forms-list-grid">
              {forms.map(form => {
                const settings = form.data?.metadata.settings as any;
                const theme = settings?.theme || {};
                
                return (
                  <div key={form.id} className="form-card" onClick={() => onSelectForm(form.id)}>
                    <div className="form-card-preview">
                      <FormPreview 
                        color={theme.primaryColor} 
                        headerImage={theme.headerImage}
                        title={form.title}
                      />
                    </div>
                    <div className="form-card-info">
                      <span className="form-card-name">{form.title}</span>
                      <div className="form-card-meta">
                        <div className="form-card-meta-left">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#673ab7"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                          <span className="form-card-date">Abierto {new Date(form.lastModified).toLocaleDateString()}</span>
                        </div>
                        <button className="icon-btn mini"><MoreVertical size={16} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .dash-header {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          background: white;
          position: sticky;
          top: 0;
          z-index: 100;
          height: 64px;
        }
        .dash-header-left { display: flex; align-items: center; gap: 4px; flex: 1; }
        .dash-logo { display: flex; align-items: center; gap: 8px; margin-left: 4px; }
        .dash-logo-text { font-size: 22px; color: #5f6368; font-weight: 400; }
        
        .dash-search-container { flex: 2; display: flex; justify-content: center; }
        .dash-search-bar {
          background: #f1f3f4;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0 8px;
          border-radius: 24px;
          width: 100%;
          max-width: 720px;
          height: 48px;
          transition: background 0.2s, box-shadow 0.2s, border-radius 0.2s;
        }
        .dash-search-bar:focus-within {
          background: white;
          box-shadow: 0 1px 1px 0 rgba(65,69,73,0.3), 0 1px 3px 1px rgba(65,69,73,0.15);
          border-radius: 8px;
        }
        .dash-search-bar input { 
          background: transparent; 
          font-size: 16px; 
          height: 100%;
          width: 100%;
          color: #3c4043;
        }
        .search-btn { pointer-events: none; }

        .dash-header-right { flex: 1; display: flex; justify-content: flex-end; align-items: center; gap: 4px; }
        .user-avatar {
          width: 32px;
          height: 32px;
          background: #00897b;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          margin-left: 8px;
          cursor: pointer;
        }

        .dash-content { max-width: 800px; margin: 0 auto; padding: 0 16px; }
        
        .new-form-section { background: #f1f3f4; padding: 8px 0 32px 0; border-bottom: 1px solid #dadce0; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; height: 48px; }
        .section-title { font-size: 16px; color: #202124; }
        .template-gallery-btn { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #5f6368; cursor: pointer; padding: 8px 12px; border-radius: 4px; transition: background 0.2s; }
        .template-gallery-btn:hover { background: rgba(0,0,0,0.05); }
        .gallery-icons { display: flex; align-items: center; gap: 8px; }
        .gallery-icons .separator { width: 1px; height: 20px; background: #dadce0; }
        
        .template-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 16px; }
        .template-item { cursor: pointer; }
        .template-preview {
          aspect-ratio: 1.4;
          background: white;
          border: 1px solid #dadce0;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .template-item:hover .template-preview { border-color: #673ab7; }
        .template-preview.blank { background: white; }
        .template-name { font-size: 14px; font-weight: 500; color: #202124; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .template-mockup { width: 100%; height: 100%; display: flex; flex-direction: column; }
        .mockup-header { height: 12px; width: 100%; }
        .mockup-body { padding: 12px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
        .mockup-line { height: 4px; background: #f1f3f4; border-radius: 2px; width: 80%; }
        .mockup-line.title { width: 40%; height: 6px; background: #e8eaed; margin-bottom: 4px; }

        .recent-forms-section { padding: 16px 0 64px 0; background: white; min-height: 400px; }
        .recent-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; height: 48px; }
        .recent-filters { display: flex; align-items: center; gap: 8px; }
        .filter-btn { display: flex; align-items: center; gap: 4px; font-size: 14px; color: #202124; padding: 8px 12px; border-radius: 4px; }
        .filter-btn:hover { background: rgba(0,0,0,0.05); }
        .view-toggle { display: flex; align-items: center; gap: 4px; }

        .forms-list-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .form-card { border: 1px solid #dadce0; border-radius: 4px; overflow: hidden; cursor: pointer; background: white; transition: border-color 0.2s; }
        .form-card:hover { border-color: #673ab7; }
        .form-card-preview { height: 150px; background: #f8f9fa; border-bottom: 1px solid #dadce0; overflow: hidden; }
        
        .form-preview-snapshot { width: 100%; height: 100%; display: flex; flex-direction: column; background: #f8f9fa; transform: scale(1); transition: transform 0.2s; }
        .form-card:hover .form-preview-snapshot { transform: scale(1.02); }
        .preview-header-bar { height: 15px; position: relative; overflow: hidden; }
        .preview-header-img { width: 100%; height: 100%; object-fit: cover; }
        .preview-content { padding: 16px; display: flex; flex-direction: column; gap: 12px; flex: 1; }
        .preview-title { font-size: 10px; font-weight: 600; color: #202124; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
        .preview-line-group { display: flex; flex-direction: column; gap: 4px; background: white; padding: 8px; border: 1px solid #e8eaed; border-radius: 2px; }
        .preview-line { height: 3px; background: #f1f3f4; border-radius: 1px; }
        .preview-line.long { width: 90%; }
        .preview-line.short { width: 50%; }

        .form-card-info { padding: 12px 16px; }
        .form-card-name { display: block; font-size: 14px; font-weight: 500; color: #202124; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .form-card-meta { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #5f6368; }
        .form-card-meta-left { display: flex; align-items: center; gap: 10px; }
        .form-card-date { margin-top: 1px; }

        .icon-btn { padding: 12px; border-radius: 50%; color: #5f6368; display: flex; align-items: center; justify-content: center; }
        .icon-btn:hover { background: rgba(0,0,0,0.05); }
        .icon-btn.mini { padding: 4px; }
        .icon-btn.sort-btn { padding: 8px; }
      `}</style>
    </div>
  );
};
