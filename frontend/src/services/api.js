import axios from "axios";

export const BASE_URL = "http://127.0.0.1:5000/";
// export const BASE_URL = "https://courseonline-yf2n.onrender.com";
export const endpoints = {
  login: "/auth/login",
  register: "/auth/register",
  categories: "/courses/categories",
  courses: "/courses",
  search_courses: (query) => `/courses/search?query=${encodeURIComponent(query)}`,
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
  stats_total_students: "/stats/total-students",
  stats_chapter_lesson: "/stats/chapters-lessons",
  stats_avg_lessons: "/stats/avg-lessons-per-chapter",
  stats_publish_rate: "/stats/published-lesson-rate",
  stats_avg_rating: "/stats/avg-rating",
  stats_students_completed: "/stats/students-completed-lessons",
  get_comments: "/comments/",
  create_comments: "/comments",
  course_progress: (id) => `/learning/courses/${id}/progress`,
  complete_lesson: (lessonId) => `/learning/lessons/${lessonId}/complete`,
  uncomplete_lesson: (lessonId) => `/learning/lessons/${lessonId}/uncomplete`,
  enrollment_status: (courseId) => `/courses/${courseId}/enrollment-status`,

  comments: "/comments",
  get_reviews: "/reviews",
  reviews: "/reviews",
  un_validate_teacher: "/auth/teachers/unverified",
  validate_teacher: (id) => `/auth/teachers/validate/${id}`,

  delete_lesson: (lesson_id) => `/courses/lesson/${lesson_id}`,
  delete_chapter: (chapter_id) => `/courses/chapter/${chapter_id}`,

  get_teacher: (teacher_id) => `/auth/teachers/${teacher_id}`,
  get_student: (student_id) => `/auth/students/${student_id}`,
  // "get_admin":(admin_id)=>`/auth/admins/${admin_id}`,
  auth: "/auth",
  lesson_histories: `/courses/lesson-histories`,
  lesson_history: (id) => `/courses/lesson-history/${id}`,
};
// export const authApis = (token) => {
//     return axios.create({
//         baseURL: BASE_URL,
//         headers: {
//             "Authorization": `Bearer ${token}`
//         }
//     })
// }

// Payment endpoints
export const payment = {
  vnpay: () => `${BASE_URL}/payment/vnpay`,
  momo: () => `${BASE_URL}/payment/momo`,
  momo_ipn: () => `${BASE_URL}/payment/momo/ipn`,
  momo_test_ipn: () => `${BASE_URL}/payment/momo/test-ipn`,
  momo_test_payment: () => `${BASE_URL}/payment/momo/test-payment`,
  momo_manual_update: () => `${BASE_URL}/payment/momo/manual-update`,
};

export default axios.create({
  baseURL: BASE_URL,
});
