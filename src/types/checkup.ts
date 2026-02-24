export interface Checkup {
  id?: number;
  date: Date;
  type: CheckupType;
  location?: string;
  notes?: string;
  reminderEnabled: boolean;
  reminderTimes: number[]; // minutes before (e.g., [1440, 180, 30])
  completed: boolean;
  createdAt: Date;
}

export type CheckupType =
  | '初查'
  | '唐氏筛查'
  | 'NT检查'
  | '大排畸'
  | '糖耐量测试'
  | '常规产检'
  | '其他';

export const CHECKUP_TYPES: CheckupType[] = [
  '初查',
  'NT检查',
  '唐氏筛查',
  '大排畸',
  '糖耐量测试',
  '常规产检',
  '其他',
];

export interface CheckupTemplate {
  type: CheckupType;
  week: number;
  description: string;
}

export const CHECKUP_TEMPLATES: CheckupTemplate[] = [
  { type: '初查', week: 6, description: '确认妊娠，建立孕期档案' },
  { type: 'NT检查', week: 11, description: '胎儿颈部透明带检查' },
  { type: '唐氏筛查', week: 15, description: '唐氏综合征筛查' },
  { type: '大排畸', week: 20, description: '胎儿畸形筛查' },
  { type: '糖耐量测试', week: 24, description: '妊娠期糖尿病筛查' },
];
