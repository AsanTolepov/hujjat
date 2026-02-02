export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  count: number;
}

export interface DocumentField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'number' | 'select';
  placeholder?: string;
  options?: string[]; // For select
  required: boolean;
  hint?: string;
  defaultValue?: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  description: string;
  definition: string;
  whenToUse: string;
  pricePdf: number;   // PDF narxi
  priceDocx: number;  // Word narxi
  fileName: string;
  format: string;
  fields: any[];
  previewText: string;
}

export interface Order {
  id: string;
  documentTitle: string;
  date: string;
  amount: number;
  status: 'completed' | 'processing' | 'failed';
  format: 'PDF' | 'DOCX';
}

export interface User {
  name: string;
  email: string;
  role: 'user' | 'admin';
  balance: number;
}