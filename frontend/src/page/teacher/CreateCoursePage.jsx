import React, { useContext, useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Switch, Select, Upload, message } from "antd";
import renderDynamicFormItems from "../../components/form/DynamicFormItems";
import useFetchApi from "../../hooks/useFetchApi";
import { AuthContext } from "../../context/AuthContext";
import { endpoints } from "../../services/api";
import CreateCourseForm from "../../components/form/CreateCourseForm";

const { TextArea } = Input;



const CreateCourse = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const { fetchApi } = useFetchApi();
  const { user } = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage(); 



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

    formData.append("teacher_id", user.id);

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
      <CreateCourseForm form = {form} onFinish={onFinish}/>
    </div>
  );
};

export default CreateCourse;
