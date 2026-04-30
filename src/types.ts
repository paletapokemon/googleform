export type QuestionType = 'text' | 'paragraph' | 'multiple_choice' | 'checkboxes' | 'dropdown';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: Option[];
}

export interface FormMetadata {
  id: string;
  title: string;
  description: string;
  createdAt: number;
}

export interface FormResponse {
  id: string;
  formId: string;
  submittedAt: number;
  answers: Record<string, string | string[]>;
}

export interface FormState {
  metadata: FormMetadata;
  questions: Question[];
  responses: FormResponse[];
}
