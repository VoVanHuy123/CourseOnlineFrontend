import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton, message } from "antd";
import { endpoints } from "../../services/api";
import useFetchApi from "../../hooks/useFetchApi";
import courseCover from "../../assets/img/course-cover.jpg";

const DetailCoursePage = () => {
  const { id } = useParams();
  const { fetchApi } = useFetchApi();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [courseProgress, setCourseProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await fetchApi({
          url: `${endpoints.courses}/${id}`,
          method: "GET",
        });
        console.log("Course detail response:", res.data);
        setCourse(res.data);

        const resChapters = await fetchApi({
          url: endpoints["course-chapters"](id),
          method: "GET",
        });
        console.log("Chapters response:", resChapters.data);
        setChapters(resChapters.data);

        // Lấy tiến trình khóa học
        try {
          const resProgress = await fetchApi({
            url: `/learning/courses/${id}/progress`,
            method: "GET",
          });
          setCourseProgress(resProgress.data);
        } catch (err) {
          console.log("Không thể tải tiến trình khóa học:", err);
        }
      } catch (err) {
        message.error("Không thể tải thông tin khóa học");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading || !course) return <Skeleton active />;

  return (
    <div className="relative min-h-screen bg-white">
      {/* Header giống LessonPage */}
      <div className="flex items-center justify-between px-6 py-3 bg-blue-50 rounded-t-xl border-b">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Quay lại
          </button>
          <div className="font-bold text-lg flex items-center gap-2">
            <img
              src={course?.image || courseCover}
              alt={course?.title || "Khóa học"}
              className="w-10 h-10 rounded-full object-cover"
            />
            {course?.title || "Khóa học"}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-400 rounded"
                style={{
                  width: courseProgress
                    ? `${courseProgress.progress || 0}%`
                    : "0%",
                }}
              />
            </div>
            <span className="text-blue-500 font-semibold text-sm">
              {courseProgress
                ? `${Math.round(courseProgress.progress || 0)}%`
                : "0%"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 p-8 min-h-[70vh]">
        <div className="flex-1">
          <p className="text-gray-500 mb-6">{course.description}</p>

          <div className="bg-white rounded-xl border p-6">
            {chapters && chapters.length > 0 ? (
              chapters.map((chapter, idx) => (
                <details
                  key={chapter.id}
                  className="mb-3 border rounded"
                  open={idx === 0}
                >
                  <summary className="cursor-pointer px-4 py-2 font-semibold select-none flex justify-between items-center">
                    {chapter.title}
                    <span>{chapter.lessons.length}</span>
                  </summary>
                  <ul className="pl-8 pr-8 py-2 space-y-1">
                    {chapter.lessons && chapter.lessons.length > 0 ? (
                      chapter.lessons.map((lesson) => {
                        const lessonCompleted =
                          courseProgress?.lesson_progresses?.find(
                            (lp) => String(lp.lesson_id) === String(lesson.id)
                          )?.is_completed || false;

                        // Kiểm tra xem bài học có bị lock không
                        let isLocked = lesson.is_locked || false;

                        // Nếu khóa học yêu cầu học lần lượt, kiểm tra bài học trước đó
                        if (course?.is_sequential && !isLocked) {
                          // Tìm bài học trước đó
                          const currentChapterIndex = chapters.findIndex(
                            (ch) => ch.id === lesson.chapter_id
                          );
                          const currentLessonIndex = chapters[
                            currentChapterIndex
                          ]?.lessons?.findIndex((l) => l.id === lesson.id);

                          if (
                            currentChapterIndex > 0 ||
                            currentLessonIndex > 0
                          ) {
                            // Kiểm tra bài học trước đó
                            let prevLesson = null;
                            if (currentLessonIndex > 0) {
                              // Cùng chapter, bài học trước đó
                              prevLesson =
                                chapters[currentChapterIndex].lessons[
                                  currentLessonIndex - 1
                                ];
                            } else if (currentChapterIndex > 0) {
                              // Chapter trước đó, bài học cuối cùng
                              const prevChapter =
                                chapters[currentChapterIndex - 1];
                              if (
                                prevChapter.lessons &&
                                prevChapter.lessons.length > 0
                              ) {
                                prevLesson =
                                  prevChapter.lessons[
                                    prevChapter.lessons.length - 1
                                  ];
                              }
                            }

                            // Nếu có bài học trước đó, kiểm tra xem đã hoàn thành chưa
                            if (prevLesson) {
                              const prevLessonCompleted =
                                courseProgress?.lesson_progresses?.find(
                                  (lp) =>
                                    String(lp.lesson_id) ===
                                    String(prevLesson.id)
                                )?.is_completed || false;

                              if (!prevLessonCompleted) {
                                isLocked = true;
                              }
                            }
                          }
                        }

                        return (
                          <li
                            key={lesson.id}
                            className={`px-3 py-2 transition border border-gray-100 ${
                              isLocked
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : lessonCompleted
                                ? "bg-green-50 text-green-800 cursor-pointer hover:bg-green-100"
                                : "text-gray-700 cursor-pointer hover:bg-gray-50"
                            }`}
                            onClick={() => {
                              if (!isLocked) {
                                navigate(`/courses/${id}/lessons/${lesson.id}`);
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                {isLocked && (
                                  <svg
                                    width="16"
                                    height="16"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <rect
                                      x="3"
                                      y="11"
                                      width="18"
                                      height="11"
                                      rx="2"
                                      ry="2"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    />
                                    <circle
                                      cx="12"
                                      cy="16"
                                      r="1"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M7 11V7a5 5 0 0 1 10 0v4"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    />
                                  </svg>
                                )}
                                {lesson.title}
                              </span>
                              {isLocked && (
                                <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">
                                  Bị khóa
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <li className="text-gray-400 italic">Chưa có bài học</li>
                    )}
                  </ul>
                </details>
              ))
            ) : (
              <div className="text-gray-400 italic">Chưa có chương nào</div>
            )}
          </div>
        </div>

        {/* Bên phải: Ảnh, giá/miễn phí, tên, nút đăng ký */}
        <div className="w-full md:w-80 flex flex-col items-center">
          <div className="bg-gray-100 rounded-xl flex items-center justify-center w-full h-48 mb-6">
            <img
              src={course.cover || courseCover}
              alt={course.title}
              className="object-contain h-40"
            />
          </div>
          <div className="bg-white rounded-xl shadow p-6 w-full flex flex-col items-center">
            <div className="text-lg font-bold mb-2">
              {course.price === 0 ? (
                <span className="text-green-500">Miễn phí</span>
              ) : (
                <span className="text-blue-600">
                  {course.price.toLocaleString()} VNĐ
                </span>
              )}
            </div>
            <div className="mb-4 text-center font-semibold">{course.title}</div>
            <button className="bg-blue-500 text-white px-6 py-2 rounded font-semibold hover:bg-blue-600 transition">
              Đăng kí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCoursePage;
