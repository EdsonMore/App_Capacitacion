import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lesson, ModuleItem, QuizQuestion, UserStats } from '@/types';
import { CURRENT_LESSON, MODULES_LIST, QUIZ_QUESTION_DEMO, USER_STATS } from '@/constants/mockData';
import { isSupabaseConfigured, supabase } from './supabase';

const STORAGE_KEYS = {
  USER_STATS: '@purafruit_user_stats',
  MODULES: '@purafruit_modules',
  COMPLETED_LESSONS: '@purafruit_completed_lessons',
};

export const dataService = {
  async getUserStats(): Promise<UserStats> {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('user_stats')
          .select('*')
          .limit(1)
          .single();
        if (!error && data) {
          return {
            streakDays: data.streak_days ?? USER_STATS.streakDays,
            streakText: data.streak_text ?? USER_STATS.streakText,
            points: data.points ?? USER_STATS.points,
            pointsDeltaText: data.points_delta_text ?? USER_STATS.pointsDeltaText,
            routeProgressPercent: data.route_progress_percent ?? USER_STATS.routeProgressPercent,
            routeLessonsText: data.route_lessons_text ?? USER_STATS.routeLessonsText,
            overallHarvestProgressPercent: data.overall_harvest_progress_percent ?? USER_STATS.overallHarvestProgressPercent,
            currentFarmName: data.current_farm_name ?? USER_STATS.currentFarmName,
          };
        }
      }

      // Persistencia local en AsyncStorage
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
      if (raw) {
        return JSON.parse(raw) as UserStats;
      }
    } catch (e) {
      console.warn('Error fetching user stats:', e);
    }
    return USER_STATS;
  },

  async updateUserStats(partial: Partial<UserStats>): Promise<UserStats> {
    const current = await this.getUserStats();
    const updated: UserStats = { ...current, ...partial };

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updated));

      if (isSupabaseConfigured && supabase) {
        await supabase
          .from('user_stats')
          .upsert({
            id: 1,
            streak_days: updated.streakDays,
            streak_text: updated.streakText,
            points: updated.points,
            points_delta_text: updated.pointsDeltaText,
            route_progress_percent: updated.routeProgressPercent,
            route_lessons_text: updated.routeLessonsText,
            overall_harvest_progress_percent: updated.overallHarvestProgressPercent,
            current_farm_name: updated.currentFarmName,
            updated_at: new Date().toISOString(),
          });
      }
    } catch (e) {
      console.warn('Error saving user stats:', e);
    }

    return updated;
  },

  async getModules(): Promise<ModuleItem[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.MODULES);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Preservar requires locales de imágenes
        return MODULES_LIST.map((m) => {
          const found = parsed.find((p: any) => p.id === m.id);
          return found ? { ...m, ...found, imageUri: m.imageUri } : m;
        });
      }
    } catch (e) {
      console.warn('Error reading modules:', e);
    }
    return MODULES_LIST;
  },

  async getLesson(id: string): Promise<Lesson> {
    // Por ahora retornamos la lección actual modelada según Stitch
    return CURRENT_LESSON;
  },

  async getQuiz(id: string): Promise<QuizQuestion> {
    // Por ahora retornamos la pregunta de evaluación de campo según Stitch
    return QUIZ_QUESTION_DEMO;
  },

  async recordQuizSuccess(pointsGained: number): Promise<UserStats> {
    const stats = await this.getUserStats();
    const newPoints = stats.points + pointsGained;
    return await this.updateUserStats({
      points: newPoints,
      pointsDeltaText: `+${pointsGained} hoy`,
      routeProgressPercent: Math.min(100, stats.routeProgressPercent + 5),
    });
  },

  async completeLesson(lessonId: string): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
      const list = raw ? JSON.parse(raw) : [];
      if (!list.includes(lessonId)) {
        list.push(lessonId);
        await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(list));
      }
    } catch (e) {
      console.warn('Error recording completed lesson:', e);
    }
  },
};
