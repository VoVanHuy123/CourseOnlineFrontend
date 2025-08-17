import React, { useState } from "react";
import { Modal, Form, Input, Rate, message, Button } from "antd";
import axios from "axios";
import useFetchApi from "../../hooks/useFetchApi";
import { endpoints } from "../../services/api";

const CreateReview = ({ courseId, visible, onClose, onSuccess,onReturnReview }) => {
  const [loading, setLoading] = useState(false);
  const {fetchApi} = useFetchApi();

  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Gửi dữ liệu lên API
    //   await axios.post("/reviews", {
    //     course_id: courseId,
    //     rating: values.rating,
    //     comment: values.comment,
    //   });
      const res = await fetchApi({
        method:"POST",
        url : `${endpoints['reviews']}`,
        data:{
            course_id:courseId,
            ...values
        }
      })
      const data = {
            courseId,
            ...values
        }
      console.log("data",data)
      console.log("res.data",res.data)
      if(res.status===201){
            console.log("vào")
          message.success("Đánh giá thành công!");
          form.resetFields();
          onSuccess?.(); // callback reload
          onReturnReview?.(res.data)
      }

      onClose();
    } catch (err) {
      console.error(err);
      message.error("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title="Tạo đánh giá"
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="Gửi"
      cancelText="Hủy"
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{ rating: 5 }}
      >
        <Form.Item
          name="rating"
          label="Đánh giá sao"
          rules={[{ required: true, message: "Hãy chọn số sao" }]}
        >
          <Rate />
        </Form.Item>

        <Form.Item
          name="comment"
          label="Nội dung"
          rules={[{ required: true, message: "Hãy nhập nội dung" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateReview;
