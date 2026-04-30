import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { FormState, SavedForm, Question } from './types';
import { Dashboard } from './components/layout/Dashboard';
import { QuestionCard } from './components/editor/QuestionCard';
import { AnalyticsDashboard } from './components/responses/AnalyticsDashboard';
import { Layout, Eye, Share2, ArrowLeft } from 'lucide-react';
import './index.css';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [activeTab, setActiveTab] = useState<'questions' | 'responses' | 'settings'>('questions');
  const [forms, setForms] = useState<SavedForm[]>(() => {
    const saved = localStorage.getItem('google-forms-list');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);

  // Get current form data
  const currentForm = forms.find(f => f.id === currentFormId)?.data;

  useEffect(() => {
    localStorage.setItem('google-forms-list', JSON.stringify(forms));
  }, [forms]);

  const createNewForm = () => {
    const newId = nanoid();
    const newForm: SavedForm = {
      id: newId,
      title: 'Formulario sin título',
      lastModified: Date.now(),
      data: {
        metadata: {
          id: newId,
          title: 'Formulario sin título',
          description: '',
          createdAt: Date.now(),
        },
        questions: [
          {
            id: nanoid(),
            type: 'multiple_choice',
            title: 'Pregunta sin título',
            required: false,
            options: [{ id: nanoid(), text: 'Opción 1' }],
          },
        ],
        responses: [],
      }
    };
    setForms(prev => [newForm, ...prev]);
    setCurrentFormId(newId);
    setView('editor');
    setActiveTab('questions');
  };

  const selectForm = (id: string) => {
    setCurrentFormId(id);
    setView('editor');
    setActiveTab('questions');
  };

  const updateCurrentFormData = (updater: (prev: FormState) => FormState) => {
    if (!currentFormId) return;
    setForms(prev => prev.map(f => {
      if (f.id === currentFormId) {
        const newData = updater(f.data);
        return { 
          ...f, 
          title: newData.metadata.title, 
          lastModified: Date.now(),
          data: newData 
        };
      }
      return f;
    }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: nanoid(),
      type: 'multiple_choice',
      title: '',
      required: false,
      options: [{ id: nanoid(), text: 'Opción 1' }],
    };
    updateCurrentFormData(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
  };

  if (view === 'dashboard') {
    return <Dashboard forms={forms} onCreateNew={createNewForm} onSelectForm={selectForm} />;
  }

  if (!currentForm) return null;

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-top">
          <div className="nav-left">
            <button className="icon-btn" onClick={() => setView('dashboard')}><ArrowLeft size={24} /></button>
            <Layout className="nav-logo" size={24} color="#673ab7" />
            <input 
              className="nav-title-input" 
              value={currentForm.metadata.title}
              onChange={(e) => updateCurrentFormData(prev => ({ 
                ...prev, 
                metadata: { ...prev.metadata, title: e.target.value } 
              }))}
            />
          </div>
          <div className="nav-right">
            <button className="nav-icon-btn"><Eye size={20} /></button>
            <button className="nav-icon-btn"><Share2 size={20} /></button>
            <button className="send-btn">Enviar</button>
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

      <main className="form-content">
        {activeTab === 'questions' && (
          <div className="editor-view">
            <div className="premium-card active-accent header-card">
              <input 
                className="form-title" 
                placeholder="Título del formulario"
                value={currentForm.metadata.title}
                onChange={(e) => updateCurrentFormData(prev => ({ 
                  ...prev, 
                  metadata: { ...prev.metadata, title: e.target.value } 
                }))}
              />
              <textarea 
                className="form-description" 
                placeholder="Descripción del formulario"
                value={currentForm.metadata.description}
                onChange={(e) => updateCurrentFormData(prev => ({ 
                  ...prev, 
                  metadata: { ...prev.metadata, description: e.target.value } 
                }))}
              />
            </div>

            {currentForm.questions.map((q, idx) => (
              <QuestionCard 
                key={q.id}
                question={q}
                onUpdate={(updated) => {
                  updateCurrentFormData(prev => {
                    const newQs = [...prev.questions];
                    newQs[idx] = updated;
                    return { ...prev, questions: newQs };
                  });
                }}
                onDelete={() => {
                  updateCurrentFormData(prev => ({ 
                    ...prev, 
                    questions: prev.questions.filter((_, i) => i !== idx) 
                  }));
                }}
                onDuplicate={() => {
                  updateCurrentFormData(prev => {
                    const duplicated = { ...q, id: nanoid() };
                    const newQs = [...prev.questions];
                    newQs.splice(idx + 1, 0, duplicated);
                    return { ...prev, questions: newQs };
                  });
                }}
              />
            ))}
            <button className="fab-add" onClick={addQuestion}>+</button>
          </div>
        )}

        {activeTab === 'responses' && (
          <AnalyticsDashboard form={currentForm} />
        )}
      </main>
    </div>
  );
};

export default App;
