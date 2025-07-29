import React, { useEffect, useState } from "react";
import {
  getTotalStudents,
  getChapterLessonStats,
  getAvgLessonsPerChapter,
  getPublishRate,
  getAvgRating,
  getStudentsCompletedLessons,
} from "../../services/statsApi";
import { Card, Col, Row, Spin, Typography, Rate } from "antd";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { UserOutlined, BookOutlined, StarOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TeacherStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      console.warn("Chưa có token → không gọi API thống kê");
      setLoading(false);
      return;
    }

    const loadStats = async () => {
      try {
        const [total, chaptersLessons, avgLessons, publishRate, rating, completed] = await Promise.all([
          getTotalStudents(),
          getChapterLessonStats(),
          getAvgLessonsPerChapter(),
          getPublishRate(),
          getAvgRating(),
          getStudentsCompletedLessons(),
        ]);

        setStats({
          totalStudents: total.data.total_students,
          chapters: chaptersLessons.data.data.chapters,
          lessons: chaptersLessons.data.data.lessons,
          avgLessons: avgLessons.data.average_lessons,
          published: publishRate.data.data,
          avgRating: rating.data.avg_rating,
          studentsCompleted: completed.data.students_completed,
        });
      } catch (err) {
        console.error("Lỗi gọi API thống kê:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [token]);

  if (loading) return <Spin fullscreen tip="Đang tải thống kê..." />;
  if (!stats) return <p>Không thể tải thống kê.</p>;

  const pieData = [
    { name: "Đã xuất bản", value: stats.published.published },
    { name: "Chưa xuất bản", value: stats.published.total - stats.published.published },
  ];

  const barData = [
    {
      name: "Thống kê",
      HọcViên: stats.totalStudents,
      Chương: stats.chapters,
      BàiHọc: stats.lessons,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>📊 Thống kê của giáo viên</Title>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="👨‍🎓 Tổng học viên" >
            <UserOutlined /> {stats.totalStudents}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="📚 Tổng chương">
            <BookOutlined /> {stats.chapters}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="📖 Tổng bài học">
            <BookOutlined /> {stats.lessons}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="📏 Trung bình số bài học trong mỗi chương">
            {stats.avgLessons}
          </Card>
        </Col>

        <Col span={12}>
          <Card title="⭐ Đánh giá trung bình">
            {stats.avgRating} / 5 <StarOutlined />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="✅ Bài học đã xuất bản">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="📊 Tổng quan">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="HọcViên" fill="#8884d8" />
                <Bar dataKey="Chương" fill="#82ca9d" />
                <Bar dataKey="BàiHọc" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="🎓 Học viên hoàn thành ít nhất 1 bài học">
            <CheckCircleOutlined /> {stats.studentsCompleted}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherStatsPage;

