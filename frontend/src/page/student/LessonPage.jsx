import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FloatButton, Skeleton, message } from "antd";
import { endpoints } from "../../services/api";
import useFetchApi from "../../hooks/useFetchApi";
import useVideoProtection from "../../hooks/useVideoProtection";
import courseCover from "../../assets/img/course-cover.jpg";

import { CustomerServiceOutlined, WechatOutlined } from "@ant-design/icons";

import CommentDrawer from "../../components/drawer/CommentDrawer";

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const { fetchApi } = useFetchApi();
  const navigate = useNavigate();

  // Sử dụng hook bảo vệ video
  useVideoProtection();

  //comment drawer
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isFetchingRef = useRef(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

  // Lấy thông tin course và chapters
  useEffect(() => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const resCourse = await fetchApi({
          url: endpoints.course_detail(courseId),
          method: "GET",
        });
        setCourse(resCourse.data);

        const resChapters = await fetchApi({
          url: endpoints["course-chapters"](courseId),
          method: "GET",
        });
        setChapters(resChapters.data);

        try {
          const resProgress = await fetchApi({
            url: endpoints.course_progress(courseId),
            method: "GET",
          });
          setCourseProgress(resProgress.data);
        } catch (err) {
          console.log("Không thể tải tiến trình khóa học:", err);
        }

        // Lấy trạng thái đăng ký
        try {
          const resEnrollStatus = await fetchApi({
            url: endpoints.enrollment_status(courseId),
            method: "GET",
          });
          setEnrollmentStatus(resEnrollStatus.data);
        } catch (err) {
          setEnrollmentStatus(null);
        }
      } catch (err) {
        message.error("Không thể tải dữ liệu bài học");
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
        isFetchingRef.current = false;
      }
    };
    fetchCourseData();
  }, [courseId]); //khi courseId thay đổi thì mới chạy cái này

  useEffect(() => {
    if (chapters.length > 0) {
      // chạy khi đổi leson    -
      let foundLesson = null;
      for (const chapter of chapters) {
        if (chapter.lessons) {
          const l = chapter.lessons.find((ls) => String(ls.id) === lessonId);
          if (l) {
            foundLesson = l;
            break;
          }
        }
      }
      setLesson(foundLesson);

      // chạy khi bấm nút hoàn thành bài học
      if (foundLesson && courseProgress?.lesson_progresses) {
        const lessonProgress = courseProgress.lesson_progresses.find(
          (lp) => String(lp.lesson_id) === String(foundLesson.id)
        );
        setIsCompleted(lessonProgress ? lessonProgress.is_completed : false);
      }
    }
  }, [lessonId, chapters, courseProgress]); // 1 trong 3 cái thay đổi thì chạy cái này

  if (isInitialLoad && (loading || !course || !lesson))
    return <Skeleton active />; // nếu đang load lần đầu và chưa có dữ liệu thì hiển thị khung mờ

  // next lesson và previous lesson
  let flatLessons = [];
  chapters.forEach((chapter) => {
    if (chapter.lessons) flatLessons = flatLessons.concat(chapter.lessons);
  });
  const currentIndex = flatLessons.findIndex((l) => String(l.id) === lessonId);
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < flatLessons.length - 1
      ? flatLessons[currentIndex + 1]
      : null;

  //hoàn thành và bỏ hoàn thành
  const handleToggleComplete = async () => {
    if (!enrollmentStatus?.is_enrolled) {
      message.error("Bạn cần đăng ký khóa học để hoàn thành bài học này.");
      return;
    }
    try {
      const endpoint = isCompleted
        ? endpoints.uncomplete_lesson(lessonId)
        : endpoints.complete_lesson(lessonId);

      const res = await fetchApi({
        url: endpoint,
        method: "POST",
      });

      if (res.data || res.msg) {
        setIsCompleted(!isCompleted);
        message.success(
          isCompleted ? "Đã bỏ hoàn thành bài học" : "Đã hoàn thành bài học"
        );

        // Cập nhật lại tiến trình khóa học
        try {
          const resProgress = await fetchApi({
            url: endpoints.course_progress(courseId),
            method: "GET",
          });
          setCourseProgress(resProgress.data);
        } catch (progressErr) {
          console.error("Lỗi khi cập nhật progress:", progressErr);
        }
      }
    } catch (err) {
      console.error("Lỗi khi toggle complete:", err);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái bài học");
    }
  };


  return (
    <div className="relative min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-blue-50 rounded-t-xl border-b">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
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
          {enrollmentStatus?.is_enrolled && (
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
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-8 p-8 min-h-[70vh]">
        {/* Left: Video and info */}
        <div className="flex-1">
          <div className="bg-blue-50 rounded-xl w-full mb-6">
            {/* Kiểm tra đăng ký khóa học */}
            {!enrollmentStatus?.is_enrolled ? (
              <div className="aspect-video flex items-center justify-center">
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="mb-4">
                    <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {course?.price > 0
                      ? "Khóa học trả phí"
                      : "Khóa học miễn phí"}
                  </h3>
                  <p className="text-gray-600 mb-4 text-center max-w-md">
                    Bạn cần đăng ký khóa học này để xem nội dung bài học.
                    {course?.price > 0
                      ? ""
                      : " Khóa học này hoàn toàn miễn phí!"}
                  </p>
                  <button
                    onClick={() => navigate(`/courses/${courseId}`)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Đăng ký ngay
                  </button>
                </div>
              </div>
            ) : (
              /* Hiển thị nội dung theo loại */
              <>
                {lesson.type === "Type.VIDEO" && lesson.content_url ? (
                  <div className="aspect-video video-protected">
                    <video
                      src={lesson.content_url}
                      controls
                      className="w-full h-full rounded-xl"
                      controlsList="nodownload"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>
                ) : lesson.type === "Type.TEXT" && lesson.content ? (
                  <div className="p-6 min-h-[300px]">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold mb-4">
                        Nội dung bài học
                      </h3>
                      <div className="prose max-w-none">
                        <div
                          dangerouslySetInnerHTML={{ __html: lesson.content }}
                        />
                      </div>
                    </div>
                  </div>
                ) : lesson.type === "Type.FILE" && lesson.content_url ? (
                  <div className="p-6 min-h-[300px] flex items-center justify-center">
                    <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                      <div className="mb-4">
                        <svg
                          width="64"
                          height="64"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="mx-auto"
                        >
                          <path
                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <polyline
                            points="14,2 14,8 20,8"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        Tài liệu bài học
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Bấm vào nút bên dưới để tải xuống tài liệu
                      </p>
                      <a
                        href={lesson.content_url}
                        download
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Tải xuống tài liệu
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        width="64"
                        height="64"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="12" fill="#e0e7ef" />
                        <polygon points="10,8 16,12 10,16" fill="#94a3b8" />
                      </svg>
                      <p className="mt-4 text-gray-500">
                        Chưa có nội dung bài học
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          {/* Complete lesson button - chỉ hiển thị khi đã đăng ký */}
          {enrollmentStatus?.is_enrolled && (
            <div className="flex justify-center mt-6 mb-4">
              <button
                onClick={handleToggleComplete}
                className={`px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                  isCompleted
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {isCompleted ? (
                  <>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Đã hoàn thành
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Hoàn thành bài học
                  </>
                )}
              </button>
            </div>
          )}

          {/* Navigation buttons - chỉ hiển thị khi đã đăng ký */}
          {enrollmentStatus?.is_enrolled && (
            <div className="flex justify-between mt-4">
              <button
                className="px-6 py-2 rounded border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition"
                onClick={() =>
                  prevLesson &&
                  navigate(`/courses/${courseId}/lessons/${prevLesson.id}`)
                }
                disabled={!prevLesson}
              >
                Bài trước
              </button>
              <button
                className={`px-6 py-2 rounded font-semibold transition flex items-center ${
                  !nextLesson || !isCompleted
                    ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={() =>
                  nextLesson &&
                  isCompleted &&
                  navigate(`/courses/${courseId}/lessons/${nextLesson.id}`)
                }
                disabled={!nextLesson || !isCompleted}
              >
                {(!nextLesson || !isCompleted) && (
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="mr-2"
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
                    <circle cx="12" cy="16" r="1" fill="currentColor" />
                    <path
                      d="M7 11V7a5 5 0 0 1 10 0v4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
                Bài tiếp theo
                <svg
                  className="ml-2"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 6l6 6-6 6"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
        {/* Right: Chapter list */}
        <div className="w-full md:w-96">
          <div className="bg-white rounded-xl border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Nội dung khóa học</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                {chapters?.reduce((s, c) => s + (c?.lessons?.length || 0), 0) ||
                  0}{" "}
                bài
              </span>
            </div>
            {chapters && chapters.length > 0 ? (
              chapters.map((chapter, idx) => (
                <details
                  key={chapter.id}
                  className="mb-3 border rounded-lg overflow-hidden"
                  open={
                    chapter.lessons &&
                    chapter.lessons.some((l) => String(l.id) === lessonId)
                  }
                >
                  <summary className="cursor-pointer px-4 py-3 font-semibold select-none flex justify-between items-center bg-gray-50 hover:bg-gray-100">
                    <span className="truncate">{chapter.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white border text-gray-600">
                      {chapter?.lessons?.length || 0}
                    </span>
                  </summary>
                  <ul className="px-3 py-2 space-y-2">
                    {chapter.lessons && chapter.lessons.length > 0 ? (
                      chapter.lessons.map((lessonItem) => {
                        const lessonCompleted = enrollmentStatus?.is_enrolled
                          ? courseProgress?.lesson_progresses?.find(
                              (lp) =>
                                String(lp.lesson_id) === String(lessonItem.id)
                            )?.is_completed || false
                          : false;

                        let isLocked = lessonItem.is_locked || false;
                        if (!enrollmentStatus?.is_enrolled) {
                          isLocked = true;
                        }

                        if (
                          course?.is_sequential &&
                          enrollmentStatus?.is_enrolled &&
                          !isLocked
                        ) {
                          const currentChapterIndex = chapters.findIndex(
                            (ch) => ch.id === lessonItem.chapter_id
                          );
                          const currentLessonIndex = chapters[
                            currentChapterIndex
                          ]?.lessons?.findIndex((l) => l.id === lessonItem.id);
                          if (
                            currentChapterIndex > 0 ||
                            currentLessonIndex > 0
                          ) {
                            let prevLesson = null;
                            if (currentLessonIndex > 0) {
                              prevLesson =
                                chapters[currentChapterIndex].lessons[
                                  currentLessonIndex - 1
                                ];
                            } else if (currentChapterIndex > 0) {
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

                        const isActive = String(lessonItem.id) === lessonId;

                        return (
                          <li
                            key={lessonItem.id}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg border transition ${
                              isLocked
                                ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                                : lessonCompleted
                                ? "bg-green-50 text-green-800 border-green-200 hover:bg-green-100 cursor-pointer"
                                : isActive
                                ? "bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-300 cursor-pointer"
                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"
                            }`}
                            onClick={() => {
                              if (!isLocked) {
                                navigate(
                                  `/courses/${courseId}/lessons/${lessonItem.id}`
                                );
                              }
                            }}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {/* trạng thái */}
                              {isLocked ? (
                                <svg
                                  width="18"
                                  height="18"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  className="shrink-0"
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
                              ) : lessonCompleted ? (
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="shrink-0"
                                >
                                  <path
                                    d="M9 12l2 2 4-4"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                </svg>
                              ) : isActive ? (
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="shrink-0"
                                >
                                  <polygon
                                    points="9,6 16,12 9,18"
                                    fill="currentColor"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="shrink-0"
                                >
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                  />
                                </svg>
                              )}
                              <span
                                className={`truncate ${
                                  isActive ? "font-semibold" : ""
                                }`}
                              >
                                {lessonItem.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {isLocked && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                                  {!enrollmentStatus?.is_enrolled
                                    ? "Cần đăng ký"
                                    : "Bị khóa"}
                                </span>
                              )}
                              {lessonCompleted && !isLocked && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                                  Đã hoàn thành
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <li className="text-gray-400 italic px-3 py-2">
                        Chưa có bài học
                      </li>
                    )}
                  </ul>
                </details>
              ))
            ) : (
              <div className="text-gray-400 italic">Chưa có chương nào</div>
            )}
          </div>
        </div>
      </div>

      {/* Comment Drawer */}
      <div className="">
        <CommentDrawer
          selectedLesson={lesson}
          open={open}
          onClose={() => {
            onClose();
          }}
        />
      </div>
      <div className="">
        <FloatButton
          onClick={showDrawer}
          icon={
            <div className="flex flex-row w-full">
              <WechatOutlined className="text-xl" />
            </div>
          }
          shape="square"
          type="primary"
          style={{
            insetInlineEnd: 50,
            width: 120,
            height: 40,
            padding: "0 12px",
          }}
        />
      </div>
    </div>
  );
};

export default LessonPage;
