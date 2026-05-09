import React, { useState, useEffect } from 'react';
import type { DbForm, Question } from '../../types';
import { api } from '../../lib/api';

interface Props {
  formId: string;
}

export const PublicFormView: React.FC<Props> = ({ formId }) => {
  const [form, setForm] = useState<{ metadata: DbForm, questions: Question[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailUsername, setEmailUsername] = useState('');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const data = await api.getFormById(formId);
        setForm(data);
        
        // Apply theme colors
        const settings = data.metadata.settings as any;
        if (settings?.theme?.primaryColor) {
          const root = document.documentElement;
          root.style.setProperty('--primary', settings.theme.primaryColor);
          root.style.setProperty('--primary-light', `${settings.theme.primaryColor}20`);
        }
      } catch (err) {
        setError('No se pudo cargar el formulario. Puede que no exista o haya sido eliminado.');
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !emailUsername) return;

    // Validate email username
    if (emailUsername.includes('@')) {
      alert('Solo ingresa tu nombre de usuario, sin el @alum.up.edu.pe');
      return;
    }

    const fullEmail = `${emailUsername.trim()}@alum.up.edu.pe`;

    try {
      setLoading(true);
      await api.submitResponse(formId, answers, fullEmail);
      setSubmitted(true);
    } catch (err) {
      alert('Error al enviar la respuesta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  if (loading && !form) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>Cargando formulario...</div>;
  if (error) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>{error}</div>;
  if (!form) return null;

  if (submitted) {
    return (
      <div className="app-container" style={{ alignItems: 'center', paddingTop: 64 }}>
        <div className="premium-card" style={{ maxWidth: 640, width: '100%', borderTop: '8px solid var(--primary)' }}>
          <h1 className="form-title" style={{ fontSize: 32 }}>{form.metadata.title}</h1>
          <p style={{ marginTop: 16 }}>Se ha registrado tu respuesta.</p>
          <a href="/" style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginTop: 24 }}>Enviar otra respuesta</a>
        </div>
      </div>
    );
  }

  const settings = form.metadata.settings as any || {};

  return (
    <div className="app-container" style={{ alignItems: 'center', paddingBottom: 64 }}>
      <div style={{ maxWidth: 640, width: '100%', position: 'relative' }}>
        {settings.theme?.headerImage && (
          <img src={settings.theme.headerImage} alt="Header" style={{ width: '100%', height: 200, objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8, marginBottom: 12, marginTop: 24 }} />
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="premium-card" style={{ borderTop: settings.theme?.headerImage ? 'none' : '8px solid var(--primary)', marginTop: settings.theme?.headerImage ? 0 : 24 }}>
            <h1 className="form-title" style={{ fontSize: 32 }}>{form.metadata.title}</h1>
            {form.metadata.description && (
              <p className="form-description" style={{ marginTop: 12 }}>{form.metadata.description}</p>
            )}
            <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontWeight: 500 }}>Correo electrónico <span style={{ color: 'red' }}>*</span></label>
              <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: 4 }}>
                <input 
                  type="text" 
                  required
                  placeholder="Tu nombre de usuario"
                  value={emailUsername}
                  onChange={(e) => setEmailUsername(e.target.value)}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16 }}
                />
                <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>@alum.up.edu.pe</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Tu dominio académico será agregado automáticamente.</p>
            </div>
          </div>

          {form.questions.map((q) => (
            <div key={q.id} className="premium-card" style={{ padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: q.is_required ? 500 : 400 }}>{q.title || 'Pregunta sin título'}</span>
                {q.is_required && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
              </div>

              {q.type === 'short_text' && (
                <input 
                  type="text" 
                  required={q.is_required || false}
                  placeholder="Tu respuesta"
                  style={{ borderBottom: '1px solid var(--border)', padding: '8px 0', fontSize: 14 }}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
              )}

              {q.type === 'paragraph' && (
                <textarea 
                  required={q.is_required || false}
                  placeholder="Tu respuesta"
                  rows={3}
                  style={{ borderBottom: '1px solid var(--border)', padding: '8px 0', fontSize: 14, resize: 'none' }}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
              )}

              {q.type === 'multiple_choice' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {q.options?.map((opt, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name={`question_${q.id}`} 
                        required={q.is_required || false}
                        value={opt.text}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        style={{ width: 'auto' }}
                      />
                      <span>{opt.text || `Opción ${i + 1}`}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'checkboxes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {q.options?.map((opt, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        value={opt.text}
                        onChange={(e) => {
                          const currentAnswers = answers[q.id] || [];
                          const val = e.target.value;
                          if (e.target.checked) {
                            handleAnswerChange(q.id, [...currentAnswers, val]);
                          } else {
                            handleAnswerChange(q.id, currentAnswers.filter((a: string) => a !== val));
                          }
                        }}
                        style={{ width: 'auto' }}
                      />
                      <span>{opt.text || `Opción ${i + 1}`}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <button 
              type="submit" 
              className="send-btn" 
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
            <button type="button" onClick={() => { setAnswers({}); setEmailUsername(''); }} style={{ color: 'var(--primary)', fontWeight: 500, fontSize: 14, padding: '8px 16px', borderRadius: 4 }}>
              Borrar formulario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
