import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Card, List, Avatar, Spin, Empty } from "antd";
import { SearchOutlined, BookOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useFetchApi from "../../hooks/useFetchApi";
import { endpoints } from "../../services/api";
import courseCover from '../../assets/img/course-cover.jpg'

const { Search } = Input;

const SearchBar = ({
  placeholder = "Tìm kiếm khóa học...",
  style = {},
  onSearch: externalOnSearch,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { fetchApi } = useFetchApi();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Đóng kết quả tìm kiếm khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const performSearch = async (value) => {
    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Nếu có external onSearch function, gọi nó thay vì search inline
    if (externalOnSearch) {
      externalOnSearch(value);
      return;
    }

    setLoading(true);
    try {
      const res = await fetchApi({
        url: endpoints.search_courses(value.trim()),
        method: "GET",
      });

      setSearchResults(res.data || []);
      setShowResults(true);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    // Clear previous debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce timer
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300); // 300ms delay
  };

  const handleCourseClick = (courseId) => {
    navigate(`/courses/${courseId}`);
    setShowResults(false);
    setSearchValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // Clear debounce and search immediately
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      performSearch(searchValue);
    }
  };

  return (
    <div ref={searchRef} style={{ position: "relative", ...style }}>
      <Search
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          handleSearch(e.target.value);
        }}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
        enterButton={
          <Button type="primary" icon={<SearchOutlined />}>
            Tìm kiếm
          </Button>
        }
        size="large"
        style={{
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      />

      {/* Kết quả tìm kiếm */}
      {showResults && (
        <Card
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            marginTop: "8px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            maxHeight: "400px",
            overflow: "auto",
          }}
        >
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin size="large" />
              <div style={{ marginTop: "10px" }}>Đang tìm kiếm...</div>
            </div>
          ) : searchResults.length > 0 ? (
            <List
              dataSource={searchResults}
              renderItem={(course) => (
                <List.Item
                  style={{
                    padding: "12px",
                    cursor: "pointer",
                    borderRadius: "6px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                  onClick={() => handleCourseClick(course.id)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={48}
                        src={course.image || courseCover}
                        shape="square"
                        style={{ borderRadius: "6px" }}
                      />
                    }
                    title={
                      <div style={{ fontWeight: "600", color: "#1890ff" }}>
                        {course.title}
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: "4px", color: "#666" }}>
                          {course.description?.substring(0, 100)}
                          {course.description?.length > 100 && "..."}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                          }}
                        >
                          <span style={{ color: "#52c41a", fontWeight: "500" }}>
                            {course.price === 0
                              ? "Miễn phí"
                              : `${course.price?.toLocaleString()} VNĐ`}
                          </span>
                          {course.teacher && (
                            <span style={{ color: "#666", fontSize: "12px" }}>
                              <UserOutlined /> {course.teacher.first_name}{" "}
                              {course.teacher.last_name}
                            </span>
                          )}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : searchValue.trim() ? (
            <Empty
              description="Không tìm thấy khóa học nào"
              style={{ padding: "20px" }}
            />
          ) : null}
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
