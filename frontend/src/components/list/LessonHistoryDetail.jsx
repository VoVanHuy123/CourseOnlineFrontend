import React, { useEffect, useState } from "react";
import { Descriptions, Divider, Spin,Typography } from "antd";
import { useParams } from "react-router-dom";
import useFetchApi from "../../hooks/useFetchApi";
import { endpoints } from "../../services/api";
// import Title from "antd/es/skeleton/Title";
const { Title, Text, Paragraph } = Typography;

const LessonHistoryDetail = ({historyId}) => {
//   const { lessonId, historyId } = useParams();
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const {fetchApi} = useFetchApi();

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      
      try {
        const res = await fetchApi({
            url : endpoints['lesson_history'](historyId)
        })

        setHistory(res.data);
        console.error(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchDetail();
  }, [ historyId]);

   return (
    <div className="p-4 bg-white rounded shadow-md">
      <Title level={3}>Chi tiết lịch sử bài học</Title>
      <Divider />

      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tiêu đề">{history?.title}</Descriptions.Item>
        <Descriptions.Item label="Hành động">
          {history?.action === "create" ? "Tạo mới" : "Cập nhật"}
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả">
          <Paragraph>{history?.description || "Không có mô tả"}</Paragraph>
        </Descriptions.Item>
        <Descriptions.Item label="Loại nội dung">{history?.type}</Descriptions.Item>
        <Descriptions.Item label="Đường dẫn nội dung">
          <a href={history?.content_url} target="_blank" rel="noreferrer">
            {history?.content_url}
          </a>
        </Descriptions.Item>
        <Descriptions.Item label="Thứ tự">{history?.order}</Descriptions.Item>
        <Descriptions.Item label="Đã công khai?">
          {history?.is_published ? "✅ Có" : "❌ Không"}
        </Descriptions.Item>
        <Descriptions.Item label="Bị khóa?">
          {history?.is_locked ? "🔒 Có" : "🔓 Không"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {new Date(history?.created_at).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>

      {history?.image && (
        <div className="mt-4">
          <Text strong>Hình ảnh:</Text>
          <div className="mt-2">
            <img
              src={history?.image}
              alt="Hình ảnh bài học"
              className="w-64 rounded border"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonHistoryDetail;
