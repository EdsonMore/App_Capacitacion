export type ModuleStatus = 'completed' | 'in_progress' | 'available' | 'locked';

export interface Lesson {
  id: string;
  moduleId: string;
  moduleTitle: string;
  lessonNumber: number;
  totalLessons: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  pointsReward: number;
  tag: string;
  videoDurationText: string;
  videoProgressText: string;
  keyPoints: {
    id: string;
    type: 'check' | 'critical';
    title: string;
    description: string;
  }[];
  quizId: string;
  quizQuestionCount: number;
}

export interface ModuleItem {
  id: string;
  number: number;
  title: string;
  description: string;
  durationText: string;
  lessonsText: string;
  status: ModuleStatus;
  statusText: string;
  progressPercent?: number;
  progressText?: string;
  scoreText?: string;
  pointsText?: string;
  category: 'all' | 'fundamentals' | 'cutting' | 'packaging';
  imageUri?: any;
  highlightTag?: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  questionNumber: number;
  totalQuestions: number;
  streakText: string;
  categoryTag: string;
  locationTag: string;
  title: string;
  imageFocusText: string;
  imageUri?: any;
  options: {
    id: string;
    letter: string;
    text: string;
  }[];
  correctOptionId: string;
  feedback: {
    title: string;
    subtitle: string;
    explanation: string;
    points: number;
    standardTag: string;
  };
}

export interface UserStats {
  streakDays: number;
  streakText: string;
  points: number;
  pointsDeltaText: string;
  routeProgressPercent: number;
  routeLessonsText: string;
  overallHarvestProgressPercent: number;
  currentFarmName: string;
}
