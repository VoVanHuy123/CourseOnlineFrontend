import React, { useContext, useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Switch, Select, Upload, message } from "antd";
import renderDynamicFormItems from "../../components/form/DynamicFormItems";
import useFetchApi from "../../hooks/useFetchApi";
import { AuthContext } from "../../context/AuthContext";
import { endpoints } from "../../services/api";

const { TextArea } = Input;

const fields1 = [
  { name: "title", label: "Tên khóa học", rules: [{ required: true, message: "Vui lòng nhập tên khóa học" }], type: "input", placeholder: "VD: Lập trình React" },
  { name: "description", label: "Mô tả", type: "text", rules: [{ required: true, message: "Vui lòng mô tả khóa học" }], placeholder: "Mô tả nội dung khóa học" },
  { name: "image", label: "Ảnh đại diện", type: "upload" },
  { name: "price", label: "Giá (VNĐ)", type: "float", placeholder: "Nhập giá...", rules: [{ required: true, message: "Vui lòng nhập Giá khóa học" }] },
];

const CreateCourseForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { fetchApi } = useFetchApi();
  const { auth } = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage(); 

  const loadCategories = async () => {
    try {
      const res = await fetchApi({ method: "GET", url: endpoints["categories"] });
      if (res.status === 200) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const fields = [
    ...fields1,
    {
      name: "category_id",
      label: "Danh mục",
      type: "select",
      options: categoryOptions,
      rules: [{ required: true, message: "Cần chọn danh mục" }],
    },
  ];

  const onFinish = async (values) => {
    const formData = new FormData();

    if (values.image?.length && values.image[0]?.originFileObj) {
      formData.append("image", values.image[0].originFileObj);
    }

    Object.keys(values).forEach((key) => {
      if (key !== "image") {
        formData.append(key, values[key]);
      }
    });

    formData.append("teacher_id", auth.user.id);

    try {
      setLoading(true);

      await messageApi.open({
        type: "loading",
        content: "Đang tạo khóa học...",
        duration: 1.5,
      });

      const res = await fetchApi({
        method: "POST",
        url: endpoints["courses"],
        data: formData,
      });

      if (res.status === 201 || res.status === 200) {
        messageApi.success("Tạo khóa học thành công!");
        form.resetFields();
      } else {
        messageApi.error(res.error?.msg || "Tạo khóa học thất bại.");
      }
    } catch (error) {
      console.error(error);
      messageApi.error("Tạo khóa học thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-2xl">
      {contextHolder}
      <h1 className="text-2xl font-semibold mb-4 text-center">Tạo Khóa Học</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ is_public: true }}
      >
        {renderDynamicFormItems(fields)}

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
