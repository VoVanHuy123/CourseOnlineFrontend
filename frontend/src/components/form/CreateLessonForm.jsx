import { Button, Form } from "antd";
import renderDynamicFormItems from "./DynamicFormItems";

 const lessonFields = [
  {
    name: "title",
    label: "Tiêu đề bài học",
    type: "input",
    placeholder: "VD: Giới thiệu React",
    rules: [{ required: true, message: "Vui lòng nhập tiêu đề bài học" }],
  },
  {
    name: "description",
    label: "Mô tả",
    type: "textarea",
    placeholder: "VD: Bài học giới thiệu về React và các thành phần cơ bản...",
    rules: [{ required: true, message: "Vui lòng nhập mô tả bài học" }],
  },
  {
    name: "type",
    label: "Loại bài học",
    type: "select",
    rules: [{ required: true, message: "Vui lòng chọn loại bài học" }],
    options: [
      { label: "Video", value: "video" },
      { label: "Tệp tài liệu (PDF, Word...)", value: "file" },
      { label: "Văn bản", value: "text" }
    ],
  },
  {
    name: "order",
    label: "Thứ tự",
    type: "number",
    placeholder: "VD: 1",
    rules: [],
  },
  {
    name: "is_published",
    label: "Công khai bài học",
    type: "switch",
    initialValue: true,
    rules: [],
  },
  {
    name: "content_url",
    label: "Tải lên file hoặc video",
    type: "upload", // Phần xử lý upload riêng (custom render)
    rules: [{ required: false }],
    // onChange: handleUploadChange
  },
];
 const CreateLessonForm = ({errorMsg,form,onFinish}) => {
    return (
      <>
        <h3 className="text-lg font-bold mb-4">Tạo bài học mới</h3>
        {errorMsg && (
          <div style={{ color: "red", marginBottom: 16 }}>
             {errorMsg}
          </div>
        )}
        <Form layout="vertical" form={form} onFinish={onFinish}>
          {renderDynamicFormItems(lessonFields)}
          <Button className="w-full" type="primary" htmlType="submit">Tạo bài học</Button>
        </Form>
      </>
    );
  };
export default CreateLessonForm;