import { Trash2, Copy, GripVertical, MoreVertical, Image as ImageIcon } from 'lucide-react';
import type { Question, Option } from '../../types';
import { nanoid } from 'nanoid';
import { useRef } from 'react';

interface Props {
  question: Question;
  onUpdate: (updated: Question) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const QuestionCard: React.FC<Props> = ({ question, onUpdate, onDelete, onDuplicate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addOption = () => {
    const newOption: Option = { id: nanoid(), text: `Opción ${question.options?.length ? question.options.length + 1 : 1}` };
    onUpdate({ ...question, options: [...(question.options || []), newOption] });
  };

  const updateOption = (id: string, text: string) => {
    onUpdate({
      ...question,
      options: question.options?.map((o: Option) => o.id === id ? { ...o, text } : o) || null
    });
  };

  const removeOption = (id: string) => {
    onUpdate({
      ...question,
      options: question.options?.filter((o: Option) => o.id !== id) || null
    });
  };

  return (
    <div className="premium-card fade-in active-focus" style={{ borderLeft: '6px solid var(--primary)' }}>
      <div className="card-drag-handle">
        <GripVertical size={16} color="#dadce0" />
      </div>
      
      <div className="q-main-row">
        <input 
          className="q-title-input" 
          placeholder="Pregunta"
          value={question.title || ''}
          onChange={(e) => onUpdate({ ...question, title: e.target.value })}
        />
        <button className="icon-btn" title="Agregar imagen" onClick={() => fileInputRef.current?.click()} style={{ marginRight: 16 }}>
          <ImageIcon size={24} color="var(--text-secondary)" />
        </button>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" />

        <select 
          className="type-select"
          value={question.type}
          onChange={(e) => onUpdate({ ...question, type: e.target.value as any })}
          style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '4px' }}
        >
          <option value="short_text">Respuesta breve</option>
          <option value="paragraph">Párrafo</option>
          <hr />
          <option value="multiple_choice">Opción múltiple</option>
          <option value="checkboxes">Casillas de verificación</option>
          <option value="dropdown">Lista desplegable</option>
          <hr />
          <option value="file_upload">Carga de archivos</option>
          <hr />
          <option value="linear_scale">Escala lineal</option>
          <option value="multiple_choice_grid">Cuadrícula de opción múltiple</option>
          <option value="checkbox_grid">Cuadrícula de casillas de verificación</option>
          <hr />
          <option value="date">Fecha</option>
          <option value="time">Hora</option>
        </select>
      </div>

      <div className="q-options-area">
        {(question.type === 'multiple_choice' || question.type === 'checkboxes' || question.type === 'dropdown') && (
          <div className="options-list">
            {question.options?.map((opt: Option, i: number) => (
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
                  placeholder={`Opción ${i + 1}`}
                />
                <button className="icon-btn" title="Agregar imagen"><ImageIcon size={20} /></button>
                <button className="remove-opt" onClick={() => removeOption(opt.id)}>&times;</button>
              </div>
            ))}
            <div className="add-option-row" onClick={addOption}>
              <div className="option-marker">
                {question.type === 'multiple_choice' && <div className="radio-circle" />}
                {question.type === 'checkboxes' && <div className="checkbox-square" />}
                {question.type === 'dropdown' && <span className="opt-index">{question.options ? question.options.length + 1 : 1}.</span>}
              </div>
              <span className="add-text">Agregar una opción</span>
            </div>
          </div>
        )}

        {question.type === 'short_text' && <div className="text-placeholder">Texto de respuesta breve</div>}
        {question.type === 'paragraph' && <div className="text-placeholder">Texto de respuesta larga</div>}
        {question.type === 'date' && <div className="text-placeholder">Mes, día, año</div>}
        {question.type === 'time' && <div className="text-placeholder">Hora</div>}
        {question.type === 'file_upload' && <div className="text-placeholder">Los usuarios podrán subir archivos a Supabase Storage</div>}
        {(question.type === 'linear_scale' || question.type === 'multiple_choice_grid' || question.type === 'checkbox_grid') && (
           <div className="text-placeholder">Configuración de {question.type.replace('_', ' ')} (En desarrollo)</div>
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
              checked={question.is_required || false}
              onChange={(e) => onUpdate({ ...question, is_required: e.target.checked })}
            />
            <span className="slider round"></span>
          </label>
          <button className="footer-icon-btn"><MoreVertical size={20} /></button>
        </div>
      </div>

      <style>{`
        .q-main-row { display: flex; gap: 16px; margin-bottom: 24px; align-items: center; }
        .q-title-input {
          flex: 1;
          background: #f1f3f4;
          padding: 16px;
          font-size: 16px;
          border-bottom: 2px solid var(--text-primary);
          transition: border-color 0.2s, background-color 0.2s;
        }
        .q-title-input:focus {
          border-bottom-color: var(--primary);
          background: #e8eaed;
        }
        .q-options-area { margin-bottom: 24px; min-height: 40px; }
        .option-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .option-marker { width: 24px; display: flex; justify-content: center; }
        .radio-circle { width: 18px; height: 18px; border: 2px solid #dadce0; border-radius: 50%; }
        .checkbox-square { width: 18px; height: 18px; border: 2px solid #dadce0; border-radius: 2px; }
        .opt-index { color: var(--text-secondary); font-size: 14px; }
        .option-input { flex: 1; border-bottom: 1px solid transparent; padding: 8px 0; font-size: 14px; transition: border-bottom-color 0.2s; }
        .option-input:focus { border-bottom-color: var(--primary); }
        .option-input:hover:not(:focus) { border-bottom-color: var(--border); }
        .remove-opt { color: var(--text-secondary); font-size: 24px; padding: 0 8px; cursor: pointer; }
        .remove-opt:hover { color: var(--text-primary); }
        .add-option-row { display: flex; align-items: center; gap: 12px; cursor: pointer; color: var(--text-secondary); padding: 8px 0; }
        .add-text:hover { border-bottom: 1px solid var(--border); }
        .text-placeholder { color: #70757a; border-bottom: 1px dotted #dadce0; padding: 8px 0; width: 50%; font-size: 14px; }
        
        .card-drag-handle { display: flex; justify-content: center; margin-bottom: 8px; cursor: move; }
        .card-footer { display: flex; justify-content: flex-end; align-items: center; border-top: 1px solid var(--border); padding-top: 12px; gap: 12px; }
        .footer-left { display: flex; gap: 8px; }
        .footer-icon-btn { color: var(--text-secondary); padding: 8px; border-radius: 50%; transition: background 0.2s; }
        .footer-icon-btn:hover { background: #f1f3f4; color: var(--text-primary); }
        .footer-divider { width: 1px; height: 32px; background: var(--border); margin: 0 8px; }
        .footer-right { display: flex; align-items: center; gap: 12px; }
        .required-label { font-size: 14px; color: var(--text-primary); }
        
        /* Toggle Switch */
        .switch { position: relative; display: inline-block; width: 36px; height: 14px; margin-top: 4px;}
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #b9b9b9; transition: .4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: -2px; bottom: -3px; background-color: #fff; transition: .4s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.4); }
        input:checked + .slider { background-color: var(--primary-light); }
        input:checked + .slider:before { transform: translateX(20px); background-color: var(--primary); }
      `}</style>
    </div>
  );
};

