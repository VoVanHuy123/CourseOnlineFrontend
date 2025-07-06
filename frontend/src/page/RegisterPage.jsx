



import React, { useState } from "react";
import { Form, Input, Select, Button, message } from "antd";
import axios from "axios";
import renderDynamicFormItems from "../components/form/DynamicFormItems";
import BaseLayout from "../components/layout/BaseLayout";
import bgImage from "../assets/img/authBackground.jpg";
import useFetchApi from "../hooks/useFetchApi";
import { endpoints } from "../services/api";

const { Option } = Select;

const RegisterPage = () => {
  const [form] = Form.useForm();
  // const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student");
  const {loading,fetchApi} = useFetchApi()

  const onFinish = async (values) => {
  const response = await fetchApi({
    method: "POST",
    url: endpoints["register"],
    data: values,
  });

  if (response.status === 201) {
    message.success("Đăng ký thành công!");
    form.resetFields();
  } else {
    message.error(response.error?.msg || "Đăng ký thất bại");
  }
};

  const userFields = [
    { label: "Tên đăng nhập", name: "username", rules: [{ required: true }], type: "input" },
  { label: "Mật khẩu", name: "password", rules: [{ required: true }], type: "password" },
  { label: "Họ và tên lót", name: "first_name", rules: [{ required: true }], type: "first_name" },
  { label: "Tên", name: "last_name", rules: [{ required: true }], type: "last_name" },
  ]
  const studentFields = [
  { label: "Mã sinh viên", name: "student_code", rules: [{ required: true }], type: "input" },
  { label: "Trường đại học", name: "university", rules: [{ required: true }], type: "input" },
  {
    label: "Giới tính", name: "gender", rules: [{ required: true }], type: "select",
    options: [
      { label: "Nam", value: "male" },
      { label: "Nữ", value: "female" },
      { label: "Khác", value: "orther" }
    ]
  }
];
const teacherFields = [
  { label: "Mã sinh viên", name: "student_code", rules: [{ required: true }], type: "input" },
  { label: "Trường đại học", name: "university", rules: [{ required: true }], type: "input" },
  { label: "Nơi công tác", name:"current_workplace", rules:[{ required: true, message: "Vui lòng nhập nơi công tác" }],type: "input"},
  {label:"Học vị",name:"degree",rules:[{ required: true, message: "Vui lòng nhập học vị" }],type: "input"},
  {
    label: "Giới tính", name: "gender", rules: [{ required: true }], type: "select",
    options: [
      { label: "Nam", value: "male" },
      { label: "Nữ", value: "female" },
      { label: "Khác", value: "orther" }
    ]
  }
];




  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // background: "#f0f2f5",
        background: "#fff",
        
      }}
    >
      
      <div
      
        style={{
           width: "100%",
          maxWidth: 600,
          padding: 24,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 24, color:"black" }}>
          Đăng ký tài khoản
        </h2>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true }]}
          >
            <Select onChange={(value) => setRole(value)}>
              <Option value="student">Học viên</Option>
              <Option value="teacher">Giáo viên</Option>
            </Select>
          </Form.Item>
          {renderDynamicFormItems(userFields)}
          {renderDynamicFormItems(role === 'student' ? studentFields : teacherFields)}

          <Form.Item>
            <Button htmlType="submit" type="primary">{loading? "Đang đăng kí ..." : "Đăng ký"}</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
