import { Category, DocumentTemplate, Order, User } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Kadrlar bo‘limi', slug: 'kadrlar', icon: 'Briefcase', count: 12 },
  { id: '2', name: 'Buxgalteriya', slug: 'buxgalteriya', icon: 'Calculator', count: 8 }
];

export const documents: DocumentTemplate[] = [
  {
    id: '101',
    title: 'Ishga qabul qilish to‘g‘risida buyruq',
    slug: 'ishga-qabul-qilish-buyruq',
    categoryId: '1',
    description: 'Xodimni ishga qabul qilishni rasmiylashtirish uchun standart buyruq shakli.',
    definition: 'Korxona rahbarining farmoyishi.',
    whenToUse: 'Yangi xodim ishga kirayotganda.',
    pricePdf: 5000,    // PDF narxi
    priceDocx: 15000,  // Word narxi
    fileName: 'buyruq.pdf',
    format: 'PDF',
    fields: [],
    previewText: `<div style="text-align: center;">BUYRUQ MATNI</div>`
  },
  // Qolgan hujjatlar uchun ham xuddi shunday pricePdf va priceDocx qo'shing
];

export const userOrders: Order[] = [
  { id: 'ORD-001', documentTitle: 'Hujjat 1', date: '2023-10-15', amount: 5000, status: 'completed', format: 'PDF' }
];

export const mockUser: User = {
  name: "Asan Tolepov",
  email: "asantolepov@gmail.com",
  role: "user",
  balance: 15000
};