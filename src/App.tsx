import React, { useState, useEffect } from 'react';
import { Layout, Plus, Eye, Share2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import type { FormState, Question, FormResponse } from './types';
import { QuestionCard } from './components/editor/QuestionCard';
import { AnalyticsDashboard } from './components/responses/AnalyticsDashboard';
import './index.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'questions' | 'responses' | 'settings'>('questions');
  const [form, setForm] = useState<FormState>(() => {
    const saved = localStorage.getItem('google-form-clone');
    if (saved) return JSON.parse(saved);
    return {
      metadata: {
        id: nanoid(),
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
    };
  });

  useEffect(() => {
    localStorage.setItem('google-form-clone', JSON.stringify(form));
  }, [form]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: nanoid(),
      type: 'multiple_choice',
      title: '',
      required: false,
      options: [{ id: nanoid(), text: 'Opción 1' }],
    };
    setForm(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
  };

  const addMockResponse = () => {
    const newResponse: FormResponse = {
      id: nanoid(),
      formId: form.metadata.id,
      submittedAt: Date.now(),
      answers: form.questions.reduce((acc, q) => {
        if (q.options && q.options.length > 0) {
          acc[q.id] = q.options[Math.floor(Math.random() * q.options.length)].text;
        } else {
          acc[q.id] = 'Respuesta de prueba';
        }
        return acc;
      }, {} as Record<string, string | string[]>)
    };
    setForm(prev => ({ ...prev, responses: [...prev.responses, newResponse] }));
  };

  return (
    <div className="app-container">
      {/* Header / Navbar */}
      <nav className="navbar">
        <div className="nav-top">
          <div className="nav-left">
            <Layout className="nav-logo" size={24} color="#673ab7" />
            <input 
              className="nav-title-input" 
              value={form.metadata.title}
              onChange={(e) => setForm(prev => ({ ...prev, metadata: { ...prev.metadata, title: e.target.value } }))}
            />
          </div>
          <div className="nav-right">
            <button className="nav-icon-btn"><Eye size={20} /></button>
            <button className="nav-icon-btn"><Share2 size={20} /></button>
            <button className="send-btn">Enviar</button>
          </div>
        </div>
        <div className="nav-tabs">
          <button 
            className={`tab ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            Preguntas
          </button>
          <button 
            className={`tab ${activeTab === 'responses' ? 'active' : ''}`}
            onClick={() => setActiveTab('responses')}
          >
            Respuestas
            <span className="response-count">{form.responses.length}</span>
          </button>
          <button 
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Configuración
          </button>
        </div>
      </nav>

      <main className="form-content">
        {activeTab === 'questions' && (
          <div className="editor-view">
            <div className="premium-card active-accent header-card">
              <input 
                className="form-title" 
                placeholder="Título del formulario"
                value={form.metadata.title}
                onChange={(e) => setForm(prev => ({ ...prev, metadata: { ...prev.metadata, title: e.target.value } }))}
              />
              <textarea 
                className="form-description" 
                placeholder="Descripción del formulario"
                value={form.metadata.description}
                onChange={(e) => setForm(prev => ({ ...prev, metadata: { ...prev.metadata, description: e.target.value } }))}
              />
            </div>

            {form.questions.map((q, idx) => (
              <QuestionCard 
                key={q.id}
                question={q}
                onUpdate={(updated) => {
                  const newQs = [...form.questions];
                  newQs[idx] = updated;
                  setForm(prev => ({ ...prev, questions: newQs }));
                }}
                onDelete={() => {
                  setForm(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }));
                }}
                onDuplicate={() => {
                  const duplicated = { ...q, id: nanoid() };
                  const newQs = [...form.questions];
                  newQs.splice(idx + 1, 0, duplicated);
                  setForm(prev => ({ ...prev, questions: newQs }));
                }}
              />
            ))}

            <button className="fab-add" onClick={addQuestion}>
              <Plus size={24} />
            </button>
          </div>
        )}

        {activeTab === 'responses' && (
          <div className="responses-view">
            <div className="mock-controls" style={{ marginBottom: '16px', textAlign: 'right' }}>
              <button className="nav-icon-btn" onClick={addMockResponse} title="Simular respuesta">
                Simular respuesta
              </button>
            </div>
            <AnalyticsDashboard form={form} />
          </div>
        )}
      </main>

      <style>{`
        .navbar {
          background: white;
          padding-top: 12px;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .nav-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          margin-bottom: 8px;
        }
        .nav-left { display: flex; align-items: center; gap: 12px; }
        .nav-title-input { font-size: 18px; border-bottom: 1px solid transparent; width: auto; }
        .nav-title-input:focus { border-bottom: 1px solid var(--border); }
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .nav-icon-btn { color: var(--text-secondary); padding: 8px; border-radius: 50%; }
        .nav-icon-btn:hover { background: #f1f3f4; }
        .send-btn {
          background: var(--primary);
          color: white;
          padding: 10px 24px;
          border-radius: 4px;
          font-weight: 500;
        }
        .nav-tabs {
          display: flex;
          justify-content: center;
          gap: 24px;
        }
        .tab {
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          border-bottom: 3px solid transparent;
        }
        .tab.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }
        .response-count {
          margin-left: 6px;
          background: #eee;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 12px;
        }
        .form-content {
          max-width: 770px;
          margin: 20px auto;
          padding: 0 15px;
        }
        .header-card {
          border-top: 10px solid var(--primary);
        }
        .q-row {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }
        .q-title {
          background: #f1f3f4;
          padding: 16px;
          font-size: 16px;
          border-bottom: 1px solid var(--border);
        }
        .type-select {
          padding: 8px;
          border: 1px solid var(--border);
          border-radius: 4px;
        }
        .fab-add {
          position: fixed;
          right: calc(50% - 440px);
          top: 200px;
          background: white;
          padding: 12px;
          border-radius: 8px;
          box-shadow: var(--shadow-sm);
          color: var(--text-secondary);
        }
        @media (max-width: 900px) {
          .fab-add { bottom: 20px; top: auto; right: 20px; border-radius: 50%; }
        }
      `}</style>
    </div>
  );
};

export default App;
