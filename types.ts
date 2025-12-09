export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum ActivityLevel {
  SEDENTARY = 'SEDENTARY', // Little or no exercise
  LIGHTLY_ACTIVE = 'LIGHTLY_ACTIVE', // Light exercise 1-3 days/week
  MODERATELY_ACTIVE = 'MODERATELY_ACTIVE', // Moderate exercise 3-5 days/week
  VERY_ACTIVE = 'VERY_ACTIVE', // Hard exercise 6-7 days/week
  EXTRA_ACTIVE = 'EXTRA_ACTIVE' // Very hard exercise & physical job
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm
  gender: Gender;
  activityLevel: ActivityLevel;
  goal: 'LOSE' | 'MAINTAIN' | 'GAIN';
  tdee?: number; // Total Daily Energy Expenditure
}

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  macros: Macros;
  timestamp: number;
  type: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
}

export interface DailyLog {
  date: string; // ISO Date string YYYY-MM-DD
  meals: Meal[];
}
