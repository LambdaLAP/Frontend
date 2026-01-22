import api from "./api";
import type { JSendResponse, Enrollment } from "../types/api";

export interface EnrollmentResult {
  enrollmentId: string;
}

export const userService = {
  getEnrollments: async (): Promise<Enrollment[]> => {
    const response = await api.get<JSendResponse<Enrollment[]>>("/users/enrollments");
    return response.data.data || [];
  },

  enrollInCourse: async (courseId: string): Promise<EnrollmentResult> => {
    const response = await api.post<JSendResponse<EnrollmentResult>>(
      "/users/enrollments",
      { courseId }
    );
    if (!response.data.data) {
        throw new Error("No enrollment data returned");
    }
    return response.data.data;
  },
};
