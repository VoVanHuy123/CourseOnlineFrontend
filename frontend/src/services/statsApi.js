import axios from "axios";
import { BASE_URL, endpoints } from "./api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getTotalStudents = () =>
  axios.get(BASE_URL + endpoints.stats_total_students, getAuthHeaders());

export const getChapterLessonStats = () =>
  axios.get(BASE_URL + endpoints.stats_chapter_lesson, getAuthHeaders());

export const getAvgLessonsPerChapter = () =>
  axios.get(BASE_URL + endpoints.stats_avg_lessons, getAuthHeaders());

export const getPublishRate = () =>
  axios.get(BASE_URL + endpoints.stats_publish_rate, getAuthHeaders());

export const getAvgRating = () =>
  axios.get(BASE_URL + endpoints.stats_avg_rating, getAuthHeaders());

export const getStudentsCompletedLessons = () =>
  axios.get(BASE_URL + endpoints.stats_students_completed, getAuthHeaders());
