



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
import loginBackground from '../assets/img/authBackground.jpg'
import bookImage from '../assets/img/paper.jpg'


const { Option } = Select;

const LoginPage = () => {
  const [form] = Form.useForm();
  // const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student");
  const { loading, fetchApi } = useFetchApi()
  const { login } = useContext(AuthContext)
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
      setTimeout(() => {
        navigate("/"); // điều hướng sau 100ms để context cập nhật
      }, 100);
      // navigate("/");//
    } else {
      message.error(response.error?.msg || "Đăng ký thất bại");
      // Hiển thị lỗi dưới các field
      const errorMessage = response.error?.msg || response.error || "Đăng nhập thất bại";
      if (response.error.field == "username") {
        form.setFields([
          {
            name: "username",
            errors: [errorMessage],
          },
        ]);
      } else {

        form.setFields([
          {
            name: "password",
            errors: [errorMessage],
          },
        ]);
      }
    }
  };

  const loginFields = [
    { label: "Tên đăng nhập", name: "username", rules: [{ required: true }], type: "input" },
    { label: "Mật khẩu", name: "password", rules: [{ required: true }], type: "password" },
  ]





  return (
    // <div
    //   style={{
    //     minHeight: "80vh",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     // background: "#f0f2f5",
    //     background: "#fff",

    //   }}
    // >
    //   <div
    //     className="flex flex-col justify-items-center"
    //     style={{
    //        width: "100%",
    //       maxWidth: 600,
    //       padding: 24,
    //       background: "#fff",
    //       borderRadius: 8,
    //       boxShadow: "0 0 10px rgba(0,0,0,0.1)",

    //     }}
    //   >
    //     <h2 style={{ textAlign: "center", marginBottom: 24, color:"black" }}>
    //       Đăng ký tài khoản
    //     </h2>
    //     <Form
    //     className="flex flex-col justify-center"
    //      layout="vertical" form={form} onFinish={onFinish}>

    //       {renderDynamicFormItems(loginFields)}
    //       <Form.Item style={{ textAlign: "center" }}>
    //         <Button htmlType="submit" type="primary">
    //           {loading ? "Đang đăng nhập ..." : "Đăng nhập"}
    //         </Button>
    //       </Form.Item>
    //     </Form>
    //   </div>
    // </div>
    <div
      style={{
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className=" w-full h-screen flex items-center justify-center">
        <div className=" min-w-[150vh] min-h-[85vh] relative z-10 flex items-center justify-center rounded-xl shadow-lg border border-gray-50">
          <div className="w-full z-10 flex flex-row">
            {/* form đănh nhập */}
            <div
              className="basis-1/3 min-h-[85vh] flex items-center flex-col justify-center bg-white"
              style={{
                width: "100%",
                maxWidth: 600,
                padding: 24,
                borderRadius: "8px 0px 0 8px",
              }}

            >


              <Form className="w-full h-[60vh] flex flex-col justify-between items-stretch" layout="vertical" form={form} onFinish={onFinish}>
                <h2 className="text-center text-xl text-[#A08963] mb-4 font-bold">
                  Đăng Nhập
                </h2>

                <div className="">

                  <Form.Item
                    name="username"       // quan trọng
                    rules={[{ required: true, message: "Vui lòng nhập username!" }]}
                  >
                    <Input

                      placeholder="Username"
                      className="border border-[#CFAB8D] h-12"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"       // quan trọng
                    rules={[{ required: true, message: "Vui lòng nhập password!" }]}
                  >
                    <Input.Password

                      placeholder="Password"
                      className="border border-[#CFAB8D] h-12"
                      autoComplete="off"
                    />
                  </Form.Item>
                </div>
                <div className="w-full flex justify-center">

                  <Form.Item>
                    <Button
                      htmlType="submit"
                      className="bg-[#A08963] hover:bg-[#B6896F] text-white w-64 h-12 transition-colors duration-300"
                    >
                      {loading ? "Đang đăng nhập ..." : "Đăng nhập"}
                    </Button>
                  </Form.Item>
                </div>
              </Form>


            </div>
            <div className="basis-2/3 flex justify-center items-center relative flex-col">


              <div className="z-10 text-center text-[#644A07] flex flex-col items-center justify-center basis-2/3">
                <h1 className="text-bold ">Chào mừng</h1>
                <p className="py-4 ">Hệ Thống Khóa Học Trực Tuyến</p>
                <h2 className="text-2xl ">"Học mọi lúc, mọi nơi – Vững bước tương lai."</h2>
              </div>
              <div className="z-10 basis-1/3">
                <Button className="bg-[#A08963] text-white" onClick={()=>{
                  navigate("/register")
                }}>Đăng ký ngay</Button>
              </div>
              <div className="absolute top-0 bottom-0 left-0 right-0 z-0"
                style={{
                  backgroundImage: `url(${bookImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>

            </div>
          </div>

          <div
            className="absolute top-0 bottom-0 left-0 right-0 z-0 blur-[10px]"
            style={{
              backgroundImage: `url(${bookImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}

          ></div>
        </div>


      </div>


    </div>
  );
};

export default LoginPage;
