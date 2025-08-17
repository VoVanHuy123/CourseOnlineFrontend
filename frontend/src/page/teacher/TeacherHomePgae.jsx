// src/pages/CourseListPage.jsx
import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Row, Skeleton, message } from "antd";
import { endpoints } from "../../services/api";
import useFetchApi from "../../hooks/useFetchApi";
import { useNavigate } from "react-router-dom";
import courseCover from '../../assets/img/course-cover.jpg'
import { AuthContext } from "../../context/AuthContext";

const { Meta } = Card;

const TeacherHomePage = () => {
  const navigate = useNavigate();
  const [coursesNotPublic, setCoursesNotPublic] = useState([]);
  const [publicCourses, setPublicCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchApi } = useFetchApi();
  const [page,setPage] = useState(1);
  const {user} = useContext(AuthContext)

  const perPage = 4

  
  const loadCoursenotPublic = async () =>{
    try {
      console.log(endpoints['course_teacher_not_public'](user.id));
        const notPublicCourseRes = await fetchApi({
          method: "GET",
          url: `${endpoints['course_teacher_not_public'](user.id)}?page=${page}&per_page=${perPage}`, 
        });
        console.log(notPublicCourseRes.data.data)
        if (notPublicCourseRes.status === 200) {
          setCoursesNotPublic(notPublicCourseRes.data.data);
        } else {
          message.error("Tải khóa học thất bại");
        }
      } catch (error) {
        message.error("Lỗi khi tải khóa học");
      } finally {
        setLoading(false);
      }
  }
  const loadCoursePublic = async ()=>{
    try {
        const publicCourseRes = await fetchApi({
          url:`${endpoints["course_teacher_public"](user.id)}?page=${page}&per_page=${perPage}`
        });
        
        if (publicCourseRes.status === 200) {
          setPublicCourses(publicCourseRes.data.data);
        } else {
          message.error("Tải khóa học thất bại");
        }
      } catch (error) {
        message.error("Lỗi khi tải khóa học");
      } finally {
        setLoading(false);
      }
  }
  useEffect(() => {
    loadCoursePublic();
    loadCoursenotPublic();
}, []);
  if(publicCourses?.length <=0) return <><div className="">bạn chưa có khóa học nào</div></>
  return (
    <div style={{ padding: "24px" }}>
      <div className="">
      <h2 style={{ marginBottom: 24, fontSize: 24 }}>Danh sách khóa học chưa đăng tải</h2>
      <Row gutter={[50, 16]}>
        {(loading ? Array.from({ length: 8 }) : coursesNotPublic).map((course, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={() => navigate(`/courses/options/${course.id}`)}
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
      <div className="mt-8">
        <h2 style={{ marginBottom: 24, fontSize: 24 }}>Danh sách khóa học đã đăng tải</h2>
      <Row gutter={[50, 16]}>
        {(loading ? Array.from({ length: 8 }) : publicCourses).map((course, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={() => navigate(`/courses/options/${course.id}`)}
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
    </div>
  );
};

export default TeacherHomePage;
