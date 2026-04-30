import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { FormState, Question } from '../../types';

interface Props {
  form: FormState;
}

const COLORS = ['#673ab7', '#9575cd', '#b39ddb', '#d1c4e9', '#ede7f6'];

export const AnalyticsDashboard: React.FC<Props> = ({ form }) => {
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
      <div className="no-responses premium-card">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Esperando respuestas</h3>
          <p>Envía el enlace a otras personas para empezar a recopilar datos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="premium-card summary-card">
        <h2 className="summary-title">{form.responses.length} respuestas</h2>
        <div className="summary-status">Aceptando respuestas</div>
      </div>

      {form.questions.map((q) => (
        <div key={q.id} className="premium-card stat-card fade-in">
          <h3 className="stat-q-title">{q.title || 'Pregunta sin título'}</h3>
          <p className="stat-q-responses">{form.responses.length} respuestas</p>
          
          {(q.type === 'multiple_choice' || q.type === 'checkboxes' || q.type === 'dropdown') ? (
            <div className="chart-container" style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={getChartData(q)} layout="vertical" margin={{ left: 20, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {getChartData(q).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-responses">
              {form.responses.map((r, i) => (
                <div key={i} className="text-response-item">
                  {r.answers[q.id] || '(Sin respuesta)'}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <style>{`
        .summary-title { font-size: 28px; font-weight: 400; margin-bottom: 8px; }
        .summary-status { color: #1e8e3e; font-weight: 500; font-size: 14px; }
        .stat-q-title { font-size: 16px; font-weight: 500; margin-bottom: 4px; }
        .stat-q-responses { font-size: 12px; color: var(--text-secondary); margin-bottom: 24px; }
        .text-response-item { background: #f8f9fa; padding: 12px; border-radius: 4px; margin-bottom: 8px; font-size: 14px; }
        .empty-state { text-align: center; padding: 40px 0; }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }
      `}</style>
    </div>
  );
};
