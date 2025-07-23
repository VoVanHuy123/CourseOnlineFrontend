import axios from "axios";

export const BASE_URL = "http://127.0.0.1:5000/";
// export const BASE_URL = "https://courseonline-yf2n.onrender.com";
export const endpoints = {
  login: "/auth/login",
  register: "/auth/register",
  categories: "/courses/categories",
  courses: "/courses",
  "course-chapters": (id) => `/courses/${id}/chapters`,
  course_teacher_not_public: (id) => `/courses/teacher/${id}/not-public`,
  course_teacher_public: (id) => `/courses/teacher/${id}/public`,
  chapters: `/courses/chapters`,
  refresh: `/auth/refresh`,
  lessons: `/courses/lessons`,
  update_chapter: (id) => `/courses/chapters/${id}`,
  update_lesson: (id) => `/courses/lessons/${id}`,
  update_course: (id) => `/courses/${id}`,
  enroll: (id) => `/courses/${id}/enroll`,
  enroll_free: (id) => `/courses/${id}/enroll-free`,
  course_detail: (id) => `/courses/${id}`,
  get_comments: "/comments/",
  create_comments: "/comments",
  course_progress: (id) => `/learning/courses/${id}/progress`,
  complete_lesson: (lessonId) => `/learning/lessons/${lessonId}/complete`,
  uncomplete_lesson: (lessonId) => `/learning/lessons/${lessonId}/uncomplete`,
  enrollment_status: (courseId) => `/courses/${courseId}/enrollment-status`,
};
// export const authApis = (token) => {
//     return axios.create({
//         baseURL: BASE_URL,
//         headers: {
//             "Authorization": `Bearer ${token}`
//         }
//     })
// }

export default axios.create({
  baseURL: BASE_URL,
});
