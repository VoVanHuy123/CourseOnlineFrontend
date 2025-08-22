import React, { useContext, useEffect, useState } from "react";
import { Form, Input, InputNumber, Button, Switch, Select, Upload, message } from "antd";
import renderDynamicFormItems from "../../components/form/DynamicFormItems";
import useFetchApi from "../../hooks/useFetchApi";
import { AuthContext } from "../../context/AuthContext";
import { endpoints } from "../../services/api";
import UpdateCourseForm from "../../components/form/UpdateCourseForm";
import { useParams } from "react-router-dom";

const { TextArea } = Input;



const UpdateCoure = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const { fetchApi } = useFetchApi();
  const { user } = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage(); 


  const loadCourse = async () => {
      try {
        const res = await fetchApi({
          method: "GET",
          url: `/courses/${id}`, // API lấy khóa học
        });
  
        if (res.status === 200) {
          setCourse(res.data);
          console.log(res.data)
        }
      } catch (err) {
        message.error("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
  const onFinish = async (values) => {
    const formData = new FormData();
    console.log(typeof(values.image?.length && values.image[0]?.originFileObj),values.image?.length && values.image[0]?.originFileObj)
    if (values.image?.length && values.image[0]?.originFileObj ) {
      formData.append("image", values.image[0].originFileObj);
    }else {
      formData.append("null_image", "");
    }
    if (values.image?.length && values.image[0]?.originFileObj ==0) {
      console.log("vào")
      formData.append("null_image", null);
    }

    Object.keys(values).forEach((key) => {
      if (key !== "image") {
        formData.append(key, values[key]);
      }
    });

    formData.append("teacher_id", user.id);
    console.log("=== FormData đang gửi ===");
for (let [key, value] of formData.entries()) {
  if (value instanceof File) {
    console.log(`${key}: [File] name=${value.name}, size=${value.size}, type=${value.type}`);
  } else {
    console.log(`${key}:`, value);
  }
}

    try {
      setLoading(true);

      await messageApi.open({
        type: "loading",
        content: "Đang cập nhật khóa học...",

      });

      const res = await fetchApi({
        method: "PATCH",
        url: endpoints["update_course"](id),
        data: formData,
      });

      if ( res.status === 200) {
        messageApi.success("Cập nhật khóa học thành công!");
        form.resetFields();
      } else {
        messageApi.error(res.error?.msg || "Cập nhật khóa học thất bại.");
      }
    } catch (error) {
      console.error(error);
      messageApi.error("Cập nhật khóa học thất bại.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    loadCourse();
  },[])
  useEffect(() => {
  if (course) {
    form.setFieldsValue({
      title: course.title,
      description: course.description,
      price: course.price,
      category_id: course.category_id,
      is_public: course.is_public,
      // is_sequential: course.is_sequential,
      image: course.image
        ? [
            {
              uid: "-1",
              name: course.image.split("/").pop(),
              status: "done",
              url: course.image,
            },
          ]
        : [],
    });
  }
}, [course, form]);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-2xl">
      {contextHolder}
      <UpdateCourseForm form = {form} onFinish={onFinish} course={course}/>
    </div>
  );
};

export default UpdateCoure;