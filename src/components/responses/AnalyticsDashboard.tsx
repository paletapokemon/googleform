import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Copy, MoreVertical, FileSpreadsheet, Trash2, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import type { FormState, Question } from '../../types';

interface Props {
  form: FormState;
}

const COLORS = ['#4285f4', '#db4437', '#f4b400', '#0f9d58', '#ab47bc', '#00acc1', '#ff7043', '#9e9e9e'];

export const AnalyticsDashboard: React.FC<Props> = ({ form }) => {
  const [subTab, setSubTab] = useState<'summary' | 'question' | 'individual'>('summary');
  const [individualIndex, setIndividualIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  const getChartData = (question: Question) => {
    if (!question.options) return [];
    
    return question.options.map(opt => {
      const count = form.responses.filter(r => {
        const answer = r.answers[question.id];
        if (Array.isArray(answer)) return answer.includes(opt.text);
        return answer === opt.text;
      }).length;
      
      return { name: opt.text, value: count };
    });
  };

  if (form.responses.length === 0) {
    return (
      <div className="no-responses premium-card" style={{ textAlign: 'center', padding: '48px 24px', maxWidth: 640, margin: '24px auto' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
        <h3 style={{ fontSize: 24, fontWeight: 400, marginBottom: 8 }}>Esperando respuestas</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Envía el enlace a otras personas para empezar a recopilar datos.</p>
      </div>
    );
  }

  const renderChart = (q: Question) => {
    const data = getChartData(q);
    
    if (q.type === 'multiple_choice' || q.type === 'dropdown') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="40%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                label={({ percent }: any) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (q.type === 'checkboxes') {
      return (
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill="#4285f4" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return (
      <div className="text-responses-list" style={{ maxHeight: 400, overflowY: 'auto', border: '1px solid #f1f3f4', borderRadius: 8 }}>
        {form.responses.map((r, i) => (
          <div key={i} style={{ padding: '16px', borderBottom: '1px solid #f1f3f4', fontSize: 14 }}>
            {r.answers[q.id] || <span style={{ color: '#999', fontStyle: 'italic' }}>(Sin respuesta)</span>}
          </div>
        ))}
      </div>
    );
  };

  const renderSummary = () => (
    <div className="summary-view fade-in">
      <div className="premium-card summary-header" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 400 }}>{form.responses.length} {form.responses.length === 1 ? 'respuesta' : 'respuestas'}</h2>
          <div className="sub-tabs" style={{ display: 'flex', gap: 24, marginTop: 24 }}>
            <button className={`sub-tab ${subTab === 'summary' ? 'active' : ''}`} onClick={() => setSubTab('summary')}>Resumen</button>
            <button className={`sub-tab ${subTab === 'question' ? 'active' : ''}`} onClick={() => setSubTab('question')}>Pregunta</button>
            <button className={`sub-tab ${subTab === 'individual' ? 'active' : ''}`} onClick={() => setSubTab('individual')}>Individual</button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button className="icon-btn-outline" title="Ver en hojas de cálculo"><FileSpreadsheet size={20} color="#1e8e3e" /> Vincular a Hojas de cálculo</button>
          <button className="icon-btn"><MoreVertical size={20} /></button>
        </div>
      </div>

      {form.questions.map((q) => (
        <div key={q.id} className="premium-card stat-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'var(--primary)', padding: '12px 24px', color: 'white' }}>
            <span style={{ fontSize: 14 }}>Sección sin título</span>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 500 }}>{q.title || 'Pregunta sin título'}</h3>
              <button className="icon-btn-text" style={{ color: '#4285f4', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Copy size={16} /> Copiar gráfico
              </button>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 24 }}>{form.responses.length} {form.responses.length === 1 ? 'respuesta' : 'respuestas'}</p>
            {renderChart(q)}
          </div>
        </div>
      ))}
    </div>
  );

  const renderQuestionTab = () => {
    const q = form.questions[questionIndex];
    if (!q) return null;

    return (
      <div className="question-view fade-in">
        <div className="premium-card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button disabled={questionIndex === 0} onClick={() => setQuestionIndex(v => v - 1)} className="nav-arrow"><ChevronLeft size={20} /></button>
            <select 
              value={questionIndex} 
              onChange={(e) => setQuestionIndex(Number(e.target.value))}
              style={{ padding: '8px', border: 'none', background: 'transparent', fontSize: 16, fontWeight: 500, cursor: 'pointer', outline: 'none' }}
            >
              {form.questions.map((question, i) => (
                <option key={question.id} value={i}>{question.title || `Pregunta ${i + 1}`}</option>
              ))}
            </select>
            <button disabled={questionIndex === form.questions.length - 1} onClick={() => setQuestionIndex(v => v + 1)} className="nav-arrow"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="premium-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 400, marginBottom: 16 }}>{q.title}</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>{form.responses.length} {form.responses.length === 1 ? 'respuesta' : 'respuestas'}</p>
          {renderChart(q)}
        </div>
      </div>
    );
  };

  const renderIndividual = () => {
    const currentResp = form.responses[individualIndex];
    if (!currentResp) return null;

    return (
      <div className="individual-view fade-in">
        <div className="premium-card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             <button disabled={individualIndex === 0} onClick={() => setIndividualIndex(v => v - 1)} className="nav-arrow"><ChevronLeft size={20} /></button>
             <span>{individualIndex + 1} de {form.responses.length}</span>
             <button disabled={individualIndex === form.responses.length - 1} onClick={() => setIndividualIndex(v => v + 1)} className="nav-arrow"><ChevronRight size={20} /></button>
           </div>
           <div style={{ display: 'flex', gap: 12 }}>
             <button className="icon-btn"><Trash2 size={20} /></button>
             <button className="icon-btn"><Printer size={20} /></button>
           </div>
        </div>

        <div className="premium-card" style={{ borderTop: '8px solid var(--primary)', padding: 24 }}>
          <h2 style={{ fontSize: 32, marginBottom: 8 }}>{form.metadata.title}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Respuesta de: {currentResp.respondent_email || 'Anónimo'}</p>
        </div>

        {form.questions.map(q => (
          <div key={q.id} className="premium-card" style={{ padding: 24 }}>
            <p style={{ fontWeight: 500, marginBottom: 16 }}>{q.title}</p>
            <div style={{ color: 'var(--text-primary)', padding: '12px', background: '#f8f9fa', borderRadius: 4 }}>
               {Array.isArray(currentResp.answers[q.id]) 
                 ? currentResp.answers[q.id].join(', ') 
                 : currentResp.answers[q.id] || '(Vacío)'}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="analytics-dashboard" style={{ maxWidth: 770, margin: '0 auto', paddingBottom: 64 }}>
      <div className="sub-tabs-container" style={{ display: 'none' }}>{/* Accessibility or structural purposes if needed */}</div>
      {subTab === 'summary' ? (
        renderSummary()
      ) : subTab === 'question' ? (
        renderQuestionTab()
      ) : (
        renderIndividual()
      )}

      <style>{`
        .sub-tab {
          padding: 8px 4px;
          font-size: 14px;
          color: var(--text-secondary);
          border-bottom: 3px solid transparent;
          transition: 0.2s;
          background: none;
          border: none;
          cursor: pointer;
        }
        .sub-tab:hover { color: var(--text-primary); }
        .sub-tab.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
          font-weight: 500;
        }
        .icon-btn-outline {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border: 1px solid #dadce0;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          background: white;
          cursor: pointer;
        }
        .icon-btn-outline:hover { background: #f8f9fa; }
        .stat-card { margin-top: 12px; }
        .nav-arrow { 
          width: 36px; 
          height: 36px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: #5f6368;
          background: none;
          border: none;
          cursor: pointer;
        }
        .nav-arrow:hover:not(:disabled) { background: #f1f3f4; color: #202124; }
        .nav-arrow:disabled { opacity: 0.3; cursor: default; }

        @media (max-width: 768px) {
          .summary-header { flex-direction: column; align-items: flex-start !important; gap: 20px; }
          .summary-header h2 { font-size: 24px !important; }
          .sub-tabs { width: 100%; justify-content: space-between; gap: 12px !important; }
          .icon-btn-outline { width: 100%; justify-content: center; }
          .individual-view .premium-card { padding: 16px !important; }
          .individual-view h2 { font-size: 24px !important; }
        }

        @media (max-width: 480px) {
          .sub-tab { font-size: 12px; }
          .nav-arrow { width: 32px; height: 32px; }
        }
      `}</style>
    </div>
  );
};
