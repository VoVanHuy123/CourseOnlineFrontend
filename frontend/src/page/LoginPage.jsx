



import React, { useContext, useState } from "react";
import { Form, Input, Select, Button, message } from "antd";
import axios from "axios";
import renderDynamicFormItems from "../components/form/DynamicFormItems";
import BaseLayout from "../components/layout/BaseLayout";
import bgImage from "../assets/img/authBackground.jpg";
import useFetchApi from "../hooks/useFetchApi";
import { endpoints } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const { Option } = Select;

const LoginPage = () => {
  const [form] = Form.useForm();
  // const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student");
  const {loading,fetchApi} = useFetchApi()
  const {login} = useContext(AuthContext)
  const navigate = useNavigate();

  const onFinish = async (values) => {
  const response = await fetchApi({
    method: "POST",
    url: endpoints["login"],
    data: values,
  });

  if (response.status === 200) {
    const { user, access_token } = response.data; //lấy từ response
    login(user, access_token); //gọi context login
    message.success("Đăng nhập thành công!");
    form.resetFields();
    navigate("/");//
  } else {
    message.error(response.error?.msg || "Đăng ký thất bại");
  }
};

  const loginFields = [
    { label: "Tên đăng nhập", name: "username", rules: [{ required: true }], type: "input" },
  { label: "Mật khẩu", name: "password", rules: [{ required: true }], type: "password" },
  ]
  




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
          
          {renderDynamicFormItems(loginFields)}

          <Form.Item>
            <Button htmlType="submit" type="primary">{loading? "Đang đăng nhập ..." : "Đăng nhập"}</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
