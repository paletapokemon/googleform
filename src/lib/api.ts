import { supabase } from './supabase';
import type { DbForm, Question, Option, QuestionType } from '../types';

export const api = {
  // Forms
  async fetchForms() {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as DbForm[];
  },

  async createForm() {
    const { data, error } = await supabase
      .from('forms')
      .insert({
        title: 'Formulario sin título',
        description: '',
        is_quiz: false,
        settings: { theme: { primaryColor: '#673ab7' } }
      })
      .select()
      .single();

    if (error) throw error;
    
    // Add default question
    await this.createQuestion(data.id, 0);

    return data as DbForm;
  },

  async getFormById(id: string) {
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .single();

    if (formError) throw formError;

    const { data: questions, error: qError } = await supabase
      .from('questions')
      .select('*')
      .eq('form_id', id)
      .order('order_index', { ascending: true });

    if (qError) throw qError;

    return {
      metadata: form as DbForm,
      questions: (questions || []).map(q => ({
        ...q,
        type: q.type as QuestionType,
        options: q.options as Option[] | null
      })) as Question[],
      responses: [] // To be fetched separately if needed
    };
  },

  async updateForm(id: string, updates: Partial<DbForm>) {
    const { error } = await supabase
      .from('forms')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  },

  async deleteForm(id: string) {
    const { error } = await supabase
      .from('forms')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Questions
  async createQuestion(formId: string, orderIndex: number) {
    const { data, error } = await supabase
      .from('questions')
      .insert({
        form_id: formId,
        title: 'Pregunta sin título',
        type: 'multiple_choice',
        is_required: false,
        order_index: orderIndex,
        options: [{ id: crypto.randomUUID(), text: 'Opción 1' }]
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      type: data.type as QuestionType,
      options: data.options as Option[] | null
    } as Question;
  },

  async updateQuestion(id: string, updates: Partial<Question>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { options, type, ...rest } = updates;
    
    const dbUpdates: any = { ...rest };
    if (type) dbUpdates.type = type;
    if (options !== undefined) dbUpdates.options = options;

    const { error } = await supabase
      .from('questions')
      .update(dbUpdates)
      .eq('id', id);

    if (error) throw error;
  },

  async deleteQuestion(id: string) {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Storage
  async uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('form-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('form-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Responses
  async submitResponse(formId: string, answers: Record<string, any>, email: string) {
    const { data: response, error: respError } = await supabase
      .from('responses')
      .insert({
        form_id: formId,
        respondent_email: email,
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (respError) throw respError;

    const answerInserts = Object.entries(answers).map(([qId, value]) => ({
      response_id: response.id,
      question_id: qId,
      value: value
    }));

    const { error: ansError } = await supabase
      .from('answers')
      .insert(answerInserts);

    if (ansError) throw ansError;
  }
};
