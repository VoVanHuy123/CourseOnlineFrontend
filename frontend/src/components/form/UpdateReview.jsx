// components/form/EditReviewForm.jsx
import { Form, Input, Rate, Button, message } from "antd";
import { useEffect } from "react";
import useFetchApi from "../../hooks/useFetchApi";
import { endpoints } from "../../services/api";

const EditReviewForm = ({ review, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { fetchApi } = useFetchApi();

  useEffect(() => {
    form.setFieldsValue({
      comment: review.comment,
      rating: review.rating
    });
  }, [review]);

  const handleSubmit = async (values) => {
    try {
      const res = await fetchApi({
        url: `${endpoints['reviews']}/${review.id}`,
        method: "PUT",
        data: {
          ...values,
          course_id: review.course_id
        },
      });

      if (res.status === 200) {
        message.success("Cập nhật review thành công");
        onSuccess(res.data);
        onCancel(); // đóng form
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật review");
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Form.Item name="rating" label="Đánh giá sao" rules={[{ required: true }]}>
        <Rate />
      </Form.Item>
      <Form.Item name="comment" label="Bình luận" rules={[{ required: true }]}>
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Cập nhật</Button>
        <Button onClick={onCancel} style={{ marginLeft: 8 }}>Hủy</Button>
      </Form.Item>
    </Form>
  );
};

export default EditReviewForm;
