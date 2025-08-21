import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton, message, Modal, Radio, Button, Space } from "antd";
import { endpoints } from "../../services/api";
import useFetchApi from "../../hooks/useFetchApi";
import courseCover from "../../assets/img/course-cover.jpg";
import ReviewList from "../../components/review/ReviewList";

const DetailCoursePage = () => {
  const { id } = useParams();
  const { fetchApi } = useFetchApi();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [courseProgress, setCourseProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("vnpay");
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await fetchApi({
          url: endpoints.course_detail(id),
          method: "GET",
        });
        setCourse(res.data);

        const resChapters = await fetchApi({
          url: endpoints["course-chapters"](id),
          method: "GET",
        });
        setChapters(resChapters.data);

        // Lấy tiến trình khóa học
        try {
          const resProgress = await fetchApi({
            url: endpoints.course_progress(id),
            method: "GET",
          });
          setCourseProgress(resProgress.data);
        } catch (err) {
          console.log("Không thể tải tiến trình khóa học:", err);
        }
        try {
          const resEnrollStatus = await fetchApi({
            url: endpoints.enrollment_status(id),
            method: "GET",
          });
          setEnrollmentStatus(resEnrollStatus.data);
        } catch (err) {
          setEnrollmentStatus(null);
        }
      } catch (err) {
        message.error("Không thể tải thông tin khóa học");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  // Hàm xử lý đăng ký khóa học
  const handleEnrollCourse = async () => {
    if (course.price === 0) {
      try {
        const res = await fetchApi({
          url: endpoints.enroll_free(id),
          method: "POST",
        });
        message.success("Đăng ký khóa học thành công!");

        // Reload trang để cập nhật trạng thái
        window.location.reload();

        setEnrollmentStatus({
          ...(enrollmentStatus || {}),
          is_enrolled: true,
          payment_status: true,
        });
      } catch (err) {
        message.error(
          "Đăng ký khóa học thất bại: " +
            (err.response?.data?.msg || "Lỗi không xác định")
        );
      }
    } else {
      setShowPaymentModal(true);
    }
  };

  // Hàm xử lý thanh toán
  const handlePayment = async () => {
    setEnrolling(true);
    try {
      console.log(
        "Sending payment request with method:",
        selectedPaymentMethod
      );

      const res = await fetchApi({
        url: endpoints.enroll(id),
        method: "POST",
        data: { payment_method: selectedPaymentMethod },
      });

      // Kiểm tra payment_info và payment_url
      if (res.data.payment_info && res.data.payment_info.payment_url) {
        console.log(
          "Redirecting to payment URL:",
          res.data.payment_info.payment_url
        );
        window.location.href = res.data.payment_info.payment_url;
      } else {
        // Nếu không có payment_url, hiển thị thông báo lỗi
        if (res.data.payment_info && !res.data.payment_info.success) {
          const errorMsg =
            res.data.payment_info.message ||
            res.data.payment_info.error ||
            "Lỗi không xác định";
          message.error(
            `Không thể tạo URL thanh toán ${selectedPaymentMethod.toUpperCase()}: ${errorMsg}`
          );
          console.error("Payment failed:", res.data.payment_info);
        } else {
          message.success("Đăng ký khóa học thành công!");
          setShowPaymentModal(false);
          // Reload trang để cập nhật trạng thái
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      message.error(
        "Đăng ký khóa học thất bại: " +
          (err.response?.data?.msg || "Lỗi không xác định")
      );
    } finally {
      setEnrolling(false);
    }
  };

  if (loading || !course) return <Skeleton active />;

  return (
    <>
      <div className="relative min-h-screen bg-white rounded-xl">
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Nội dung khóa học</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                  {chapters?.reduce(
                    (s, c) => s + (c?.lessons?.length || 0),
                    0
                  ) || 0}{" "}
                  bài
                </span>
              </div>
              {chapters && chapters.length > 0 ? (
                chapters.map((chapter, idx) => (
                  <details
                    key={chapter.id}
                    className="mb-3 border rounded-lg overflow-hidden"
                    open={idx === 0}
                  >
                    <summary className="cursor-pointer px-4 py-3 font-semibold select-none flex justify-between items-center bg-gray-50 hover:bg-gray-100">
                      <span className="truncate">{chapter.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white border text-gray-600">
                        {chapter?.lessons?.length || 0}
                      </span>
                    </summary>
                    <ul className="px-3 py-2 space-y-2">
                      {chapter.lessons && chapter.lessons.length > 0 ? (
                        chapter.lessons.map((lesson) => {
                          const lessonCompleted = enrollmentStatus?.is_enrolled
                            ? courseProgress?.lesson_progresses?.find(
                                (lp) =>
                                  String(lp.lesson_id) === String(lesson.id)
                              )?.is_completed || false
                            : false;

                          let isLocked = lesson.is_locked || false;
                          if (!enrollmentStatus?.is_enrolled) {
                            isLocked = true;
                          }

                          if (
                            course?.is_sequential &&
                            enrollmentStatus?.is_enrolled &&
                            !isLocked
                          ) {
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

                          return (
                            <li
                              key={lesson.id}
                              className={`flex items-center justify-between px-3 py-2 rounded-lg border transition ${
                                isLocked
                                  ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                                  : lessonCompleted
                                  ? "bg-green-50 text-green-800 border-green-200 hover:bg-green-100 cursor-pointer"
                                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 cursor-pointer"
                              }`}
                              onClick={() => {
                                if (!isLocked) {
                                  navigate(
                                    `/courses/${id}/lessons/${lesson.id}`
                                  );
                                }
                              }}
                            >
                              <div className="flex items-center gap-3 min-w-0">
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
                                <span className="truncate">{lesson.title}</span>
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

          {/* Bên phải: Ảnh, giá/miễn phí, tên, nút đăng ký */}
          <div className="w-full md:w-80 flex flex-col items-center">
            <div className="bg-gray-100 rounded-xl flex items-center justify-center w-full h-48 mb-6">
              <img
                src={course.image || courseCover}
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
              <div className="mb-4 text-center font-semibold">
                {course.title}
              </div>
              {enrollmentStatus ? (
                enrollmentStatus.is_enrolled ? (
                  enrollmentStatus.payment_status ? (
                    <button
                      onClick={() => {
                        // Tìm bài học đầu tiên
                        let firstLessonId = null;
                        if (chapters && chapters.length > 0) {
                          for (const chapter of chapters) {
                            if (chapter.lessons && chapter.lessons.length > 0) {
                              firstLessonId = chapter.lessons[0].id;
                              break;
                            }
                          }
                        }
                        if (firstLessonId) {
                          navigate(`/courses/${id}/lessons/${firstLessonId}`);
                        } else {
                          message.info("Khóa học chưa có bài học nào.");
                        }
                      }}
                      className="bg-green-500 text-white px-6 py-2 rounded font-semibold hover:bg-green-600 transition"
                    >
                      Vào học
                    </button>
                  ) : (
                    <div className="text-center">
                      <div className="text-orange-600 font-semibold mb-2">
                        Chờ thanh toán
                      </div>
                      <button
                        onClick={handleEnrollCourse}
                        className="bg-orange-500 text-white px-6 py-2 rounded font-semibold hover:bg-orange-600 transition"
                      >
                        Thanh toán
                      </button>
                    </div>
                  )
                ) : (
                  <button
                    onClick={handleEnrollCourse}
                    className="bg-blue-500 text-white px-6 py-2 rounded font-semibold hover:bg-blue-600 transition"
                  >
                    Đăng ký
                  </button>
                )
              ) : (
                <button
                  onClick={handleEnrollCourse}
                  className="bg-blue-500 text-white px-6 py-2 rounded font-semibold hover:bg-blue-600 transition"
                >
                  Đăng ký
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal chọn phương thức thanh toán */}
        <Modal
          title="Chọn phương thức thanh toán"
          open={showPaymentModal}
          onCancel={() => setShowPaymentModal(false)}
          footer={null}
          centered
        >
          <div className="py-4">
            <p className="mb-4 text-gray-600">
              Khóa học: <strong>{course?.title}</strong>
            </p>
            <p className="mb-6 text-lg font-semibold text-blue-600">
              Giá: {course?.price?.toLocaleString()} VNĐ
            </p>

            <div className="mb-6">
              <p className="mb-3 font-medium">Chọn phương thức thanh toán:</p>
              <Radio.Group
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="w-full"
              >
                <Space direction="vertical" className="w-full">
                  <Radio
                    value="vnpay"
                    className="w-full p-3 border rounded hover:bg-blue-50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png"
                        alt="VNPay"
                        className="w-8 h-8"
                      />
                      <span className="font-medium">VNPay</span>
                    </div>
                  </Radio>
                  <Radio
                    value="momo"
                    className="w-full p-3 border rounded hover:bg-pink-50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Circle.png"
                        alt="MoMo"
                        className="w-8 h-8"
                      />
                      <span className="font-medium">MoMo</span>
                    </div>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>

            <div className="flex gap-3 justify-end">
              <Button onClick={() => setShowPaymentModal(false)}>Hủy</Button>
              <Button
                type="primary"
                loading={enrolling}
                onClick={handlePayment}
                className="bg-blue-500"
              >
                Thanh toán
              </Button>
            </div>
          </div>
        </Modal>
      </div>
      <div className="mt-8">
        <ReviewList courseId={id} />
      </div>
    </>
  );
};

export default DetailCoursePage;
