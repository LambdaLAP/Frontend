export interface JSendResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
  details?: unknown;
}

export interface User {
  id: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  profileData?: {
    name: string;
  };
  stats?: {
    streakDays: number;
    totalXp: number;
    lessonsCompleted: number;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  tags: string[];
  isPublished?: boolean;
  meta: {
    lessonCount: number;
    durationHours: number;
  };
}

export interface Enrollment {
  courseId: string;
  title: string;
  totalLessons: number;
  completedLessons: number;
  lastAccessedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  orderIndex: number;
  type: 'LESSON' | 'CHALLENGE';
  status?: 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED'; // Inferred from syllabus
  contentMarkdown?: string;
}

export interface Challenge {
  id: string;
  lessonId: string;
  title: string;
  starterCode: string;
  language: string;
  testCases?: any[];
}

export interface ExecutionResult {
  status: 'PASS' | 'FAIL' | 'ERROR';
  stdout: string;
  stderr?: string;
  metrics: {
    runtime: string;
  };
}

export interface DashboardResponse {
  user: {
    name: string;
    avatar: string | null;
  };
  stats: {
    streakDays: number;
    totalXp: number;
    lessonsCompleted: number;
  };
  quickResume: {
    courseTitle: string;
    lessonId: string;
    lessonTitle: string;
  } | null;
}


export interface SyllabusResponse {
  course: {
    id: string;
    title: string;
    description: string;
  };
  userProgress: {
    percent: number;
  };
  lessons: {
    id: string;
    orderIndex: number;
    title: string;
    type: 'LESSON' | 'CHALLENGE';
    status: 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';
  }[];
}
