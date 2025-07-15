// src/pages/CourseListPage.jsx
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Skeleton, message } from "antd";
import { endpoints } from "../../services/api";
import useFetchApi from "../../hooks/useFetchApi";
import { useNavigate } from "react-router-dom";
import courseCover from '../../assets/img/course-cover.jpg'

const { Meta } = Card;

const TeacherHomePage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchApi } = useFetchApi();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetchApi({
          method: "GET",
          url: endpoints["courses"], // Đảm bảo endpoint đúng
        });

        if (res.status === 200) {
          setCourses(res.data);
        } else {
          message.error("Tải khóa học thất bại");
        }
      } catch (error) {
        message.error("Lỗi khi tải khóa học");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: 24, fontSize: 24 }}>Danh sách khóa học</h2>
      <Row gutter={[50, 16]}>
        {(loading ? Array.from({ length: 8 }) : courses).map((course, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={() => navigate(`/courses/${course.id}`)}
              style={{ cursor: "pointer" }}
              loading={loading}
              cover={
                !loading && (
                  <img
                    alt={course.title}
                    src={course.image || courseCover}
                    style={{ height: 180, objectFit: "cover" }}
                  />
                )
              }
            >
              {!loading && (
                <Meta
                  title={course.title}
                  description={
                    course.description.length > 60
                      ? course.description.slice(0, 60) + "..."
                      : course.description
                  }
                />
              )}
            </Card>
          </Col>
        ))}
      </Row>
      
    </div>
  );
};

export default TeacherHomePage;
