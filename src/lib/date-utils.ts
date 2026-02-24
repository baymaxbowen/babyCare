import { differenceInDays, differenceInWeeks, addDays, format, startOfDay } from 'date-fns';
import type { PregnancyInfo, BabySize } from '../types/user';

const PREGNANCY_DURATION_DAYS = 280; // 40 weeks

export function calculateWeeksPregnant(dueDate: Date): { weeks: number; days: number } {
  const startDate = addDays(dueDate, -PREGNANCY_DURATION_DAYS);
  const today = startOfDay(new Date());

  const totalDays = differenceInDays(today, startDate);
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;

  return { weeks, days };
}

export function calculateDaysUntilDue(dueDate: Date): number {
  const today = startOfDay(new Date());
  return differenceInDays(dueDate, today);
}

export function getTrimester(weeks: number): 'early' | 'mid' | 'late' {
  if (weeks < 14) return 'early';
  if (weeks < 28) return 'mid';
  return 'late';
}

export function getBabySizeForWeek(weeks: number): BabySize {
  const sizes: Record<number, BabySize> = {
    4: { name: '罂粟籽', emoji: '🌱', lengthCm: 0.2 },
    5: { name: '芝麻', emoji: '🌾', lengthCm: 0.3 },
    6: { name: '豌豆', emoji: '🫛', lengthCm: 0.5 },
    7: { name: '蓝莓', emoji: '🫐', lengthCm: 1.0 },
    8: { name: '覆盆子', emoji: '🍒', lengthCm: 1.6 },
    9: { name: '葡萄', emoji: '🍇', lengthCm: 2.3 },
    10: { name: '草莓', emoji: '🍓', lengthCm: 3.1 },
    11: { name: '青梅', emoji: '🫒', lengthCm: 4.1 },
    12: { name: '西梅', emoji: '🌰', lengthCm: 5.4 },
    13: { name: '柠檬', emoji: '🍋', lengthCm: 7.4 },
    14: { name: '桃子', emoji: '🍑', lengthCm: 8.7 },
    15: { name: '苹果', emoji: '🍎', lengthCm: 10.1 },
    16: { name: '鳄梨', emoji: '🥑', lengthCm: 11.6 },
    17: { name: '梨子', emoji: '🍐', lengthCm: 13.0 },
    18: { name: '甜椒', emoji: '🫑', lengthCm: 14.2 },
    19: { name: '番茄', emoji: '🍅', lengthCm: 15.3 },
    20: { name: '香蕉', emoji: '🍌', lengthCm: 16.4 },
    21: { name: '胡萝卜', emoji: '🥕', lengthCm: 26.7 },
    22: { name: '木瓜', emoji: '🥭', lengthCm: 27.8 },
    23: { name: '柚子', emoji: '🍊', lengthCm: 28.9 },
    24: { name: '玉米', emoji: '🌽', lengthCm: 30.0 },
    25: { name: '花椰菜', emoji: '🥦', lengthCm: 34.6 },
    26: { name: '生菜', emoji: '🥬', lengthCm: 35.6 },
    27: { name: '卷心菜', emoji: '🥬', lengthCm: 36.6 },
    28: { name: '茄子', emoji: '🍆', lengthCm: 37.6 },
    29: { name: '南瓜', emoji: '🎃', lengthCm: 38.6 },
    30: { name: '黄瓜', emoji: '🥒', lengthCm: 39.9 },
    31: { name: '椰子', emoji: '🥥', lengthCm: 41.1 },
    32: { name: '菠萝', emoji: '🍍', lengthCm: 42.4 },
    33: { name: '凤梨', emoji: '🍍', lengthCm: 43.7 },
    34: { name: '哈密瓜', emoji: '🍈', lengthCm: 45.0 },
    35: { name: '蜜瓜', emoji: '🍈', lengthCm: 46.2 },
    36: { name: '木瓜', emoji: '🥭', lengthCm: 47.4 },
    37: { name: '冬瓜', emoji: '🍈', lengthCm: 48.6 },
    38: { name: '西瓜', emoji: '🍉', lengthCm: 49.8 },
    39: { name: '大西瓜', emoji: '🍉', lengthCm: 50.7 },
    40: { name: '大南瓜', emoji: '🎃', lengthCm: 51.2 },
  };

  return sizes[weeks] || { name: '小宝宝', emoji: '👶', lengthCm: 50 };
}

export function getPregnancyInfo(dueDate: Date): PregnancyInfo {
  const { weeks, days } = calculateWeeksPregnant(dueDate);
  const daysUntilDue = calculateDaysUntilDue(dueDate);
  const trimester = getTrimester(weeks);
  const babySize = getBabySizeForWeek(weeks);

  return {
    weeks,
    days,
    daysUntilDue,
    trimester,
    babySize,
  };
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateTime(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm');
}

export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}
