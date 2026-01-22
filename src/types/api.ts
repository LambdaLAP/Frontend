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
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
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
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
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
  orderIndex?: number; // Optional in Get Lesson Details
  type: "LESSON" | "CHALLENGE" | "PROJECT" | "QUIZ"; // Added other types just in case
  status?: "LOCKED" | "IN_PROGRESS" | "COMPLETED";
  contentMarkdown?: string;
  courseId?: string;
  challenges?: Challenge[]; // API returns an array
  nextLessonId?: string;
  prevLessonId?: string;
}

export interface Challenge {
  id: string;
  lessonId?: string;
  title: string;
  description?: string;
  starterCodes: Record<string, string>; // Map of language -> code
  solutionCodes?: Record<string, string>;
  testCases?: TestCase[]; // Students see only isHidden: false
}

export interface TestCase {
  input: any;
  expectedOutput: any;
  isHidden: boolean;
}

export interface ExecutionResult {
  status: "PASS" | "FAIL" | "ERROR" | "PASSED" | "FAILED"; // Covering both run and submit variations
  stdout: string;
  stderr?: string;
  metrics: {
    runtime: string;
    memoryUsed?: string;
  };
}

export interface SubmissionResult extends ExecutionResult {
  submissionId: string;
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
    type: "LESSON" | "CHALLENGE";
    status: "LOCKED" | "IN_PROGRESS" | "COMPLETED";
  }[];
}
