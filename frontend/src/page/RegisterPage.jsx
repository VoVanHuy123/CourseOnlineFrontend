



import React, { useState } from "react";
import { Form, Input, Select, Button, message } from "antd";
import axios from "axios";
import renderDynamicFormItems from "../components/form/DynamicFormItems";
import BaseLayout from "../components/layout/BaseLayout";
import bgImage from "../assets/img/authBackground.jpg";
import useFetchApi from "../hooks/useFetchApi";
import { endpoints } from "../services/api";
import { useNavigate } from "react-router-dom";
import loginBackground from '../assets/img/authBackground.jpg'
import bookImage from '../assets/img/book2.jpg'


const { Option } = Select;

const RegisterPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  // const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student");
  const { loading, fetchApi } = useFetchApi()
  const navigate = useNavigate();

  const onFinish = async (values) => {
    messageApi.open({
      key: "register",
      type: "loading",
      content: "Đang gửi yêu cầu",
      duration: 5
    })
    const response = await fetchApi({
      method: "POST",
      url: endpoints["register"],
      data: values,
    });

    if (response.status === 201) {
      message.success("Đăng ký thành công!");
      messageApi.open({
        key: "register",
        type: "success",
        content: "Gửi yêu cầu thành công",
        duration: 5
      })
      setTimeout(() => {
        navigate("/"); // điều hướng sau 100ms để context cập nhật
      }, 100);
      form.resetFields();
      re
    } else {
      setErr(response.data.msg)
      message.error(response.error?.msg || "Đăng ký thất bại");
      messageApi.open({
        key: "register",
        type: "error",
        content: "Gửi yêu cầu thất bại",
        duration: 5
      })
    }
  };

  const accountFields = [
    { label: "Tên đăng nhập", name: "username", rules: [{ required: true }], type: "input" },
    { label: "Mật khẩu", name: "password", rules: [{ required: true }], type: "password" },
  ];
  const nameFields = [
    { label: "Họ và tên lót", name: "first_name", rules: [{ required: true }], type: "input" },
    { label: "Tên", name: "last_name", rules: [{ required: true }], type: "input" },
  ]
  const contactFields = [
    { label: "Số điện thoại", name: "phonenumber", rules: [{ required: true }], type: "input" },
    { label: "Email", name: "email", rules: [{ required: true }], type: "email" },
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
    { label: "Nơi công tác", name: "current_workplace", rules: [{ required: true, message: "Vui lòng nhập nơi công tác" }], type: "input" },
    { label: "Học vị", name: "degree", rules: [{ required: true, message: "Vui lòng nhập học vị" }], type: "input" },

  ];

  return (
  
    <div
      className=""
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className=" w-full py-16 flex items-center justify-center">
        <div className=" w-full max-w-[1200px] min-h-[85vh] relative z-10 flex items-center justify-center rounded-2xl shadow-lg border border-gray-500">
          <div className="w-full z-10 flex flex-row">
            {/* 11111111111111 */}
            <div className="basis-1/3 min-h-[85vh] flex items-center flex-col justify-center bg-white z-10"
              style={{
                width: "100%",
                maxWidth: 600,
                padding: 24,
                borderRadius: "8px 0px 0 8px",
                 backgroundImage: `url(${bookImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                 
              }}

            >


              <div className="z-10 text-center text-[#644A07] flex flex-col items-center justify-center basis-2/3">
                <h1 className="text-bold ">Chào mừng</h1>
                <p className="py-4 ">Hệ Thống Khóa Học Trực Tuyến</p>
                <h2 className="text-2xl ">Đăng kí ngay để truy cập vào nhiều khóa học bổ ích</h2>
              </div>
              <div className="z-10 basis-1/3">
                <Button className="bg-[#A08963] text-white" onClick={() => {
                  navigate("/login")
                }}>Đăng nhập</Button>
              </div>


            </div>
            {/* 222222222222222222222222 */}
            <div className="basis-2/3 flex items-center flex-col py-8 px-16 z-10">
              <Form className="w-full flex flex-col justify-between items-stretch" layout="vertical" form={form} onFinish={onFinish}>

                <div className="flex flex-row gap-4">
                  {renderDynamicFormItems(accountFields)}
                </div>
                <div className="flex flex-row gap-4">
                  {renderDynamicFormItems(nameFields)}
                </div>
                <div className="flex flex-row gap-4">
                  {renderDynamicFormItems(contactFields)}
                </div>
                <Form.Item
                  label="Vai trò"
                  name="role"
                  rules={[{ required: true }]}
                  key={role}
                >
                  <Select className="z-10 border border-black rounded-md" onChange={(value) => setRole(value)}>
                    <Option value="student">Học viên</Option>
                    <Option value="teacher">Giáo viên</Option>
                  </Select>
                </Form.Item>
                {renderDynamicFormItems(role === 'student' ? studentFields : teacherFields)}
                {role !== 'student' ? <p className="pb-8">Người dùng giáo viên phải đợi admin xác thực</p> : <></>}
                <div className="w-full flex justify-center items-center">
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      className="bg-[#A08963] hover:bg-[#B6896F] text-white w-64 h-12 transition-colors duration-300"
                    >
                      {loading ? "Đang đăng kí ..." : "Đăng kí"}
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            </div>
            {/* 33333333333333333333333 */}
            <div className="absolute top-0 bottom-0 left-0 right-0 z-0 blur-md"
                style={{
                  backgroundImage: `url(${loginBackground})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
          </div>

          
        </div>


      </div>


    </div>
  );
};

export default RegisterPage;
