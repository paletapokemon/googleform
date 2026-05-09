import type { Database } from './lib/database.types';

export type DbForm = Database['public']['Tables']['forms']['Row'];
export type DbQuestion = Database['public']['Tables']['questions']['Row'];
export type DbResponse = Database['public']['Tables']['responses']['Row'];
export type DbAnswer = Database['public']['Tables']['answers']['Row'];

export type QuestionType = 
  | 'short_text' 
  | 'paragraph' 
  | 'multiple_choice' 
  | 'checkboxes' 
  | 'dropdown'
  | 'file_upload'
  | 'linear_scale'
  | 'multiple_choice_grid'
  | 'checkbox_grid'
  | 'date'
  | 'time';

export interface Option {
  id: string;
  text: string;
  image?: string;
}

// For UI state representation before saving, or when joined
export interface Question extends Omit<DbQuestion, 'type' | 'options'> {
  type: QuestionType;
  options: Option[] | null;
  // additional transient UI state can go here if needed
}

export interface FormState {
  metadata: DbForm;
  questions: Question[];
  responses: (DbResponse & { answers: Record<string, any> })[];
}

export interface SavedForm {
  id: string;
  title: string;
  lastModified: number;
  data: FormState;
}
