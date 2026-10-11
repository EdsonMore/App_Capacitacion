import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lesson, ModuleItem, QuizQuestion, UserStats } from '@/types';
import {
  LESSONS_BY_MODULE_ID,
  MODULES_LIST,
  QUIZ_QUESTIONS_BY_ID,
  USER_STATS,
} from '@/constants/mockData';

const STORAGE_KEYS = {
  USER_STATS: '@purafruit_user_stats',
  MODULES: '@purafruit_modules',
  COMPLETED_LESSONS: '@purafruit_completed_lessons',
  COMPLETED_QUIZZES: '@purafruit_completed_quizzes',
};

async function readStringList(key: string): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch (e) {
    console.warn(`Error reading ${key}:`, e);
    return [];
  }
}

export const dataService = {
  async getUserStats(): Promise<UserStats> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
      if (raw) return { ...USER_STATS, ...(JSON.parse(raw) as Partial<UserStats>) };
    } catch (e) {
      console.warn('Error fetching user stats:', e);
    }
    return USER_STATS;
  },

  async updateUserStats(partial: Partial<UserStats>): Promise<UserStats> {
    const current = await this.getUserStats();
    const updated: UserStats = { ...current, ...partial };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updated));
    return updated;
  },

  async getModules(): Promise<ModuleItem[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.MODULES);
      if (raw) {
        const parsed = JSON.parse(raw) as ModuleItem[];
        return MODULES_LIST.map((module) => {
          const savedModule = parsed.find((item) => item.id === module.id);
          return savedModule ? { ...module, ...savedModule, imageUri: module.imageUri } : module;
        });
      }
    } catch (e) {
      console.warn('Error reading modules:', e);
    }
    return MODULES_LIST;
  },

  async getLesson(id: string): Promise<Lesson> {
    let lesson = Object.values(LESSONS_BY_MODULE_ID).find((item) => item.id === id);
    if (!lesson && LESSONS_BY_MODULE_ID[id]) {
      lesson = LESSONS_BY_MODULE_ID[id];
    }
    if (!lesson) {
      lesson = Object.values(LESSONS_BY_MODULE_ID).find((item) => item.moduleId === id);
    }
    if (!lesson) {
      lesson = LESSONS_BY_MODULE_ID['mod-1'];
    }
    return lesson;
  },

  async getQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
    const questions = QUIZ_QUESTIONS_BY_ID[quizId];
    if (!questions) throw new Error(`No existe una evaluación mock para el ID "${quizId}".`);
    return questions;
  },

  async getQuiz(quizId: string): Promise<QuizQuestion> {
    const [question] = await this.getQuizQuestions(quizId);
    return question;
  },

  async recordQuizSuccess(quizId: string, pointsGained: number): Promise<UserStats> {
    const completedQuizzes = await readStringList(STORAGE_KEYS.COMPLETED_QUIZZES);
    if (completedQuizzes.includes(quizId)) {
      return this.getUserStats();
    }

    const lesson = Object.values(LESSONS_BY_MODULE_ID).find((item) => item.quizId === quizId);
    if (!lesson) throw new Error(`No existe una lección para la evaluación "${quizId}".`);
    const quizQuestions = QUIZ_QUESTIONS_BY_ID[quizId] ?? [];
    const maximumPoints = quizQuestions.reduce((total, question) => total + question.feedback.points, 0);
    const scorePercent = maximumPoints ? Math.round((pointsGained / maximumPoints) * 100) : 0;

    completedQuizzes.push(quizId);
    await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_QUIZZES, JSON.stringify(completedQuizzes));

    const stats = await this.getUserStats();
    const updatedStats = await this.updateUserStats({
      points: stats.points + pointsGained,
      pointsDeltaText: `+${pointsGained} hoy`,
    });
    const modules = await this.getModules();
    const currentModule = modules.find((m) => m.id === lesson.moduleId);
    const updatedModules = modules.map((module) => {
      if (module.id === lesson.moduleId) {
        return {
          ...module,
          status: 'completed' as const,
          statusText: 'Completado',
          progressPercent: 100,
          progressText: `${lesson.totalLessons} de ${lesson.totalLessons} lecciones completadas`,
          scoreText: `Calificación: ${scorePercent}%`,
        };
      }
      if (currentModule && module.number === currentModule.number + 1 && module.status === 'locked') {
        return {
          ...module,
          status: 'available' as const,
          statusText: 'Disponible',
        };
      }
      return module;
    });
    await AsyncStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(updatedModules));
    return updatedStats;
  },

  async completeLesson(lessonId: string): Promise<void> {
    try {
      const completedLessons = await readStringList(STORAGE_KEYS.COMPLETED_LESSONS);
      if (completedLessons.includes(lessonId)) return;

      const lesson = Object.values(LESSONS_BY_MODULE_ID).find((item) => item.id === lessonId);
      if (!lesson) throw new Error(`No existe una lección mock para el ID "${lessonId}".`);

      completedLessons.push(lessonId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.COMPLETED_LESSONS,
        JSON.stringify(completedLessons)
      );

      const modules = await this.getModules();
      const currentModule = modules.find((module) => module.id === lesson.moduleId);
      const wasAlreadyCompleted = currentModule?.status === 'completed';
      const previousCompletedCount = currentModule?.progressPercent
        ? Math.round((currentModule.progressPercent / 100) * lesson.totalLessons)
        : 0;
      const completedCount = Math.min(lesson.totalLessons, previousCompletedCount + 1);
      const progressPercent = Math.round((completedCount / lesson.totalLessons) * 100);
      const updatedModules = modules.map((module) =>
        module.id === lesson.moduleId && !wasAlreadyCompleted
          ? {
              ...module,
              status: 'in_progress' as const,
              statusText: 'Evaluación pendiente',
              progressPercent,
              progressText: `${completedCount} de ${lesson.totalLessons} lecciones completadas`,
            }
          : module
      );
      await AsyncStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(updatedModules));

      if (!wasAlreadyCompleted) {
        const stats = await this.getUserStats();
        const lessonProgress = stats.routeLessonsText.match(/^(\d+)\/(\d+)(.*)$/);
        const routeCompletedCount = lessonProgress
          ? Math.min(Number(lessonProgress[1]) + 1, Number(lessonProgress[2]))
          : undefined;
        await this.updateUserStats({
          routeProgressPercent: Math.min(100, stats.routeProgressPercent + 5),
          routeLessonsText: lessonProgress
            ? `${routeCompletedCount}/${lessonProgress[2]}${lessonProgress[3]}`
            : stats.routeLessonsText,
          overallHarvestProgressPercent: Math.min(100, stats.overallHarvestProgressPercent + 5),
        });
      }
    } catch (e) {
      console.warn('Error recording completed lesson:', e);
      throw e;
    }
  },
  async resetProgress(toDemo: boolean = false): Promise<void> {
    try {
      if (toDemo) {
        await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
        await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(USER_STATS));
        await AsyncStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(MODULES_LIST));
      } else {
        const cleanStats: UserStats = {
          streakDays: 1,
          streakText: 'Día 1',
          points: 0,
          pointsDeltaText: '+0 hoy',
          routeProgressPercent: 0,
          routeLessonsText: '0/20 lecc.',
          overallHarvestProgressPercent: 0,
          currentFarmName: 'FUNDO LOS VALLES',
        };
        const cleanModules: ModuleItem[] = MODULES_LIST.map((m, index) => ({
          ...m,
          status: index === 0 ? 'available' : 'locked',
          statusText: index === 0 ? 'Disponible' : 'Bloqueado',
          progressPercent: 0,
          progressText: `0 de ${m.lessonsText}`,
          scoreText: undefined,
        }));
        await AsyncStorage.multiRemove([STORAGE_KEYS.COMPLETED_LESSONS, STORAGE_KEYS.COMPLETED_QUIZZES]);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(cleanStats));
        await AsyncStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(cleanModules));
      }
    } catch (e) {
      console.warn('Error resetting progress:', e);
      throw e;
    }
  },
};
