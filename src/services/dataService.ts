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

export const dataService = {
  async getUserStats(): Promise<UserStats> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
      if (raw) return JSON.parse(raw) as UserStats;
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
    const lesson = Object.values(LESSONS_BY_MODULE_ID).find((item) => item.id === id);
    if (!lesson) throw new Error(`No existe una lección mock para el ID "${id}".`);
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
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_QUIZZES);
    const completedQuizzes: string[] = raw ? JSON.parse(raw) : [];
    if (completedQuizzes.includes(quizId)) {
      return this.getUserStats();
    }

    const lesson = Object.values(LESSONS_BY_MODULE_ID).find((item) => item.quizId === quizId);
    if (!lesson) throw new Error(`No existe una lección para la evaluación "${quizId}".`);
    const quizQuestions = QUIZ_QUESTIONS_BY_ID[quizId];
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
    const updatedModules = modules.map((module) =>
      module.id === lesson.moduleId
        ? {
            ...module,
            status: 'completed' as const,
            statusText: 'Completado',
            progressPercent: 100,
            progressText: `${lesson.totalLessons} de ${lesson.totalLessons} lecciones completadas`,
            scoreText: `Calificación: ${scorePercent}%`,
          }
        : module
    );
    await AsyncStorage.setItem(STORAGE_KEYS.MODULES, JSON.stringify(updatedModules));
    return updatedStats;
  },

  async completeLesson(lessonId: string): Promise<void> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
      const completedLessons: string[] = raw ? JSON.parse(raw) : [];
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
};
