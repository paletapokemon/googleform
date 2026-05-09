import React, { useState, useEffect } from 'react';
import type { SavedForm, Question, DbForm } from './types';
import { Dashboard } from './components/layout/Dashboard';
import { QuestionCard } from './components/editor/QuestionCard';
import { AnalyticsDashboard } from './components/responses/AnalyticsDashboard';
import { ThemeSidebar } from './components/editor/ThemeSidebar';
import { FloatingToolbar } from './components/editor/FloatingToolbar';
import { Layout, Eye, Share2, ArrowLeft, Palette } from 'lucide-react';
import { api } from './lib/api';
import './index.css';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [activeTab, setActiveTab] = useState<'questions' | 'responses' | 'settings'>('questions');
  const [forms, setForms] = useState<SavedForm[]>([]);
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isThemeSidebarOpen, setIsThemeSidebarOpen] = useState(false);

  // Fetch all forms on mount
  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    setLoading(true);
    try {
      const dbForms = await api.fetchForms();
      // Map to UI state
      const uiForms: SavedForm[] = dbForms.map(f => ({
        id: f.id,
        title: f.title || 'Formulario sin título',
        lastModified: new Date(f.updated_at || '').getTime(),
        data: { metadata: f, questions: [], responses: [] } // Questions loaded on demand
      }));
      setForms(uiForms);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // Get current form data
  const currentForm = forms.find(f => f.id === currentFormId)?.data;

  // Apply Theme CSS variables
  useEffect(() => {
    if (currentForm?.metadata.settings) {
      const settings = currentForm.metadata.settings as any;
      const root = document.documentElement;
      if (settings.theme?.primaryColor) {
        root.style.setProperty('--primary', settings.theme.primaryColor);
        root.style.setProperty('--primary-light', `${settings.theme.primaryColor}20`);
      }
    } else {
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-light');
    }
  }, [currentForm?.metadata.settings]);

  const createNewForm = async () => {
    try {
      const newForm = await api.createForm();
      await loadForms();
      selectForm(newForm.id);
    } catch (e) {
      console.error(e);
      alert('Error al crear el formulario');
    }
  };

  const selectForm = async (id: string) => {
    setLoading(true);
    try {
      const fullForm = await api.getFormById(id);
      setForms(prev => prev.map(f => f.id === id ? { ...f, data: fullForm } : f));
      setCurrentFormId(id);
      setView('editor');
      setActiveTab('questions');
    } catch (e) {
      console.error(e);
      alert('Error cargando el formulario');
    }
    setLoading(false);
  };

  const updateFormMetadata = async (updates: Partial<DbForm>) => {
    if (!currentFormId || !currentForm) return;
    
    // Optimistic UI update
    setForms(prev => prev.map(f => {
      if (f.id === currentFormId) {
        return { 
          ...f, 
          title: updates.title !== undefined ? (updates.title || 'Formulario sin título') : f.title,
          data: { ...f.data, metadata: { ...f.data.metadata, ...updates } } 
        };
      }
      return f;
    }));

    // Save to DB
    try {
      await api.updateForm(currentFormId, updates);
    } catch (e) {
      console.error('Error saving form metadata', e);
    }
  };

  const updateQuestion = async (idx: number, updated: Question) => {
    if (!currentFormId || !currentForm) return;
    
    setForms(prev => prev.map(f => {
      if (f.id === currentFormId) {
        const newQs = [...f.data.questions];
        newQs[idx] = updated;
        return { ...f, data: { ...f.data, questions: newQs } };
      }
      return f;
    }));

    try {
      await api.updateQuestion(updated.id, updated);
    } catch (e) {
      console.error('Error updating question', e);
    }
  };

  const addQuestion = async () => {
    if (!currentFormId || !currentForm) return;
    try {
      const newQ = await api.createQuestion(currentFormId, currentForm.questions.length);
      setForms(prev => prev.map(f => {
        if (f.id === currentFormId) {
          return { ...f, data: { ...f.data, questions: [...f.data.questions, newQ] } };
        }
        return f;
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteQuestion = async (idx: number, qId: string) => {
    if (!currentFormId) return;
    setForms(prev => prev.map(f => {
      if (f.id === currentFormId) {
        return { ...f, data: { ...f.data, questions: f.data.questions.filter((_, i) => i !== idx) } };
      }
      return f;
    }));
    try {
      await api.deleteQuestion(qId);
    } catch (e) {
      console.error(e);
    }
  };

  if (view === 'dashboard') {
    return loading ? <div>Cargando...</div> : <Dashboard forms={forms} onCreateNew={createNewForm} onSelectForm={selectForm} />;
  }

  if (loading || !currentForm) return <div>Cargando editor...</div>;

  const settings = currentForm.metadata.settings as any || {};

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-top">
          <div className="nav-left">
            <button className="icon-btn" onClick={() => { setView('dashboard'); loadForms(); }}><ArrowLeft size={24} /></button>
            <Layout className="nav-logo" size={24} color="var(--primary)" />
            <input 
              className="nav-title-input" 
              value={currentForm.metadata.title || ''}
              onChange={(e) => updateFormMetadata({ title: e.target.value })}
            />
          </div>
          <div className="nav-right">
            <button className="nav-icon-btn" onClick={() => setIsThemeSidebarOpen(true)} title="Personalizar tema"><Palette size={20} /></button>
            <button className="nav-icon-btn" title="Vista previa"><Eye size={20} /></button>
            <button className="nav-icon-btn" title="Deshacer"><Share2 size={20} /></button>
            <button className="send-btn">Enviar</button>
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
          </div>
        </div>
        <div className="nav-tabs">
          <button className={`tab ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}>Preguntas</button>
          <button className={`tab ${activeTab === 'responses' ? 'active' : ''}`} onClick={() => setActiveTab('responses')}>
            Respuestas <span className="response-count">{currentForm.responses.length}</span>
          </button>
          <button className={`tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Configuración</button>
        </div>
      </nav>

      {isThemeSidebarOpen && (
        <ThemeSidebar 
          onClose={() => setIsThemeSidebarOpen(false)}
          currentTheme={settings.theme || { primaryColor: '#673ab7' }}
          onUpdateTheme={(theme) => updateFormMetadata({ settings: { ...settings, theme } })}
        />
      )}

      <main className="form-content" style={{ maxWidth: 770, margin: '0 auto', paddingTop: 24, paddingBottom: 64, position: 'relative' }}>
        {activeTab === 'questions' && (
          <div className="editor-view">
            {settings.theme?.headerImage && (
              <img src={settings.theme.headerImage} alt="Form Header" className="top-header-banner" />
            )}

            <div className="premium-card active header-card" style={{ borderTop: '8px solid var(--primary)', borderRadius: '8px', padding: '24px', backgroundColor: 'white', marginBottom: '12px' }}>
              <input 
                className="form-title" 
                placeholder="Título del formulario"
                value={currentForm.metadata.title || ''}
                onChange={(e) => updateFormMetadata({ title: e.target.value })}
                style={{ fontSize: '32px', width: '100%', border: 'none', borderBottom: '1px solid transparent', outline: 'none' }}
              />
              <textarea 
                className="form-description" 
                placeholder="Descripción del formulario"
                value={currentForm.metadata.description || ''}
                onChange={(e) => updateFormMetadata({ description: e.target.value })}
                style={{ width: '100%', border: 'none', borderBottom: '1px solid transparent', outline: 'none', marginTop: '8px', minHeight: '24px' }}
              />
            </div>

            {currentForm.questions.map((q, idx) => (
              <QuestionCard 
                key={q.id}
                question={q}
                onUpdate={(updated) => updateQuestion(idx, updated)}
                onDelete={() => deleteQuestion(idx, q.id)}
                onDuplicate={() => {
                  // Implement duplicate via API if needed, for now just add a new one
                  addQuestion();
                }}
              />
            ))}
            
            <FloatingToolbar 
              onAddQuestion={addQuestion} 
              onAddImage={() => alert('Función de agregar imagen flotante')} 
            />
          </div>
        )}

        {activeTab === 'responses' && (
          <AnalyticsDashboard form={currentForm as any} />
        )}
        
        {activeTab === 'settings' && (
          <div className="premium-card" style={{ padding: 24 }}>
            <h2 style={{ marginBottom: 16 }}>Configuración</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 style={{ fontSize: 16 }}>Convertir en cuestionario</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Asigna puntuaciones, establece las respuestas y envía comentarios automáticamente</p>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={currentForm.metadata.is_quiz || false}
                  onChange={(e) => updateFormMetadata({ is_quiz: e.target.checked })}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
