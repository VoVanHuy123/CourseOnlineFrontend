import React, { useEffect, useState, useContext } from "react";
import { Card, Col, Row, Skeleton, message } from "antd";
import { endpoints, BASE_URL } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import courseCover from "../../assets/img/course-cover.jpg";
import useFetchApi from "../../hooks/useFetchApi";
import SearchBar from "../../components/search/SearchBar";

const { Meta } = Card;

const StudentHomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { fetchApi } = useFetchApi();
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetchApi({
          url: endpoints.categories,
          method: "GET",
        });
        console.log("Categories response:", res.data);
        setCategories(res.data);
      } catch (err) {
        message.error("Không thể tải danh mục");
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  const fetchAllCourses = async () => {
    setLoadingCourses(true);
    setError(null);
    try {
      const res = await fetchApi({
        url: endpoints.courses,
        method: "GET",
      });
      console.log("Courses response:", res.data);
      const coursesData = res.data.data || res.data;
      setAllCourses(coursesData);
      setFilteredCourses(coursesData);
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải khóa học.");
      console.error(err);
    } finally {
      setLoadingCourses(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (!allCourses) return;

    // Lọc khóa học đã phát hành (is_public = true) trước
    const publicCourses = allCourses.filter((course) => course.is_public);

    if (selectedCategory === null) {
      setFilteredCourses(publicCourses);
    } else {
      const filtered = publicCourses.filter(
        (course) => course.category_id === selectedCategory
      );
      setFilteredCourses(filtered);
    }
  }, [selectedCategory, allCourses]);

  if (isInitialLoad && (loadingCategories || loadingCourses))
    return <Skeleton active />;
  if (error) return <div>{error}</div>;

  const paidCourses = filteredCourses
    ? filteredCourses.filter((course) => course.price > 0)
    : [];
  const freeCourses = filteredCourses
    ? filteredCourses.filter((course) => course.price === 0)
    : [];

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 z-0" />
      {/* Nội dung chính */}
      <div className="relative z-10 p-6">
        <h2 className="text-2xl font-bold mb-6">
          Chào mừng, {user?.name || "Học viên"}!
        </h2>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            placeholder="Tìm kiếm khóa học theo tên, giáo viên, danh mục..."
            style={{ maxWidth: "600px", margin: "0 auto" }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 p-4 relative z-20">
          <button
            className={`px-4 py-2  rounded-full border font-semibold transition whitespace-nowrap
              ${
                selectedCategory === null
                  ? "bg-blue-500 text-white border-blue-500 shadow"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-blue-100"
              }
            `}
            onClick={() => setSelectedCategory(null)}
          >
            Tất cả
          </button>
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <button
                key={cat.id}
                className={`px-4 py-2 rounded-full border font-semibold transition whitespace-nowrap
                ${
                  selectedCategory === cat.id
                    ? "bg-blue-500 text-white border-blue-500 shadow"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-blue-100"
                }
              `}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))
          ) : (
            <div className="text-gray-500 text-sm">Đang tải danh mục...</div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Khóa học trả phí</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {paidCourses.length > 0 ? (
              paidCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer border border-gray-100"
                  onClick={() => {
                    console.log("Click card", course.id);
                    navigate(`/courses/${course.id}`);
                  }}
                >
                  {console.log("Course image:", course.image)}
                  <img
                    src={course?.image || courseCover}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-t-xl"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = courseCover;
                    }}
                  />

                  <div className="p-4">
                    <h4 className="font-semibold text-lg truncate">
                      {course?.title}
                    </h4>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                Không có khóa học trả phí nào.
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold mb-4">Khóa học miễn phí</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {freeCourses.length > 0 ? (
              freeCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer border border-gray-100"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <img
                    src={course.cover || courseCover}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-lg truncate">
                      {course.title}
                    </h4>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                Không có khóa học miễn phí nào.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHomePage;
