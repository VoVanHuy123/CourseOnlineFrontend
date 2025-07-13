import React, { useState } from "react";
import { Form, Input, InputNumber, Button, Switch, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import renderDynamicFormItems from "../components/form/DynamicFormItems";
import axios from "axios";

const { TextArea } = Input;
const fields1 = [
  { name: "title", label: "Tên khóa học", rules: [{ required: true, message: "Vui lòng nhập tên khóa học" }], type: "input", placeholder: "VD: Lập trình React" },

  { name: "description", label: "Mô tả", type: "text", placeholder: "Mô tả nội dung khóa học" },

  { name: "image", label: "Ảnh đại diện", type: "upload" },

  { name: "price", label: "Giá (VNĐ)", type: "float", placeholder: "Nhập giá..." },

  { name: "teacher_id", label: "Giảng viên ID", type: "number", rules: [{ required: true, message: "Cần có ID giảng viên" }] },

  { name: "category_id", label: "Danh mục ID", type: "number", rules: [{ required: true, message: "Cần có ID danh mục" }] },

  { name: "is_public", label: "Công khai", type: "switch" }
];


const CreateCourseForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    // Nếu có ảnh thì lấy file từ upload
    if (values.image && values.image.fileList.length > 0) {
        formData.append("image", values.image.fileList[0].originFileObj);
    }
    // Các trường khác
    Object.keys(values).forEach((key) => {
        if (key !== "image") {
        formData.append(key, values[key]);
        }
    });

    try {
      setLoading(true);
      // Gửi dữ liệu lên Flask API
      const response = await axios.post("http://127.0.0.1:5000/courses", values);
      message.success("Tạo khóa học thành công!");
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("Tạo khóa học thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded-2xl shadow-2xl">
      <h1 className="text-2xl font-semibold mb-4 text-center">Tạo Khóa Học</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          is_public: true,
        }}
      >
        {/* <Form.Item name="title" label="Tên khóa học" rules={[{ required: true, message: "Vui lòng nhập tên khóa học" }]}>
          <Input placeholder="Ví dụ: Lập trình Python cơ bản" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} placeholder="Mô tả nội dung khóa học" />
        </Form.Item>

        <Form.Item name="image" label="Ảnh đại diện URL">
          <Input placeholder="https://example.com/image.jpg" />
        </Form.Item>

        <Form.Item name="price" label="Giá (VNĐ)">
          <InputNumber
            min={0}
            className="w-full"
            formatter={(value) => `${value}₫`}
            parser={(value) => value.replace("₫", "")}
          />
        </Form.Item>

        <Form.Item name="teacher_id" label="Giảng viên ID" rules={[{ required: true, message: "Cần có ID giảng viên" }]}>
          <InputNumber className="w-full" />
        </Form.Item>

        <Form.Item name="category_id" label="Danh mục ID" rules={[{ required: true, message: "Cần có ID danh mục" }]}>
          <InputNumber className="w-full" />
        </Form.Item>

        <Form.Item name="is_public" label="Công khai">
          <Switch defaultChecked />
        </Form.Item> */}
        {renderDynamicFormItems(fields1)}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Tạo khóa học
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateCourseForm;
