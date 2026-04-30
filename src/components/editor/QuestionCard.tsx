import React from 'react';
import { Trash2, Copy, GripVertical, MoreVertical, CheckCircle2 } from 'lucide-react';
import { Question, Option } from '../types';
import { nanoid } from 'nanoid';

interface Props {
  question: Question;
  onUpdate: (updated: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const QuestionCard: React.FC<Props> = ({ question, onUpdate, onDelete, onDuplicate }) => {
  const addOption = () => {
    const newOption: Option = { id: nanoid(), text: `Opción ${question.options?.length ? question.options.length + 1 : 1}` };
    onUpdate({ ...question, options: [...(question.options || []), newOption] });
  };

  const updateOption = (id: string, text: string) => {
    onUpdate({
      ...question,
      options: question.options?.map(o => o.id === id ? { ...o, text } : o)
    });
  };

  const removeOption = (id: string) => {
    onUpdate({
      ...question,
      options: question.options?.filter(o => o.id !== id)
    });
  };

  return (
    <div className="premium-card fade-in active-focus">
      <div className="card-drag-handle">
        <GripVertical size={16} color="#dadce0" />
      </div>
      
      <div className="q-main-row">
        <input 
          className="q-title-input" 
          placeholder="Pregunta"
          value={question.title}
          onChange={(e) => onUpdate({ ...question, title: e.target.value })}
        />
        <select 
          className="type-select"
          value={question.type}
          onChange={(e) => onUpdate({ ...question, type: e.target.value as any })}
        >
          <option value="text">Respuesta breve</option>
          <option value="paragraph">Párrafo</option>
          <option value="multiple_choice">Opción múltiple</option>
          <option value="checkboxes">Casillas de verificación</option>
          <option value="dropdown">Desplegable</option>
        </select>
      </div>

      <div className="q-options-area">
        {(question.type === 'multiple_choice' || question.type === 'checkboxes' || question.type === 'dropdown') && (
          <div className="options-list">
            {question.options?.map((opt, i) => (
              <div key={opt.id} className="option-row">
                <div className="option-marker">
                  {question.type === 'multiple_choice' && <div className="radio-circle" />}
                  {question.type === 'checkboxes' && <div className="checkbox-square" />}
                  {question.type === 'dropdown' && <span className="opt-index">{i + 1}.</span>}
                </div>
                <input 
                  className="option-input"
                  value={opt.text}
                  onChange={(e) => updateOption(opt.id, e.target.value)}
                  autoFocus={opt.text === ''}
                />
                <button className="remove-opt" onClick={() => removeOption(opt.id)}>&times;</button>
              </div>
            ))}
            <div className="add-option-row" onClick={addOption}>
              <div className="option-marker">
                {question.type === 'multiple_choice' && <div className="radio-circle" />}
                {question.type === 'checkboxes' && <div className="checkbox-square" />}
              </div>
              <span className="add-text">Agregar una opción</span>
            </div>
          </div>
        )}

        {question.type === 'text' && (
          <div className="text-placeholder">Texto de respuesta breve</div>
        )}
        {question.type === 'paragraph' && (
          <div className="text-placeholder">Texto de respuesta larga</div>
        )}
      </div>

      <div className="card-footer">
        <div className="footer-left">
          <button className="footer-icon-btn" onClick={onDuplicate} title="Duplicar"><Copy size={20} /></button>
          <button className="footer-icon-btn" onClick={onDelete} title="Eliminar"><Trash2 size={20} /></button>
        </div>
        <div className="footer-divider" />
        <div className="footer-right">
          <span className="required-label">Obligatorio</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={question.required}
              onChange={(e) => onUpdate({ ...question, required: e.target.checked })}
            />
            <span className="slider round"></span>
          </label>
          <button className="footer-icon-btn"><MoreVertical size={20} /></button>
        </div>
      </div>

      <style>{`
        .q-main-row { display: flex; gap: 16px; margin-bottom: 24px; }
        .q-title-input {
          flex: 1;
          background: #f1f3f4;
          padding: 16px;
          font-size: 16px;
          border-bottom: 2px solid transparent;
          transition: border-color 0.2s;
        }
        .q-title-input:focus {
          border-bottom-color: var(--primary);
          background: #e8eaed;
        }
        .q-options-area { margin-bottom: 24px; min-height: 40px; }
        .option-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .option-marker { width: 20px; display: flex; justify-content: center; }
        .radio-circle { width: 18px; height: 18px; border: 2px solid #dadce0; border-radius: 50%; }
        .checkbox-square { width: 18px; height: 18px; border: 2px solid #dadce0; border-radius: 2px; }
        .option-input { border-bottom: 1px solid transparent; padding: 4px 0; font-size: 14px; }
        .option-input:focus { border-bottom-color: var(--border); }
        .remove-opt { color: var(--text-secondary); font-size: 20px; padding: 0 8px; }
        .add-option-row { display: flex; align-items: center; gap: 12px; cursor: pointer; color: var(--text-secondary); }
        .add-text:hover { border-bottom: 1px solid var(--border); }
        .text-placeholder { color: #70757a; border-bottom: 1px dotted #dadce0; padding: 8px 0; width: 50%; font-size: 14px; }
        
        .card-drag-handle { display: flex; justify-content: center; margin-bottom: 8px; cursor: move; }
        .card-footer { display: flex; justify-content: flex-end; align-items: center; border-top: 1px solid var(--border); padding-top: 12px; gap: 12px; }
        .footer-left { display: flex; gap: 8px; }
        .footer-icon-btn { color: var(--text-secondary); padding: 8px; border-radius: 50%; }
        .footer-icon-btn:hover { background: #f1f3f4; }
        .footer-divider { width: 1px; height: 32px; background: var(--border); margin: 0 8px; }
        .footer-right { display: flex; align-items: center; gap: 12px; }
        .required-label { font-size: 14px; color: var(--text-primary); }
        
        /* Toggle Switch */
        .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background-color: var(--primary); }
        input:checked + .slider:before { transform: translateX(20px); }
      `}</style>
    </div>
  );
};
