import { Button, Form } from "antd";
import renderDynamicFormItems from "./DynamicFormItems";
import { useEffect, useState } from "react";
import useFetchApi from "../../hooks/useFetchApi";
import { endpoints } from "../../services/api";

const UpdateCourseForm = ({form,errorMsg,onFinish,course})=>{
    const {fetchApi,loading}=useFetchApi()
    const [categories, setCategories] = useState([]);
    const fields1 = [
    { 
        name: "title", 
        label: "Tên khóa học", 
        rules: [{ required: true, 
            message: "Vui lòng nhập tên khóa học" }], 
            type: "input", 
        placeholder: "VD: Lập trình React" ,
        ...(course && { initialValue: course.title || null }),
        },
    { 
        name: "description", 
        label: "Mô tả", 
        type: "text", 
        rules: [{
            required: true, 
            message: "Vui lòng mô tả khóa học" }],
        placeholder: "Mô tả nội dung khóa học",
         ...(course && { initialValue: course.description || null }),
    },
    {
        name: "image", label: "Ảnh đại diện", 
        type: "upload",
        ...(course && { initialValue: [
                {
                    uid: "-1",
                    name: course.image ? course.image.split("/").pop() : "uploaded_img", // tên file từ URL
                    status: "done",
                    url: course.image,
                },
            ],
        } || null),
    },
    { 
        name: "price", 
        label: "Giá (VNĐ)", 
        type: "float", 
        placeholder: "Nhập giá...", 
        rules: [{ 
            required: true, 
            message: "Vui lòng nhập Giá khóa học" 
        }],
         ...(course && { initialValue: course.price || null }),
    },
    { 
        name: "is_public", 
        label: "Phát hành", 
        type: "switch", 
        placeholder: "...", 
        rules: [{ 
            required: false,
        }],
        //  ...(course && { initialValue: course.price || null }),
    },
     ];

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
    useEffect(() => {
        loadCategories();
      }, []);
    return(
        <>
            <h1 className="text-2xl font-semibold mb-4 text-center">Tạo Khóa Học</h1>
            {errorMsg && (
            <div style={{ color: "red", marginBottom: 16 }}>
                {errorMsg}
            </div>
            )}   
                  <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    // initialValues={{ is_public: true }}
                  >
                    {renderDynamicFormItems(fields)}
            
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Cập nhật khóa học
                      </Button>
                    </Form.Item>
                  </Form>
        </>
    );
    
};
export default UpdateCourseForm;