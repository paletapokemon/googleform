import { Plus, Search, Menu, MoreVertical, LayoutGrid, List, ChevronDown, Folder } from 'lucide-react';
import type { SavedForm } from '../../types';

interface Props {
  forms: SavedForm[];
  onCreateNew: () => void;
  onSelectForm: (id: string) => void;
}

export const Dashboard: React.FC<Props> = ({ forms, onCreateNew, onSelectForm }) => {
  return (
    <div className="dashboard-container fade-in">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-header-left">
          <button className="icon-btn"><Menu size={24} /></button>
          <div className="dash-logo">
            <svg width="40" height="40" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="4" fill="#673ab7" />
              <path d="M12 12h16v2H12zm0 6h16v2H12zm0 6h10v2H12z" fill="white" />
            </svg>
            <span className="dash-logo-text">Formularios</span>
          </div>
        </div>
        <div className="dash-search-container">
          <div className="dash-search-bar">
            <Search size={20} color="#5f6368" />
            <input type="text" placeholder="Búsqueda" />
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
              <ChevronDown size={16} />
            </div>
          </div>
          
          <div className="template-grid">
            <div className="template-item" onClick={onCreateNew}>
              <div className="template-preview blank">
                <Plus size={48} color="#4285f4" />
              </div>
              <span className="template-name">Formulario en blanco</span>
            </div>
            {/* Template placeholders */}
            {['Información de contacto', 'Confirmación de asist...', 'Invitación a una fiesta', 'Registro para la obten...', 'Registro del evento'].map((t, i) => (
              <div key={i} className="template-item muted">
                <div className="template-preview">
                  <div className="placeholder-lines" />
                </div>
                <span className="template-name">{t}</span>
              </div>
            ))}
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
                <button className="icon-btn"><ChevronDown size={20} /></button>
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
              {forms.map(form => (
                <div key={form.id} className="form-card" onClick={() => onSelectForm(form.id)}>
                  <div className="form-card-preview">
                    <div className="mini-form">
                      <div className="mini-header" />
                      <div className="mini-line" />
                      <div className="mini-line" />
                    </div>
                  </div>
                  <div className="form-card-info">
                    <span className="form-card-name">{form.title}</span>
                    <div className="form-card-meta">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#673ab7"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                      <span className="form-card-date">Abierto {new Date(form.lastModified).toLocaleDateString()}</span>
                      <MoreVertical size={16} color="#5f6368" />
                    </div>
                  </div>
                </div>
              ))}
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
        }
        .dash-header-left { display: flex; align-items: center; gap: 8px; flex: 1; }
        .dash-logo { display: flex; align-items: center; gap: 12px; margin-left: 8px; }
        .dash-logo-text { font-size: 22px; color: #5f6368; }
        
        .dash-search-container { flex: 2; display: flex; justify-content: center; }
        .dash-search-bar {
          background: #f1f3f4;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          border-radius: 8px;
          width: 100%;
          max-width: 720px;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .dash-search-bar:focus-within {
          background: white;
          box-shadow: 0 1px 1px 0 rgba(65,69,73,0.3), 0 1px 3px 1px rgba(65,69,73,0.15);
        }
        .dash-search-bar input { background: transparent; font-size: 16px; }

        .dash-header-right { flex: 1; display: flex; justify-content: flex-end; align-items: center; gap: 12px; }
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
        }

        .dash-content { max-width: 800px; margin: 0 auto; padding: 0 16px; }
        
        .new-form-section { background: #f1f3f4; padding: 16px 0 32px 0; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .section-title { font-size: 16px; color: #202124; }
        .template-gallery-btn { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #5f6368; cursor: pointer; }
        
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
          margin-bottom: 8px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .template-preview:hover { border-color: var(--primary); }
        .template-preview.blank { background: white; }
        .template-name { font-size: 14px; font-weight: 500; color: #202124; }
        .muted { opacity: 0.6; }
        .placeholder-lines { width: 70%; height: 60%; background: #f8f9fa; border-radius: 2px; position: relative; }
        .placeholder-lines::before { content: ''; position: absolute; top: 10px; left: 10px; width: 30px; height: 4px; background: #e8eaed; }

        .recent-forms-section { padding: 32px 0; }
        .recent-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .recent-filters { display: flex; align-items: center; gap: 16px; }
        .filter-btn { display: flex; align-items: center; gap: 4px; font-size: 14px; color: #202124; }
        .view-toggle { display: flex; align-items: center; gap: 8px; }

        .empty-dash { text-align: center; padding: 48px 0; color: #5f6368; }
        .empty-dash-icon { font-size: 64px; margin-bottom: 16px; }
        .empty-dash p { font-size: 18px; margin-bottom: 8px; color: #202124; }

        .forms-list-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
        .form-card { border: 1px solid #dadce0; border-radius: 4px; overflow: hidden; cursor: pointer; background: white; transition: border-color 0.2s; }
        .form-card:hover { border-color: var(--primary); }
        .form-card-preview { height: 140px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid #dadce0; }
        .mini-form { width: 40px; height: 50px; background: white; border: 1px solid #dadce0; padding: 4px; border-radius: 2px; }
        .mini-header { height: 8px; background: #673ab7; margin-bottom: 4px; }
        .mini-line { height: 2px; background: #e8eaed; margin-bottom: 2px; width: 80%; }
        .form-card-info { padding: 12px; }
        .form-card-name { display: block; font-size: 14px; font-weight: 500; color: #202124; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .form-card-meta { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #5f6368; }
        .form-card-date { flex: 1; }

        .icon-btn { padding: 8px; border-radius: 50%; color: #5f6368; }
        .icon-btn:hover { background: #f1f3f4; }
      `}</style>
    </div>
  );
};
